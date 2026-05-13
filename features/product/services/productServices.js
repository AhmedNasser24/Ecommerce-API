const ProductModel = require("../models/productModels");
const factory = require("../../../utils/handlersFactory");

// @desc    Create product
// @route   POST /api/products
// @access  Private
exports.createProduct = factory.createOne(ProductModel);

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = factory.getAll(ProductModel, "Product");

// @desc    Get specific product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = factory.getOne(ProductModel, "category subcategory");

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(ProductModel);

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(ProductModel);
