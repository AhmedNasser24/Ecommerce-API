const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrder,
  createFilterObj,
} = require("../services/orderServices");
const authService = require("../../user/services/authServices");
const {
  createOrderValidator,
  getOrderValidator,
} = require("../validators/orderValidators");

router.use(authService.protect);
router.post("/:cartId", authService.allowTo("user"), createOrderValidator, createOrder);
router.get("/",authService.allowTo("admin", "user"), createFilterObj, getOrders);
router.get("/:id",authService.allowTo("admin", "user"), getOrderValidator, getOrder);
module.exports = router;
