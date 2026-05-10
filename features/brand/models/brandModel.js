const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "brand name must be unique"],
      required: [true, "brand name is required"],
      minlength: [2, "brand name must be at least 2 characters"],
      maxlength: [32, "brand name must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const BrandModel = mongoose.model("brand", BrandSchema);

module.exports = BrandModel;
