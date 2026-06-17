const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: [true, "Product title must be unique"],
    required: [true, "Product title is required"],
    minlength: [2, "Product title must be at least 2 characters"],
    maxlength: [32, "Product title must be at most 32 characters"],
  },
  slug: {
    type: String,
    unique: [true, "Product slug must be unique"],
    required: [true, "Product slug is required"],
    lowercase: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Product must belong to a category"],
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: [true, "Product must belong to a subcategory"],
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  stock : {
    type : Number,
    required : [true, "Product stock is required"],
    min : [1, "Product stock must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Product price must be at least 0"],
  },
  priceAfterDiscount : {
    type: Number,
    min: [0, "Product price must be at least 0"],
  },
  sold : {
    type: Number,
    default: 0,
    min: [0, "Product sold must be at least 0"],
  },
  coverImage : {
    type: String,
    required: [true, "Product cover image is required"],
  },
  images : [
    {
      type: String,
    },
  ],
  avgRating :{
    type: Number,
    default: 0,
  },
  ratingsQuantity :{
    type: Number,
    default: 0,
  },
  isActive : {
    type: Boolean,
    default: true,
  }
});



const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
