 const CategoryModel = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body; // نستخدم destructing لجلب الاسم

    // التحقق من وصول البيانات من Postman
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newCategory = new CategoryModel({ name });
    
    // نستخدم await لنضمن أن البرنامج "ينتظر" الحفظ قبل الانتقال للسطر التالي
    const savedCategory = await newCategory.save();
    
    console.log("Category Saved:", savedCategory); // لرؤيتها في Terminal الماك ميني
    res.status(201).json(savedCategory); // نرسل البيانات التي تم حفظها فعلياً

  } catch (error) {
    console.error("Error saving category:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};