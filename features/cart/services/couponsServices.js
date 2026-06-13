const CouponModel = require("../models/couponsModels");
const factory = require("../../../utils/handlersFactory");

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private
exports.createCoupon = factory.createOne(CouponModel);

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Public
exports.getCoupons = factory.getAll(CouponModel);

// @desc    Get specific coupon by ID
// @route   GET /api/coupons/:id
// @access  Public
exports.getCoupon = factory.getOne(CouponModel);

// @desc    Update coupon by ID
// @route   PUT /api/coupons/:id
// @access  Private
exports.updateCoupon = factory.updateOne(CouponModel);

// @desc    Delete coupon by ID
// @route   DELETE /api/coupons/:id
// @access  Private
exports.deleteCoupon = factory.deleteOne(CouponModel);
