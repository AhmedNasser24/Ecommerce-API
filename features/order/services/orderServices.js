const asyncHandler = require("express-async-handler");
const CartModel = require("../../cart/models/cartModels");
const OrderModel = require("../models/orderModels");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const { checkProductAvailability } = require("./checkProductAvailability");
const factory = require("../../../utils/handlersFactory");
// @desc Create order
// routes : api/v1/orders/:cartId
// access : protected/user

// @ts-ignore
exports.createOrder = asyncHandler(async (req, res, next) => {
  // 1) get user cart
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  if (cart.cartItems.length === 0) {
    return next(new ApiError("Cart is empty", 400));
  }

  // 2) check product availability (stock,price,priceAfterDiscount, is_delete)
  const isProductChanged=await checkProductAvailability(cart)
  if(isProductChanged){
    return res.status(409).json({
      status: "fail",
      message: "Some items in your cart have been updated due to changes in availability or price. Please review your cart.",
      data: cart
    });
  }

  // 3) create order
  const { shippingAddress } = req.body;
  const order = await OrderModel.create({
    // @ts-ignore
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress : shippingAddress,
    finalPrice:
      cart.totalPriceAfterApplingCoupon ?? cart.totalPriceAfterDiscount,
  });
  // 4) update product stock (decrease) and increase sold
  // for each product in cartItems update stock and sold
  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stock: -item.quantity, sold: item.quantity } },
    },
  }));
  if (bulkOption.length > 0) {
    await ProductModel.bulkWrite(bulkOption);
  }

  // 5) clear cart
  // await CartModel.findByIdAndDelete(req.params.cartId);
  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});



exports.createFilterObj = asyncHandler(async (req, res, next) => {
    // @ts-ignore
    if (req.user.role == 'user') {
      // @ts-ignore
      req.filterObj = {user:req.user._id};
    }
   
    next();
})
exports.getOrders = factory.getAll(OrderModel , "Order");

exports.getOrder = factory.getOne(OrderModel);

exports.updateOrderPay = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  const order = await OrderModel.findById(req.params.id);
  if(!order){
    return next(new ApiError("Order not found", 404));
  }
  order.isPaid = req.body.isPaid;
  // @ts-ignore
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
})

exports.updateOrderDeliverd = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  const order = await OrderModel.findById(req.params.id);
  if(!order){
    return next(new ApiError("Order not found", 404));
  }
  order.isDelivered = req.body.isDelivered;
  // @ts-ignore
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
})
