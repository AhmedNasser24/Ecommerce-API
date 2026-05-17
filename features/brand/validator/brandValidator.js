const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters"),
  check("image").optional(),

  validatorMiddleware,
];

const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validatorMiddleware,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  ...createBrandValidator,
];

const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validatorMiddleware,
];

module.exports = {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
