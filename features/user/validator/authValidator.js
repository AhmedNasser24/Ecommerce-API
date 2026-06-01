const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const UserModel = require("../models/userModels");

exports.signupValidator = [
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
  
  validatorMiddleware,
];