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
