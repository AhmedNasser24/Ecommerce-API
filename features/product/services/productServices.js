// @ts-nocheck
const ProductModel = require("../models/productModels");
const factory = require("../../../utils/handlersFactory");
const {uploadMixOfImages }= require("../../../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

exports.uploadProductImages = uploadMixOfImages([
  {name:"coverImage", maxCount: 1},
  {name:"images", maxCount: 5}
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();
  if(req.files.coverImage){
    const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}-cover.jpeg`;
    await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 2000)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`);
    req.body.coverImage = filename;
  }

  if(req.files.images){
    const imagePaths = [];
    for (let i = 0; i < req.files.images.length; i++) {
      const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}-image.jpeg`;
      await sharp(req.files.images[i].buffer)
        .resize(2000, 2000)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${filename}`);
      imagePaths.push(filename);
    }
    req.body.images = imagePaths;
  }

  next();
});

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
exports.getProduct = factory.getOne(ProductModel);

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(ProductModel);

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(ProductModel);
