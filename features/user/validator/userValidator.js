const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const UserModel = require("../models/userModels");
const ApiError = require("../../../utils/ApiError");
const bcrypt = require("bcrypt");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Name must be at most 32 characters long")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (email) => {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom(async (password, { req }) => {
      if (req.body.confirmPassword !== password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number")
    .isLength({ min: 8 })
    .withMessage("Phone must be at least 8 characters long")
    .isLength({ max: 32 })
    .withMessage("Phone must be at most 32 characters long"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be user or admin"),
  check("image").optional(),
  check("address").optional(),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Name must be at most 32 characters long")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number")
    .isLength({ min: 8 })
    .withMessage("Phone must be at least 8 characters long")
    .isLength({ max: 32 })
    .withMessage("Phone must be at most 32 characters long"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be user or admin"),
  check("image").optional(),
  check("address").optional(),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required")
    .isLength({ min: 6 })
    .withMessage("Current Password must be at least 6 characters long")
    .custom(async (currentPassword, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new ApiError("No user found with ID", 404);
      }
      const isMatched = await bcrypt.compare(currentPassword, user.password );
      if (!isMatched) {
        throw new ApiError("Incorrect current password", 401);
      }
      return true;
    }),
  check("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 6 })
    .withMessage("New Password must be at least 6 characters long")
    .custom((newPassword, { req }) => {
      if (req.body.confirmPassword !== newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
  validatorMiddleware,
];
