const express = require("express");

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
const AuthServices = require("../../user/services/authServices");


const router = express.Router({mergeParams: true});
router.post(
  "/",
  AuthServices.protect,
  setCategoryIdToBody,
  createSubcategoryValidator,
  createSubcategory,
);
router.get("/", AuthServices.protect , createFilterObj, getSubcategories);
router.get("/:id", getSubcategoryValidator, getSubcategory);
router.put(
  "/:id",
  setCategoryIdToBody,
  AuthServices.protect,
  AuthServices.allowTo("admin"),
  updateSubcategoryValidator,
  updateSubcategory,
);
router.delete(
  "/:id",
  AuthServices.protect,
  AuthServices.allowTo("admin"),
  deleteSubcategoryValidator,
  deleteSubcategory,
);

module.exports = router;
