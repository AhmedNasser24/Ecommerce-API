const asyncHandler = require("express-async-handler");
const CartModel = require("../../cart/models/cartModels");
const OrderModel = require("../models/orderModels");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const { calcCartPriceAndQuantity } = require("../../cart/services/cartServices");
const factory = require("../../../utils/handlersFactory");
// @desc Create order
// routes : api/v1/orders/:cartId
// access : protected/user

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


const checkProductAvailability = async(cart) =>{
  const productIds = cart.cartItems.map((item) => item.product);
  const products = await ProductModel.find({ _id: { $in: productIds } });
  
  let cartChanged = false;
  const validCartItems = [];

  for (const item of cart.cartItems) {
    const product = products.find((p) => p._id.toString() === item.product.toString());

    if (!product || !product.isActive) {
      cartChanged = true;
      continue;
    }

    let itemChanged = false;

    if (item.price !== product.price) {
      item.price = product.price;
      itemChanged = true;
    }

    if (item.priceAfterDiscount !== product.priceAfterDiscount) {
      item.priceAfterDiscount = product.priceAfterDiscount;
      itemChanged = true;
    }

    if (product.stock === 0) {
      cartChanged = true;
      continue;
    } else if (item.quantity > product.stock) {
      item.quantity = product.stock;
      itemChanged = true;
    }

    if (itemChanged) {
      cartChanged = true;
    }
    validCartItems.push(item);
  }

  if (cartChanged) {
    cart.cartItems = validCartItems;
    calcCartPriceAndQuantity(cart);
    await cart.save();
    return cartChanged ;
    
  }
}

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

