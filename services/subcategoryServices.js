const SubCategoryModel = require("../models/subcategoryModel");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");


// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
exports.getSubcategories = asyncHandler(async (req, res, next) => {
  const subcategories = await SubCategoryModel.find();
  res.status(200).json(subcategories);
});






exports.createSubcategory = asyncHandler(async (req, res,next) => {
  const { name, category } = req.body;
  const subcategory = await SubCategoryModel.create({ name, slug: slugify(name), category });
  if (!subcategory) {
    return next(new ApiError("Failed to create subcategory", 404));
  }
  res.status(201).json(subcategory);
});

exports.getSubcategory = asyncHandler(async (req, res,next) => {
  const { id } = req.params;
  const subcategory = await SubCategoryModel.findById(id);
  if (!subcategory) {
    return next(new ApiError("SubCategory not found", 404));
  }
  res.status(200).json(subcategory);
});




exports.updateSubcategory = asyncHandler(async (req, res,next) => {
  const { id } = req.params;
  const { name , category } = req.body;
  const subcategory = await SubCategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) , category }, { new: true });
  if (!subcategory) {
    return next(new ApiError("SubCategory not found", 404));
  }
  res.status(200).json(subcategory);
});

exports.deleteSubcategory = asyncHandler(async (req, res,next) => {
  const { id } = req.params;
  const subcategory = await SubCategoryModel.findByIdAndDelete(id);
  if (!subcategory) {
    return next(new ApiError("SubCategory not found", 404));
  }
  res.status(200).json(subcategory);
});