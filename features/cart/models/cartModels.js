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

cartSchema.statics.calcTotalCartPriceAndQuantity = async function (cartId) {
  const result = await this.aggregate([
    {
      $match: { _id: cartId },
    },
    {
      $unwind: "$cartItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItems.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $group: {
        _id: "$_id",
        totalQuantity: { $sum: "$cartItems.quantity" },
        totalPrice: {
          $sum: { $multiply: ["$cartItems.quantity", "$productDetails.price"] },
        },
      },
    },
  ]);

  if (result.length > 0) {
    await this.findByIdAndUpdate(cartId, {
      totalPrice: result[0].totalPrice,
      totalQuantity: result[0].totalQuantity,
    });
  } else {
    await this.findByIdAndUpdate(cartId, {
      totalPrice: 0,
      totalQuantity: 0,
    });
  }
};

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
