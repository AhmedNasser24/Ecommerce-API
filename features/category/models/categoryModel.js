const mongoose = require("mongoose");
const slugify = require("slugify");

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
  },
  { timestamps: true }
);

CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  // @ts-ignore
  next();
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
