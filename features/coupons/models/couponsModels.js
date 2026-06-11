const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      unique: [true, "Coupon name must be unique"],
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
      min: [1, "Coupon discount must be at least 1"],
      max: [100, "Coupon discount must be at most 100"],
    },
    expire : {
        type : Date,
        required : [true, "Coupon expire date is required"],
    }
  },
  { timestamps: true },
)

const CouponModel = mongoose.model("Coupon", couponSchema);

module.exports = CouponModel;
