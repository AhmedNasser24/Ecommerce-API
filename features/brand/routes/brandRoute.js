const express = require("express");

const router = express.Router();
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validator/brandValidator");

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandServices");

const authService = require("../../user/services/authServices");

router.get("/", getBrands);

router.get("/:id", getBrandValidator, getBrand);

router.post(
  "/",
  authService.protect,
  authService.allowTo("admin"),
  uploadBrandImage,
  resizeImage,
  createBrandValidator,
  createBrand,
);

router.put(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  uploadBrandImage,
  resizeImage,
  updateBrandValidator,
  updateBrand,
);

router.delete(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  deleteBrandValidator,
  deleteBrand,
);

module.exports = router;
