const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const CartModel = require("../../cart/models/cartModels");
const OrderModel = require("../models/orderModels");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const { checkProductAvailability } = require("./checkProductAvailability");

// @desc    Create checkout session for card payment via Paymob (NO order created yet)
// @route   POST /api/v1/orders/:cartId/checkout-session
// @access  Protected/User
// @ts-ignore
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  // 1) Get user cart
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  if (cart.cartItems.length === 0) {
    return next(new ApiError("Cart is empty", 400));
  }

  // 2) Check product availability
  const isProductChanged = await checkProductAvailability(cart);
  if (isProductChanged) {
    return res.status(409).json({
      status: "fail",
      message:
        "Some items in your cart have been updated due to changes in availability or price. Please review your cart.",
      data: cart,
    });
  }

  // 3) Calculate the final price (in EGP)
  const finalPrice =
    cart.totalPriceAfterApplingCoupon ?? cart.totalPriceAfterDiscount;

  // 4) Build items array for Paymob
  const { shippingAddress } = req.body;
  const items = cart.cartItems.map((item) => ({
    name: `Product ${item.product}`,
    amount: Math.round((item.priceAfterDiscount || item.price) * 100), // amount in piasters
    quantity: item.quantity,
  }));

  // 5) Call Paymob Intention API — store order data in extras (order created later in webhook)
  const amountInPiasters = Math.round(finalPrice * 100);

  // Split user name into first and last name
  // @ts-ignore
  const nameParts = req.user.name ? req.user.name.split(" ") : ["N/A"];
  const firstName = nameParts[0] || "N/A";
  const lastName = nameParts.slice(1).join(" ") || "N/A";

  const intentionPayload = {
    amount: amountInPiasters,
    currency: "EGP",
    payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],
    items: items,
    billing_data: {
      first_name: firstName,
      last_name: lastName,
      // @ts-ignore
      email: req.user.email || "N/A",
      // @ts-ignore
      phone_number: req.user.phone || "N/A",
      apartment: "N/A",
      floor: "N/A",
      street: "N/A",
      building: "N/A",
      shipping_method: "N/A",
      postal_code: "N/A",
      city: "N/A",
      country: "EG",
      state: "N/A",
    },
    // Store all order data so the webhook can create the order after payment succeeds
    extras: {
      // @ts-ignore
      user_id: req.user._id.toString(),
      cart_id: cart._id.toString(),
      cart_items: JSON.stringify(cart.cartItems),
      shipping_address: JSON.stringify(shippingAddress || {}),
      final_price: String(finalPrice),
    },
  };

  try {
    // @ts-ignore
    const paymobResponse = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      intentionPayload,
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { client_secret } = paymobResponse.data;

    // Build the checkout URL
    const checkoutURL = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`;

    res.status(200).json({
      checkoutURL,
    });
  } catch (error) {
    const paymobError =
      error.response?.data?.message || error.response?.data || error.message;
    return next(
      new ApiError(`Paymob payment error: ${JSON.stringify(paymobError)}`, 500),
    );
  }
});

// @desc    Paymob webhook — verifies HMAC, creates order on success
// @route   POST /api/v1/orders/paymob-webhook
// @access  Public (called by Paymob servers)
// @ts-ignore
exports.paymobWebhook = asyncHandler(async (req, res) => {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  const receivedHmac = req.query.hmac;

  // The transaction object from Paymob
  const obj = req.body.obj;
  console.log("-------------paymob webhook is started-----------------");
  console.log("req.body is =>", req.body);
  if (!obj) {
    return res.status(400).json({ status: "fail", message: "Invalid payload" });
  }
  console.log("-------------paymob webhook is received-----------------");

  // Extract the specific fields Paymob uses for HMAC calculation
  // These fields must be concatenated in this exact order
  const hmacFields = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id,
    obj.owner,
    obj.pending,
    obj.source_data?.pan,
    obj.source_data?.sub_type,
    obj.source_data?.type,
    obj.success,
  ];

  const concatenatedString = hmacFields.join("");

  const calculatedHmac = crypto
    .createHmac("sha512", hmacSecret)
    .update(concatenatedString)
    .digest("hex");

  // Verify HMAC
  if (calculatedHmac !== receivedHmac) {
    console.error("Paymob HMAC verification failed");
    return res
      .status(403)
      .json({ status: "fail", message: "Invalid HMAC signature" });
  }

  // HMAC is valid — process the transaction
  const isSuccess = obj.success === true || obj.success === "true";

  // Get the extras data we stored during checkout
  const extras = obj.payment_key_claims?.extra || {};

  if (isSuccess) {
    // Parse the order data from extras
    const userId = extras.user_id;
    const cartId = extras.cart_id;
    const cartItems = JSON.parse(extras.cart_items || "[]");
    const shippingAddress = JSON.parse(extras.shipping_address || "{}");
    const finalPrice = Number(extras.final_price);
    const paymobOrderId = String(obj.order?.id);
    console.log("-------------------");
    console.log("paymobOrderId", paymobOrderId);
    console.log("finalPrice", finalPrice);
    console.log("shippingAddress", shippingAddress);
    console.log("cartItems", cartItems);
    console.log("userId", userId);
    console.log("cartId", cartId);
    console.log("-------------------");
    // Create the order now that payment is confirmed
    const order = await OrderModel.create({
      user: userId,
      cartItems: cartItems,
      shippingAddress: shippingAddress,
      finalPrice: finalPrice,
      paymentMethod: "card",
      paymentMethodType: "card",
      isPaid: true,
      paidAt: Date.now(),
      orderStatus: "processing",
      paymobOrderId: paymobOrderId,
    });

    // Update product stock (decrease) and increase sold
    const bulkOption = cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity, sold: item.quantity } },
      },
    }));
    if (bulkOption.length > 0) {
      await ProductModel.bulkWrite(bulkOption);
    }

    // Clear the user's cart
    if (cartId) {
      await CartModel.findByIdAndDelete(cartId);
    }

    console.log(`Order ${order._id} created and marked as paid via Paymob`);
  } else {
    // Payment failed — no order is created, nothing to do
    console.log("Payment failed via Paymob — no order created");
  }

  // Respond 200 to Paymob to acknowledge receipt
  res.status(200).json({ status: "success", message: "Webhook received" });
});

/* 
npm i ngrok --legacy-peer-deps
npx ngrok authtoken <your-authtoken>
*/

/* 
req.body is => {
  type: 'TRANSACTION',
  obj: {
    id: 494169016,
    pending: false,
    amount_cents: 10000,
    success: true,
    is_auth: false,
    is_capture: false,
    is_standalone_payment: true,
    is_voided: false,
    is_refunded: false,
    is_3d_secure: true,
    integration_id: 5754240,
    profile_id: 1189216,
    has_parent_transaction: false,
    order: {
      id: 563918836,
      created_at: '2026-07-11T15:18:18.401577',
      delivery_needed: false,
      merchant: [Object],
      collector: null,
      amount_cents: 10000,
      shipping_data: [Object],
      currency: 'EGP',
      is_payment_locked: false,
      is_return: false,
      is_cancel: false,
      is_returned: false,
      is_canceled: false,
      merchant_order_id: null,
      wallet_notification: null,
      paid_amount_cents: 10000,
      notify_user_with_email: false,
      items: [Array],
      order_url: 'NA',
      commission_fees: 0,
      delivery_fees_cents: 0,
      delivery_vat_cents: 0,
      payment_method: 'tbc',
      merchant_staff_tag: null,
      api_source: 'OTHER',
      data: [Object],
      payment_status: 'PAID',
      terminal_version: null,
      payme_details: null
    },
    created_at: '2026-07-11T15:24:19.437354',
    transaction_processed_callback_responses: [],
    currency: 'EGP',
    source_data: { pan: '1111', type: 'card', tenure: null, sub_type: 'Visa' },
    api_source: 'OTHER',
    terminal_id: null,
    merchant_commission: 0,
    accept_fees: 0,
    installment: null,
    discount_details: [],
    amount_cents_int: 10000,
    is_void: false,
    is_refund: false,
    data: {
      gateway_integration_pk: 5754240,
      klass: 'MigsPayment',
      created_at: '2026-07-11T12:25:40.993169',
      amount: 10000,
      currency: 'EGP',
      migs_order: [Object],
      merchant: 'TESTMERCH_C_25P',
      migs_result: 'SUCCESS',
      migs_transaction: [Object],
      txn_response_code: 'APPROVED',
      acq_response_code: '00',
      message: 'Approved',
      merchant_txn_ref: '494169016',
      order_info: '563918836',
      receipt_no: '619212303622',
      transaction_no: '123456789012345',
      batch_no: 20260711,
      authorize_id: '303622',
      card_type: 'VISA',
      card_num: '411111xxxxxx1111',
      secure_hash: '',
      avs_result_code: '',
      avs_acq_response_code: '00',
      captured_amount: 100,
      authorised_amount: 100,
      refunded_amount: 0,
      acs_eci: '05'
    },
    is_hidden: false,
    payment_key_claims: {
      extra: [Object],
      user_id: 2377190,
      currency: 'EGP',
      order_id: 563918836,
      created_by: 2377190,
      is_partner: false,
      amount_cents: 10000,
      billing_data: [Object],
      redirect_url: 'https://accept.paymob.com/unifiedcheckout/payment-status?payment_token=ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5WDJsa0lqb3lNemMzTVRrd0xDSmhiVzkxYm5SZlkyVnVkSE1pT2pFd01EQXdMQ0pqZFhKeVpXNWplU0k2SWtWSFVDSXNJbWx1ZEdWbmNtRjBhVzl1WDJsa0lqbzFOelUwTWpRd0xDSnZjbVJsY2w5cFpDSTZOVFl6T1RFNE9ETTJMQ0ppYVd4c2FXNW5YMlJoZEdFaU9uc2labWx5YzNSZmJtRnRaU0k2SW1Gb2JXVmtJaXdpYkdGemRGOXVZVzFsSWpvaWJtRnpjMlZ5SURFaUxDSnpkSEpsWlhRaU9pSk9MMEVpTENKaWRXbHNaR2x1WnlJNklrNHZRU0lzSW1ac2IyOXlJam9pVGk5Qklpd2lZWEJoY25SdFpXNTBJam9pVGk5Qklpd2lZMmwwZVNJNklrNHZRU0lzSW5OMFlYUmxJam9pVGk5Qklpd2lZMjkxYm5SeWVTSTZJa1ZISWl3aVpXMWhhV3dpT2lKaGFDNXBZbkpoYUdsbGJUWTJRR2R0WVdsc0xtTnZiU0lzSW5Cb2IyNWxYMjUxYldKbGNpSTZJakF4TURZMk5UQTFPRGs0SWl3aWNHOXpkR0ZzWDJOdlpHVWlPaUpPTDBFaUxDSmxlSFJ5WVY5a1pYTmpjbWx3ZEdsdmJpSTZJazVCSW4wc0lteHZZMnRmYjNKa1pYSmZkMmhsYmw5d1lXbGtJanBtWVd4elpTd2laWGgwY21FaU9uc2liM0prWlhKZmFXUWlPaUkyWVRVeU16UTRPVEJtTVdZNU56UXlNMkk0WldFM09XSWlMQ0p0WlhKamFHRnVkRjl2Y21SbGNsOXBaQ0k2Ym5Wc2JIMHNJbk5wYm1kc1pWOXdZWGx0Wlc1MFgyRjBkR1Z0Y0hRaU9tWmhiSE5sTENKamNtVmhkR1ZrWDJKNUlqb3lNemMzTVRrd0xDSnBjMTl3WVhKMGJtVnlJanBtWVd4elpTd2libVY0ZEY5d1lYbHRaVzUwWDJsdWRHVnVkR2x2YmlJNkluQnBYM1JsYzNSZk1qZ3laVE5rTlRrM1l6SXpOREl3TmprMVltVTBabVZqWXpNeE9EVmxZalFpZlEudG5uYmRmYmJTaE9GNldnWlQ0UWhBcGt1Qnp3elpHTHgzSXZSVnJLV3lCOTBSbWZ5YzJXLTRfcG9OaE1sRjhNMXZ5b2xRSkZhODI3VXhhY1g5U0N1NXc=&trx_id=494169016',
      integration_id: 5754240,
      lock_order_when_paid: false,
      next_payment_intention: 'pi_test_282e3d597c23420695be4fecc3185eb4',
      single_payment_attempt: false
    },
    error_occured: false,
    is_live: false,
    other_endpoint_reference: null,
    refunded_amount_cents: 0,
    refunded_amount_cents_int: 0,
    source_id: -1,
    is_captured: false,
    captured_amount: 0,
    captured_amount_int: 0,
    settlement_amount_cents_int: 0,
    merchant_staff_tag: null,
    accept_fees_cents_int: 0,
    vat_cents_int: 0,
    vat_cents_float: null,
    updated_at: '2026-07-11T15:25:41.003059',
    is_settled: false,
    bill_balanced: false,
    is_bill: false,
    owner: 2377190,
    parent_transaction: null
  },
  accept_fees: 0,
  issuer_bank: null,
  transaction_processed_callback_responses: ''
}
*/
