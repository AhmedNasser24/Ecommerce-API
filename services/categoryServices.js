const CategoryModel = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body; // نستخدم destructing لجلب الاسم
  const newCategory = new CategoryModel({ name, slug: slugify(name) });

  // نستخدم await لنضمن أن البرنامج "ينتظر" الحفظ قبل الانتقال للسطر التالي
  const savedCategory = await newCategory.save();

  console.log("Category Saved:", savedCategory); // لرؤيتها في Terminal الماك ميني
  res.status(201).json(savedCategory); // نرسل البيانات التي تم حفظها فعلياً
});


exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json(category);
});

// @desc    Update category by ID
// @route   PUT /api/categories/:id
// @access  Private

exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    ~{ new: true },
  );
  if (!category) {
    res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json(category);
});

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    res.status(404).json({ message: "Category not found" });
  }
  res.status(200).send;
});
