const express = require("express");
const router = express.Router();
const {
  createSubcategory,
  getSubcategory,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
} = require("../services/subcategoryServices");
const {
  getSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
  createSubcategoryValidator,
} = require("../validators/subcategoryValidator");

router.mergeParams = true;

router.post(
  "/",
  setCategoryIdToBody,
  createSubcategoryValidator,
  createSubcategory,
);
router.get("/", getSubcategories);
router.get("/:id", getSubcategoryValidator, getSubcategory);
router.put(
  "/:id",
  setCategoryIdToBody,
  updateSubcategoryValidator,
  updateSubcategory,
);
router.delete("/:id", deleteSubcategoryValidator, deleteSubcategory);

module.exports = router;
