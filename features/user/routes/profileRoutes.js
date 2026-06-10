const express = require("express");

const router = express.Router();
const {
    getMyProfileValidator,
    updateMyProfileValidator,
} = require("../validator/profileValidator");
const {
    getMyProfile,
    updateMyProfile,
} = require("../services/profileServices");
const authService = require("../services/authServices");


router.use(authService.protect);
router
  .route("/")
  .get(
    authService.allowTo("user", "admin"),
    getMyProfileValidator,
    getMyProfile,
  )
  .put(
    authService.allowTo("user", "admin"),
    updateMyProfileValidator,
    updateMyProfile,
  );

module.exports = router;