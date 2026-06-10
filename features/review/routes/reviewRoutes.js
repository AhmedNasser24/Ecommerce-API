const express = require("express");
const {
  createReview,
  getReview,
  getAllReviewsForSpecificProduct,
  updateReview,
  deleteReview,
  createFilterObj,
} = require("../services/reviewServices");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getAllReviewsForSpecificProductValidator,
} = require("../validator/reviewValidator");
const AuthServices = require("../../user/services/authServices");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  AuthServices.protect,
  AuthServices.allowTo("user"),
  createReviewValidator,
  createReview,
);
router.get(
  "/",
  getAllReviewsForSpecificProductValidator,
  createFilterObj,
  getAllReviewsForSpecificProduct,
);
router.get("/:id", getReviewValidator, getReview);
router.put(
  "/:id",
  AuthServices.protect,
  AuthServices.allowTo("user"),
  updateReviewValidator,
  updateReview,
);
router.delete(
  "/:id",
  AuthServices.protect,
  AuthServices.allowTo("user", "admin"),
  deleteReviewValidator,
  deleteReview,
);

module.exports = router;
