const asyncHandler = require("express-async-handler");
const CartModel = require("../models/cartModels");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
// @desc add to cart
// @access Private , user
const addToCart = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  // 1) if no cart for user create new cart
  let cart = await CartModel.findOne({ user: userId });
  if (!cart) {
    cart = await CartModel.create({ user: userId, cartItems: [...req.body] });
  }
  // 2) if cart for user
  const productIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId,
  );
  // 3) if product in cart already
  if (productIndex !== -1) {
    cart.cartItems[productIndex].quantity = quantity;
  } else {
    cart.cartItems.push({ product: productId, quantity: quantity });
  }
  // 4) update the cart prices
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Cart item added successfully",
    data: cart,
  });
});

// exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
//   const { productId, quantity } = req.body;

//   if (quantity == 0) {
//     req.params.productId = productId;
//     removeCartItem(req, res, next);
//     return;
//   } else {
//     addToCart(req, res, next);
//   }
// });

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
  const productIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId,
  );
  if (productIndex !== -1) {
    cart.cartItems[productIndex] = req.body;
  } else {
    cart.cartItems.push(req.body);
  }
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Cart item added successfully",
    data: cart,
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

  res.status(201).json({
    status: "success",
    message: "Cart item removed successfully",
  });
});
