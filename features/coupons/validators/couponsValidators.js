const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");
const CouponModel = require("../models/couponsModels");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isLength({ min: 3 })
    .withMessage("Coupon name is too short")
    .isLength({ max: 100 })
    .withMessage("Coupon name is too long")
    .trim()
    .custom(async (name) => {
      const coupon = await CouponModel.findOne({ name: name.toUpperCase() });
      if (coupon) {
        return Promise.reject(new Error("Coupon name already exists"));
      }
      return true;
    }),

  check("discount")
    .notEmpty()
    .withMessage("Coupon discount is required")
    .isNumeric()
    .withMessage("Coupon discount must be a number")
    .isLength({ min: 1 })
    .withMessage("minimum discount is 1%")
    .isLength({ max: 100 })
    .withMessage("maximum discount is 100%")
    .trim(),

  check("expire")
    .notEmpty()
    .withMessage("Coupon expire date is required")
    .isDate()
    .withMessage("Coupon expire date must be a date")
    .trim(),

  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Coupon name is too short")
    .isLength({ max: 100 })
    .withMessage("Coupon name is too long")
    .trim()
    .custom(async (name) => {
      const coupon = await CouponModel.findOne({ name: name.toUpperCase() });
      if (coupon) {
        return Promise.reject(new Error("Coupon name already exists"));
      }
      return true;
    }),

  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Coupon discount must be a number")
    .isLength({ min: 1 })
    .withMessage("minimum discount is 1%")
    .isLength({ max: 100 })
    .withMessage("maximum discount is 100%")
    .trim(),

  check("expire")
    .optional()
    .isDate()
    .withMessage("Coupon expire date must be a date")
    .trim(),

  validatorMiddleware,
];

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id"),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id"),
  validatorMiddleware,
];
