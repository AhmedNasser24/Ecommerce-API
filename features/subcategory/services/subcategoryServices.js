const SubCategoryModel = require("../models/subcategoryModel");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const factory = require("../../../utils/handlersFactory");

// Middleware to set category ID to body for nested creation
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Middleware to create filter object for nested routes
exports.createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filterObj = filter;
  next();
};

// @desc    Create subcategory
// @route   POST /api/subcategories
// @access  Private
exports.createSubcategory = factory.createOne(SubCategoryModel);

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
exports.getSubcategories = factory.getAll(SubCategoryModel);

// @desc    Get specific subcategory by ID
// @route   GET /api/subcategories/:id
// @access  Public
exports.getSubcategory = factory.getOne(SubCategoryModel);

// @desc    Update subcategory by ID
// @route   PUT /api/subcategories/:id
// @access  Private
exports.updateSubcategory = factory.updateOne(SubCategoryModel);

// @desc    Delete subcategory by ID
// @route   DELETE /api/subcategories/:id
// @access  Private
exports.deleteSubcategory = factory.deleteOne(SubCategoryModel, async (id) => {
  const products = await ProductModel.countDocuments({ subcategory: id });
  if (products > 0) {
    return new ApiError(
      `Cannot delete subcategory that contains ${products} products. Delete them first.`,
      400
    );
  }
  return null;
});
