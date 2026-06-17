const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    totalPrice: Number,
    totalQuantity: Number,
    totalPriceAfterDiscount: {
      type: Number,
      
      min: [0, "Price after discount must be at least 0"],
    },
    totalPriceAfterApplingCoupon: {
      type: Number,
      min: [0, "Price after appling coupon must be at least 0"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be at least 0"],
      max: [100, "Discount must be at most 100"],
    },
    cartItems: [
      {
        id: mongoose.Schema.Types.ObjectId,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          default: 1,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price must be at least 0"],
        },
        priceAfterDiscount: {
          type: Number,
          required: [true, "Price after discount is required"],
          min: [0, "Price after discount must be at least 0"],
        },
      },
    ],
  },
  { timestamps: true },
);

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
