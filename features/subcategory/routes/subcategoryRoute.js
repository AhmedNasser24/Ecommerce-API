const express = require("express");
const router = express.Router();
const {
  createSubcategory,
  getSubcategory,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subcategoryServices");
const {
  getSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
  createSubcategoryValidator,
} = require("../validator/subcategoryValidator");


router.post(
  "/",
  setCategoryIdToBody,
  createSubcategoryValidator,
  createSubcategory,
);
router.get("/", createFilterObj, getSubcategories);
router.get("/:id", getSubcategoryValidator, getSubcategory);
router.put(
  "/:id",
  setCategoryIdToBody,
  updateSubcategoryValidator,
  updateSubcategory,
);
router.delete("/:id", deleteSubcategoryValidator, deleteSubcategory);

module.exports = router;
