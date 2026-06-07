const express = require("express");
const {
  createReview,
  getReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../services/reviewServices");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../validator/reviewValidator");
const AuthServices = require("../../user/services/authServices");

const router = express.Router();

router.post(
  "/",
  AuthServices.protect,
  AuthServices.allowTo("user"),
  createReviewValidator,
  createReview,
);
router.get("/", getAllReviews);
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