const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    taxPrice: {
      type: Number,
      default: 0,
      min: [0, "Tax price must be at least 0"],
    },

    finalPrice: {
      type: Number,
      default: 0,
      min: [0, "Total order price must be at least 0"],
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      _id: mongoose.Schema.Types.ObjectId,
      alias: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    paidAt: {
      type: Date,
    },
    // deliveredAt: {
    //   type : Date,
    // },
    // shippedAt: {
    //   type : Date,
    // },
    // createdAt: {
    //   type : Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type : Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
