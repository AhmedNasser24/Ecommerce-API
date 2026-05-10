const CategoryModel = require("../models/categoryModel");
const ApiError = require("../../../utils/ApiError");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body; // نستخدم destructing لجلب الاسم
  const newCategory = new CategoryModel({ name, slug: slugify(name) });

  // نستخدم await لنضمن أن البرنامج "ينتظر" الحفظ قبل الانتقال للسطر التالي
  const savedCategory = await newCategory.save();

  res.status(201).json(savedCategory); // نرسل البيانات التي تم حفظها فعلياً
});


exports.getCategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
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
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`Category with ID ${id} not found`, 404));
  }
  res.status(204).send();
});
