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
     paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
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
    paymobOrderId: {
      type: String,
    },
   
 
    // shippedAt: {
    //   type : Date,
    // },
  },
  { timestamps: true },
);

// populate the order with user and cart items
orderSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.populate({ path: "user", select: "name email phone" });
  // @ts-ignore
  this.populate({ path: "cartItems.product", select: "title price" });
  next;
});

module.exports = mongoose.model("Order", orderSchema);
