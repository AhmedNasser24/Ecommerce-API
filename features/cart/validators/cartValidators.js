const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");

exports.addNewCartItemValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Invalid quantity")
    .custom((value) => {
      if (value < 1) {
        throw new Error("Quantity must be at least 1");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.removeCartItemValidator = [
  check("id").isMongoId().withMessage("Invalid cart item ID"),
  validatorMiddleware,
];
