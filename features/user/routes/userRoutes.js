const express = require("express");
const router = express.Router();
const {
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator,
  getMyProfileValidator,
  updateMyProfileValidator,
} = require("../validator/userValidator");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  getMyProfile,
  updateMyProfile,
} = require("../services/userServices");
const authService = require("../services/authServices");
router.use(authService.protect);

router
  .route("/")
  .get(authService.allowTo("admin"), getAllUsers)
  .post(authService.allowTo("admin"), createUserValidator, createUser);

router
  .route("/:id")
  .get(authService.allowTo("admin"), getUser)
  .put(authService.allowTo("admin"), updateUserValidator, updateUser)
  .delete(authService.allowTo("admin"), deleteUserValidator, deleteUser);
router.put("/changePassword/:id", changePasswordValidator, changePassword);

router
  .route("/profile/:id")
  .get(getMyProfileValidator, getMyProfile)
  .put(updateMyProfileValidator, updateMyProfile);
module.exports = router;
