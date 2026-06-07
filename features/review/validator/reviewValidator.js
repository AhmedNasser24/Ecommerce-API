const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../../middlewares/validatorMiddleware");
const ReviewModel = require("../models/reviewModels");
const ApiError = require("../../../utils/ApiError");

exports.createReviewValidator = [
  check("comment")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "Comment must be at least 3 characters and at most 100 characters",
    ),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid Product ID format")
    .custom(async(productId, { req }) => {
      const review = await ReviewModel.findOne({
        product: productId,
        user: req.user._id.toString(),
      });
    //   console.log("review", review.length);
      if (review) {
        throw new ApiError(
          "you can't make more than one review per product",
          400,
        );
      }
      return true;
    }),
  check("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Invalid User ID format").custom((id, { req }) => {
        
      if (id !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to create this review", 403);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review ID is required")
    .isMongoId()
    .withMessage("Invalid Review ID format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review ID is required")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async (id, { req }) => {
      const review = await ReviewModel.findById(id);
      if (!review) {
        throw new ApiError("No review found with ID" + id, 404);
      }
      console.log("review", review.user.toString()  );
      console.log("req.user._id", req.user._id.toString());
      if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to update this review", 403);
      }
      return true;
    }),
  check("comment")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "Comment must be at least 3 characters and at most 100 characters",
    ),
  check("rating")
    .optional()
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review ID is required")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async(id, { req }) => {
      const review = await ReviewModel.findById(id);
      if (!review) {
        throw new ApiError("No review found with ID" + id, 404);
      }
      if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError("You are not authorized to delete this review", 403);
      }
      return true;
    }),
  validatorMiddleware,
];
