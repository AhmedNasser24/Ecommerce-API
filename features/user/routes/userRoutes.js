const express = require("express");
const router = express.Router();
const {
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator,
  getMyProfileValidator,
} = require("../validator/userValidator");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  getMyProfile,
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

router.get("/profile/:id", getMyProfileValidator, getMyProfile);
module.exports = router;
