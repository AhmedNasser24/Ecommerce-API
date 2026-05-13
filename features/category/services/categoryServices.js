const CategoryModel = require("../models/categoryModel");
const SubCategoryModel = require("../../subcategory/models/subcategoryModel");
const ProductModel = require("../../product/models/productModels");
const ApiError = require("../../../utils/ApiError");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../../../utils/apiFeatures");
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body; // نستخدم destructing لجلب الاسم
  const newCategory = new CategoryModel({ name, slug: slugify(name) });

  // نستخدم await لنضمن أن البرنامج "ينتظر" الحفظ قبل الانتقال للسطر التالي
  const savedCategory = await newCategory.save();

  res.status(201).json(savedCategory); // نرسل البيانات التي تم حفظها فعلياً
});


exports.getCategories = asyncHandler(async (req, res) => {
  const countDocuments = await CategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
    .paginate(countDocuments)
    .filter()
    .search()
    .sort()
    .limitFields();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;

  res.status(200).json({
    results: categories.length,
    paginationResult,
    data: categories,
  });
});

exports.getCategory = asyncHandler(async (req, res , next) => {
  const { id} = req.params;
  console.log(id)
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`Category with ID ${id} not found`, 404));
  }
  res.status(200).json(category);
});

// @desc    Update category by ID
// @route   PUT /api/categories/:id
// @access  Private

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true },
  );
  if (!category) {
    return next(new ApiError(`Category with ID ${id} not found`, 404));
  }
  res.status(200).json(category);
});

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 1) Check if category has subcategories
  const subcategories = await SubCategoryModel.countDocuments({ category: id });
  if (subcategories > 0) {
    return next(
      new ApiError(
        `Cannot delete category that contains ${subcategories} subcategories. Delete them first.`,
        400,
      ),
    );
  }

  // 2) Check if category has products
  const products = await ProductModel.countDocuments({ category: id });
  if (products > 0) {
    return next(
      new ApiError(
        `Cannot delete category that contains ${products} products. Delete them first.`,
        400,
      ),
    );
  }

  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`Category with ID ${id} not found`, 404));
  }
  res.status(204).send();
});
