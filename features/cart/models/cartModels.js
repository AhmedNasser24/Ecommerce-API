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
    cartItems: [
      {
        id : mongoose.Schema.Types.ObjectId,
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
      },
    ],
  },
  { timestamps: true },
);


const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
