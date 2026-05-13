const BrandModel = require("../models/brandModel");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const factory = require("../../../utils/handlersFactory");

// @desc    Create brand
// @route   POST /api/brands
// @access  Private
exports.createBrand = factory.createOne(BrandModel);

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = factory.getAll(BrandModel);

// @desc    Get specific brand by ID
// @route   GET /api/brands/:id
// @access  Public
exports.getBrand = factory.getOne(BrandModel);

// @desc    Update brand by ID
// @route   PUT /api/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc    Delete brand by ID
// @route   DELETE /api/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(BrandModel, async (id) => {
  const products = await ProductModel.countDocuments({ brand: id });
  if (products > 0) {
    return new ApiError(
      `Cannot delete brand that contains ${products} products. Delete them first.`,
      400
    );
  }
  return null;
});
