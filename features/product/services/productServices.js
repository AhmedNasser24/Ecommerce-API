const ProductModel = require("../models/productModels");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/ApiError");
const slugify = require("slugify");

const getAllProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const products = await ProductModel.find().skip(skip).limit(limit);
  res.status(200).json(products);
});

const createProduct = asyncHandler(async (req, res,next) => {
  req.body.slug = slugify(req.body.title);
  if(!req.body.priceAfterDiscount){
    req.body.priceAfterDiscount = req.body.price;
  }
  const product = await ProductModel.create(req.body);
  if (!product) {
    return next(new ApiError("Product not created", 400));
  }
  res.status(201).json(product);
});

const getProduct = asyncHandler(async (req, res) => {});
const updateProduct = asyncHandler(async (req, res) => {});
const deleteProduct = asyncHandler(async (req, res) => {});

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
