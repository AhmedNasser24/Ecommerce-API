const { check } = require("express-validator");

const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");

exports.createOrderValidator = [
  check("cartId")
    .notEmpty()
    .withMessage("Cart id is required")
    .isMongoId()
    .withMessage("Invalid cart id"),
  check("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required")
    .isObject()
    .withMessage("Shipping address must be an object")
    .custom((address) => {
      if ( !address.alias || !address.address) {
        throw new Error("Shipping address must contain  alias and address");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getOrderValidator = [
  check("id")
    .notEmpty()
    .withMessage("Order id is required")
    .isMongoId()
    .withMessage("Invalid order id"),
  validatorMiddleware,
];
exports.updateOrderPayValidator = [
  check("id")
    .notEmpty()
    .withMessage("Order id is required")
    .isMongoId()
    .withMessage("Invalid order id"),
  check("isPaid")
    .notEmpty()
    .withMessage("Is paid is required")
    .isBoolean()
    .withMessage("Is paid must be a boolean"),
  validatorMiddleware,
];
exports.updateOrderDeliverdValidator = [
  check("id")
    .notEmpty()
    .withMessage("Order id is required")
    .isMongoId()
    .withMessage("Invalid order id"),
  check("isDelivered")
    .notEmpty()
    .withMessage("isDelivered is required")
    .isBoolean()
    .withMessage("isDelivered must be a boolean"),
  validatorMiddleware,
];
