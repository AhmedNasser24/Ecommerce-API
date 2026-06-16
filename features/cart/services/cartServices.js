const asyncHandler = require("express-async-handler");
const CartModel = require("../models/cartModels");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const CouponModel = require("../models/couponsModels");
// @desc add to cart
// @access Private , user

// @ts-ignore
const calcCartPriceAndQuantity = (cart) => {
  let totalPrice = 0;
  let totalQuantity = 0;
  let totalPriceAfterDiscount = 0;
  const discount = cart.discount;
  // @ts-ignore
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
    totalQuantity += item.quantity;
    totalPriceAfterDiscount += item.priceAfterDiscount * item.quantity;
    // @ts-ignore
    cart.totalPrice = totalPrice;
    // @ts-ignore
    cart.totalQuantity = totalQuantity;
    // @ts-ignore
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    // @ts-ignore
    cart.totalPriceAfterApplingCoupon = totalPriceAfterDiscount-(totalPriceAfterDiscount*discount/100);
  });
};

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  const { productId, quantity } = req.body;
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user._id;

  let cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  const cartItemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === id,
  );

  if (cartItemIndex === -1) {
    return next(new ApiError("Cart item not found", 404));
  }
  const product = await ProductModel.findById(req.body.productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  if (quantity > product.stock) {
    return next(new ApiError("Quantity is out of stock", 400));
  }
  if (quantity == 0) {
    return next(new ApiError("Quantity must be at least 1", 400));
  }
  cart.cartItems[cartItemIndex].quantity = quantity;

  calcCartPriceAndQuantity(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart item updated successfully",
    data: cart.cartItems[cartItemIndex],
  });
});

exports.addNewCartItem = asyncHandler(async (req, res, next) => {
  //   @ts-ignore
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const product = await ProductModel.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  if (product.stock < quantity) {
    return next(new ApiError("Product is out of stock", 400));
  }
  req.body.price = product.price;
  req.body.priceAfterDiscount = product.priceAfterDiscount;
  req.body.product = product._id;
  let cart = await CartModel.findOne({ user: userId });
  if (!cart) {
    cart = await CartModel.create({ user: userId, cartItems: [req.body] });
  }
  let cartItemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId,
  );
  if (cartItemIndex !== -1) {
    cart.cartItems[cartItemIndex] = req.body;
  } else {
    cart.cartItems.push(req.body);
    cartItemIndex = cart.cartItems.length - 1;
  }

  calcCartPriceAndQuantity(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Cart item added successfully",
    data: cart.cartItems[cartItemIndex],
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  //   @ts-ignore
  const userId = req.user._id;
  const cartItemId = req.params.id;

  let cart = await CartModel.findOneAndUpdate(
    { user: userId },
    { $pull: { cartItems: { _id: cartItemId } } },
    { new: true },
  );
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  calcCartPriceAndQuantity(cart);
  await cart.save();
  res.status(201).json({
    status: "success",
    message: "Cart item removed successfully",
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  //   @ts-ignore
  const userId = req.user._id;
  const { populate } = req.query;
  let query = CartModel.findOne({ user: userId });
  if (populate) {
    // @ts-ignore
    const populateOpt = populate.split(",").join(" ");
    query = query.populate(populateOpt);
  }
  const cart = await query;
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  calcCartPriceAndQuantity(cart);
  res.status(200).json({
    status: "success",
    results: cart.cartItems.length,
    data: cart,
  });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await CouponModel.findOne({
    _id: req.params.couponId,
    name: req.body.couponName,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Invalid or expired coupon", 400));
  }
  // @ts-ignore
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  cart.discount = coupon.discount;
  calcCartPriceAndQuantity(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: cart,
  });
});
