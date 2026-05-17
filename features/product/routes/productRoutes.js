const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  resizeProductImages,
  uploadProductImages
} = require("../services/productServices");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validator/productValidator");

router.get("/", getAllProducts);
router.get("/:id", getProductValidator, getProduct);
router.post("/", uploadProductImages,resizeProductImages, createProductValidator, createProduct);
router.put("/:id", uploadProductImages,resizeProductImages, updateProductValidator, updateProduct);
router.delete("/:id", deleteProductValidator, deleteProduct);

module.exports = router;
