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
    image: String,
  },
  { timestamps: true }
);


const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandModel;
