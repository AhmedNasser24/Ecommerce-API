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
  const categories = await CategoryModel.find();
  res.status(200).json(categories);
});