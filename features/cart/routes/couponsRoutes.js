const express = require("express");
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponsServices");
const {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../validators/couponsValidators");
const router = express.Router();
const authServices = require("../../user/services/authServices");


router.use(authServices.protect, authServices.allowTo("admin"));
router
  .route("/")
  .get(getCoupons)
  .post(createCouponValidator, createCoupon);

router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put( updateCouponValidator, updateCoupon)
  .delete( deleteCouponValidator, deleteCoupon);

module.exports = router;