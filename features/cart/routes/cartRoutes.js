const express = require("express");
const router = express.Router();

const {
  removeCartItem,
  addNewCartItem,
  updateCartItemQuantity,
  getLoggedUserCart,
} = require("../services/cartServices");
const authServices = require("../../user/services/authServices");
const {
  removeCartItemValidator,
  addNewCartItemValidator,
  updateCartItemQuantityValidator,
} = require("../validators/cartValidators");

router.use(authServices.protect, authServices.allowTo("user"));
router.get("/", getLoggedUserCart);
router.delete("/:id", removeCartItemValidator, removeCartItem);
router.post("/", addNewCartItemValidator, addNewCartItem);
router.put("/:id", updateCartItemQuantityValidator, updateCartItemQuantity);

module.exports = router;
