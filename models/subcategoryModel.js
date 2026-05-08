const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "SubCategory name must be unique"],
    required: [true, "SubCategory name is required"],
    minlength: [2, "SubCategory name must be at least 2 characters"],
    maxlength: [32, "SubCategory name must be at most 32 characters"],
  },
  
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "SubCategory must belong to a category"],
  },
});

const SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategoryModel;