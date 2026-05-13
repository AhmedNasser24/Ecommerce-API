const ProductModel = require("../models/productModels");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/ApiError");
const slugify = require("slugify");
const ApiFeatures = require("../../../utils/apiFeatures");

const getAllProducts = asyncHandler(async (req, res) => {
  // 1) Get total count of documents
  const countDocuments = await ProductModel.countDocuments();

  // 2) Build mongoose query using ApiFeatures
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .paginate(countDocuments)
    .filter()
    .search("Product")
    .sort()
    .limitFields()
    .populate();

  // 3) Execute the query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;

  res.status(200).json({
    results: products.length,
    paginationResult,
    data: products,
  });
});

const createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  if (!req.body.priceAfterDiscount) {
    req.body.priceAfterDiscount = req.body.price;
  }
  const product = await ProductModel.create(req.body);
  if (!product) {
    return next(new ApiError("Product not created", 400));
  }
  res.status(201).json(product);
});

const getProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id)
    .populate("category")
    .populate("subcategory");
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json(product);
});
const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  )
    .populate("category")
    .populate("subcategory");
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json(product);
});
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(204).send();
});

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
