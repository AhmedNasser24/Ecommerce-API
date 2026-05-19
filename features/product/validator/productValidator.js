const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");
const SubCategoryModel = require("../../subcategory/models/subcategoryModel");
const CategoryModel = require("../../category/models/categoryModel");
const BrandModel = require("../../brand/models/brandModel");
const slugify = require("slugify");

const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Product title must be at most 32 characters")
    .custom((title, { req }) => {
      req.body.slug = slugify(title);
      return true;
    }),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .custom((price, { req }) => {
      if (price <= 0) {
        throw new Error("Product price can't be negative or zero");
      }
      if (!req.body.priceAfterDiscount) {
        req.body.priceAfterDiscount = price;
      } else if (req.body.priceAfterDiscount > price) {
        throw new Error(
          "Product priceAfterDiscount must be less than product price",
        );
      }
      return true;
    }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Product priceAfterDiscount can't be negative or zero");
      }
      return true;
    }),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number")
    .custom((value) => {
      if (value < 1) {
        throw new Error("Product quantity must be at least 1");
      }
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid product category ID")
    .custom(async (categoryId) => {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),
  check("subcategory")
    .notEmpty()
    .withMessage("Product subcategory is required")
    .isMongoId()
    .withMessage("Invalid product subcategory ID")
    .custom(async (subId, { req }) => {
      const subcategory = await SubCategoryModel.findById(subId);
      if (!subcategory) {
        throw new Error("Subcategory not found");
      } else if (subcategory.category.toString() !== req.body.category) {
        throw new Error("Subcategory is not belonging to this category");
      }
      return true;
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid product brand ID")
    .custom(async (brandId) => {
      const brand = await BrandModel.findById(brandId);
      if (!brand) {
        throw new Error("Brand  not found");
      }
      return true;
    }),
  check("coverImage").notEmpty().withMessage("Product cover image is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array"),
  validatorMiddleware,
];

const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID"),
  validatorMiddleware,
];

const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID"),
  ...createProductValidator,
  validatorMiddleware,
];

const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID"),
  validatorMiddleware,
];

module.exports = {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
