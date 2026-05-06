const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.log(error);
  process.exit(1);
})

const app = express();


// Middleware
app.use(express.json());    // parse request body into JSON

if(process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));  // logging requests
}

const CategorySchema = new mongoose.Schema({
  name : String 
})

const CategoryModel = mongoose.model("Category", CategorySchema);

app.post("/", async (req, res) => {
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
});

app.get("/", (req, res) => {
  res.send("Hello World!dsafdaf");
  console.log("You are welcome to my api");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
