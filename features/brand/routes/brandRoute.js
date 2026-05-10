const express = require("express");

const router = express.Router();
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validators/brandValidator");

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandServices");

router.get("/", getBrands);

router.get("/:id", getBrandValidator, getBrand);

router.post("/", createBrandValidator, createBrand);

router.put("/:id", updateBrandValidator, updateBrand);

router.delete("/:id", deleteBrandValidator, deleteBrand);

module.exports = router;
