const factory = require("../../../utils/handlersFactory");
const asyncHandler = require("express-async-handler");
const ReviewModel = require("../models/reviewModels");


// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Private
exports.getAllReviews = factory.getAll(ReviewModel);

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Private
exports.getReview = factory.getOne(ReviewModel);

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = factory.createOne(ReviewModel);

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = factory.updateOne(ReviewModel);

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = factory.deleteOne(ReviewModel);

