const express = require("express");
const router = express.Router();

const {
  removeCartItem,
  addNewCartItem,
  updateCartItemQuantity,
  applyCoupon,
  getLoggedUserCart,
} = require("../services/cartServices");
const authServices = require("../../user/services/authServices");
const {
  removeCartItemValidator,
  addNewCartItemValidator,
  updateCartItemQuantityValidator,
  applyCouponValidator
} = require("../validators/cartValidators");

router.use(authServices.protect, authServices.allowTo("user"));
router.get("/", getLoggedUserCart);
router.delete("/:id", removeCartItemValidator, removeCartItem);
router.post("/", addNewCartItemValidator, addNewCartItem);
router.put("/:id", updateCartItemQuantityValidator, updateCartItemQuantity);
router.put("/applyCoupon/:couponId", applyCouponValidator, applyCoupon);
module.exports = router;
