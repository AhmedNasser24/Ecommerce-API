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
const {
  createCheckoutSession,
  paymobWebhook,
} = require("../services/paymentServices");
const authService = require("../../user/services/authServices");
const {
  createOrderValidator,
  getOrderValidator,
  updateOrderPayValidator,
  updateOrderDeliverdValidator
} = require("../validators/orderValidators");

// Paymob webhook — no auth needed (Paymob calls this directly)
router.post("/paymob-webhook", paymobWebhook);

router.use(authService.protect);
router.post("/:cartId", authService.allowTo("user"), createOrderValidator, createOrder);
router.post("/:cartId/checkout-session", authService.allowTo("user"), createOrderValidator, createCheckoutSession);
router.get("/",authService.allowTo("admin", "user"), createFilterObj, getOrders);
router.get("/:id",authService.allowTo("admin", "user"), getOrderValidator, getOrder);
router.put("/:id/pay",authService.allowTo("admin"), updateOrderPayValidator, updateOrderPay);
router.put("/:id/deliver",authService.allowTo("admin"), updateOrderDeliverdValidator, updateOrderDeliverd);
module.exports = router;
