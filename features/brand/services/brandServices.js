const BrandModel = require("../models/brandModel");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../../../utils/apiFeatures");
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body; // نستخدم destructing لجلب الاسم
  const newBrand = new BrandModel({ name, slug: slugify(name) });

  // نستخدم await لنضمن أن البرنامج "ينتظر" الحفظ قبل الانتقال للسطر التالي
  const savedBrand = await newBrand.save();

  res.status(201).json(savedBrand); // نرسل البيانات التي تم حفظها فعلياً
});

exports.getBrands = asyncHandler(async (req, res) => {
  const countDocuments = await BrandModel.countDocuments();
  const apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
    .paginate(countDocuments)
    .filter()
    .search()
    .sort()
    .limitFields();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;

  res.status(200).json({
    results: brands.length,
    paginationResult,
    data: brands,
  });
});

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`brand with ID ${id} not found`, 404));
  }
  res.status(200).json(brand);
});

// @desc    Update category by ID
// @route   PUT /api/categories/:id
// @access  Private

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await BrandModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true },
  );
  if (!brand) {
    return next(new ApiError(`brand with ID ${id} not found`, 404));
  }
  res.status(200).json(brand);
});

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 1) Check if brand has products
  const products = await ProductModel.countDocuments({ brand: id });
  if (products > 0) {
    return next(
      new ApiError(
        `Cannot delete brand that contains ${products} products. Delete them first.`,
        400,
      ),
    );
  }

  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`brand with ID ${id} not found`, 404));
  }
  res.status(204).send();
});
