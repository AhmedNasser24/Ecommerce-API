const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Category name must be unique"],
      required: [true, "Category name is required"],
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [32, "Category name must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
  },
  { timestamps: true }
);



const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
