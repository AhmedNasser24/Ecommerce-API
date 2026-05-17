const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");
const slugify = require("slugify");

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters")
    .custom((name , {req}) => {req.body.slug = slugify(name); return true;}),
  check("image").notEmpty().withMessage("Category image is required"),
  validatorMiddleware,
];

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  ...createCategoryValidator,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validatorMiddleware,
];

module.exports = {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
