const CategoryModel = require("../models/categoryModel");
const SubCategoryModel = require("../../subcategory/models/subcategoryModel");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const factory = require("../../../utils/handlersFactory");
const sharp = require("sharp");
const { uploadSingleImage } = require("../../../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const filename = `category-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(800, 800)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);

  // Attach the filename to the request
  req.body.image = filename;

  next();
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private
exports.createCategory = factory.createOne(CategoryModel);

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = factory.getAll(CategoryModel);

// @desc    Get specific category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = factory.getOne(CategoryModel);

// @desc    Update category by ID
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(CategoryModel);

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel, async (id) => {
  const subcategories = await SubCategoryModel.countDocuments({ category: id });
  if (subcategories > 0) {
    return new ApiError(
      `Cannot delete category that contains ${subcategories} subcategories. Delete them first.`,
      400
    );
  }

  const products = await ProductModel.countDocuments({ category: id });
  if (products > 0) {
    return new ApiError(
      `Cannot delete category that contains ${products} products. Delete them first.`,
      400
    );
  }
  return null;
});
