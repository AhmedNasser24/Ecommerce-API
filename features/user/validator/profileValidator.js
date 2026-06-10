const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");
const slugify = require("slugify");

const ApiError = require("../../../utils/ApiError");


exports.getMyProfileValidator = [
  
  validatorMiddleware,
];

exports.updateMyProfileValidator = [
  
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
    ,
  check("image").optional(),
  check("address").optional(),

  // Prevent updating these fields in this endpoint
  check("password").isEmpty().withMessage("Password cannot be changed in this endpoint"),
  check("email").isEmpty().withMessage("Email cannot be changed in this endpoint"),
  check("role").isEmpty().withMessage("Role cannot be changed in this endpoint"),
  
  validatorMiddleware,
];

