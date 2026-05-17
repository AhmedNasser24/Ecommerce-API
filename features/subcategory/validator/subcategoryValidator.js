const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");
const slugify = require("slugify");

const getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validatorMiddleware,
];

const createSubcategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("SubCategory name must be between 2 and 32 characters")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid category ID"),
  validatorMiddleware,
];

const updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("SubCategory name must be between 2 and 32 characters"),
  check("category")
    .notEmpty()
    .withMessage("category ID is empty")
    .isMongoId()
    .withMessage("Invalid category ID")
    .optional(),
  validatorMiddleware,
];

const deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validatorMiddleware,
];

module.exports = {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
};
