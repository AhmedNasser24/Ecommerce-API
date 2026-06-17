const express = require("express");
const router = express.Router();

const { createOrder } = require("../services/orderServices");
const authService = require("../../user/services/authServices");
const { createOrderValidator } = require("../validators/orderValidators");

router.use(authService.protect, authService.allowTo("user"));
router.post("/:cartId",createOrderValidator, createOrder);

module.exports = router;