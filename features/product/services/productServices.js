const ProductModel = require("../models/productModels");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/ApiError");
const slugify = require("slugify");

const getAllProducts = asyncHandler(async (req, res) => {
  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // filteration
  const queryObj = { ...req.query };
  const excludedFields = ["page", "limit", "sort", "fields"];
  excludedFields.forEach((field) => delete queryObj[field]);
  console.log(queryObj);
  // Apply filtration using [gte, gt, lte, lt]
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // 2) Sorting
  let sortBy;
  if (req.query.sort) {
    
    // @ts-ignore
    sortBy = req.query.sort.split(",").join(" ");
  } else {
    sortBy = "-createdAt";
  }

  // build mongoose query
  let mongooseQuery = ProductModel.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .populate("category")
    .populate("subcategory");

  //get all products
  const products = await mongooseQuery;

  res.status(200).json({
    results:products.length,
    page,
    data : products,
    
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
