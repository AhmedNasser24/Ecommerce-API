const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const CartModel = require("../../cart/models/cartModels");
const OrderModel = require("../models/orderModels");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const { checkProductAvailability } = require("./checkProductAvailability");

// @desc    Create checkout session for card payment via Paymob
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

  // 4) Create the order in DB with paymentMethod "card" and status "pending"
  const { shippingAddress } = req.body;
  const order = await OrderModel.create({
    // @ts-ignore
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: shippingAddress,
    finalPrice: finalPrice,
    paymentMethod: "card",
    paymentMethodType: "card",
  });

  // 5) Build items array for Paymob
  const items = cart.cartItems.map((item) => ({
    name: `Product ${item.product}`,
    amount: Math.round((item.priceAfterDiscount || item.price) * 100), // amount in piasters
    quantity: item.quantity,
  }));

  // 6) Call Paymob Intention API
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
    // Store the order ID so we can find it in the webhook
    extras: {
      order_id: order._id.toString(),
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
      }
    );

    const { client_secret } = paymobResponse.data;
    const paymobOrderId = paymobResponse.data.id;

    // Save paymob order reference
    order.paymobOrderId = String(paymobOrderId);
    await order.save();

    // Build the checkout URL
    const checkoutURL = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`;

    res.status(200).json({
      status: "success",
      data: {
        order,
        checkoutURL,
      },
    });
  } catch (error) {
    // If Paymob call fails, delete the order we just created
    await OrderModel.findByIdAndDelete(order._id);

    const paymobError =
      error.response?.data?.message ||
      error.response?.data ||
      error.message;
    return next(
      new ApiError(`Paymob payment error: ${JSON.stringify(paymobError)}`, 500)
    );
  }
});

// @desc    Paymob webhook callback — verifies HMAC and marks order as paid
// @route   POST /api/v1/orders/paymob-webhook
// @access  Public (called by Paymob servers)
// @ts-ignore
exports.paymobWebhook = asyncHandler(async (req, res) => {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  const receivedHmac = req.query.hmac;

  // The transaction object from Paymob
  const obj = req.body.obj;
  console.log("-------------paymob webhook is started-----------------")
  console.log("req.body is =>", req.body)
  if (!obj) {
    return res.status(400).json({ status: "fail", message: "Invalid payload" });
  }
  console.log("-------------paymob webhook is recived-----------------")
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

  // Find the order by paymobOrderId
  const paymobOrderId = String(obj.order?.id);
  const order = await OrderModel.findOne({ paymobOrderId });

  // if (!order) {
  //   console.error(`Order not found for paymobOrderId: ${paymobOrderId}`);
  //   return res
  //     .status(404)
  //     .json({ status: "fail", message: "Order not found" });
  // }

  // if (isSuccess) {
  //   // Mark order as paid
  //   order.isPaid = true;
  //   // @ts-ignore
  //   order.paidAt = Date.now();
  //   order.orderStatus = "processing";
  //   await order.save();

  //   // Update product stock (decrease) and increase sold
  //   const bulkOption = order.cartItems.map((item) => ({
  //     updateOne: {
  //       filter: { _id: item.product },
  //       update: { $inc: { stock: -item.quantity, sold: item.quantity } },
  //     },
  //   }));
  //   if (bulkOption.length > 0) {
  //     await ProductModel.bulkWrite(bulkOption);
  //   }

  //   console.log(`Order ${order._id} marked as paid via Paymob`);
  // } else {
  //   // Payment failed
  //   order.orderStatus = "cancelled";
  //   await order.save();
  //   console.log(`Order ${order._id} payment failed via Paymob`);
  // }

  // Respond 200 to Paymob to acknowledge receipt
  res.status(200).json({ status: "success", message: "Webhook received" });
});

/* 
npm i ngrok --legacy-peer-deps
npx ngrok authtoken <your-authtoken>
*/

