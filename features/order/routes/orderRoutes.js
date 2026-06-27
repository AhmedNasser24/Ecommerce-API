const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrder,
  createFilterObj,
  updateOrderPay,
  updateOrderDeliverd,
} = require("../services/orderServices");
const authService = require("../../user/services/authServices");
const {
  createOrderValidator,
  getOrderValidator,
  updateOrderPayValidator,
  updateOrderDeliverdValidator
} = require("../validators/orderValidators");

router.use(authService.protect);
router.post("/:cartId", authService.allowTo("user"), createOrderValidator, createOrder);
router.get("/",authService.allowTo("admin", "user"), createFilterObj, getOrders);
router.get("/:id",authService.allowTo("admin", "user"), getOrderValidator, getOrder);
router.put("/:id/pay",authService.allowTo("admin"), updateOrderPayValidator, updateOrderPay);
router.put("/:id/deliver",authService.allowTo("admin"), updateOrderDeliverdValidator, updateOrderDeliverd);
module.exports = router;
