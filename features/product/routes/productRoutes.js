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
const authService = require("../../user/services/authServices");
const reviewRoute = require("../../review/routes/reviewRoutes")  ;


router.use("/:productId/reviews", reviewRoute) ;



router.get("/", getAllProducts);
router.get("/:id", getProductValidator, getProduct);
router.post("/", authService.protect, authService.allowTo("admin"),uploadProductImages,resizeProductImages, createProductValidator, createProduct);
router.put("/:id", authService.protect, authService.allowTo("admin"),uploadProductImages,resizeProductImages, updateProductValidator, updateProduct);
router.delete("/:id", authService.protect, authService.allowTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
