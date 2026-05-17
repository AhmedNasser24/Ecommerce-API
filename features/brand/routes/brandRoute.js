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

router.get("/", getBrands);

router.get("/:id", getBrandValidator, getBrand);

router.post("/", uploadBrandImage, resizeImage, createBrandValidator, createBrand);

router.put("/:id", uploadBrandImage, resizeImage, updateBrandValidator, updateBrand);

router.delete("/:id", deleteBrandValidator, deleteBrand);

module.exports = router;
