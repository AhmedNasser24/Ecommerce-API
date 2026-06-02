
const express = require("express");
const router = express.Router();
const {
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator
} = require("../validator/userValidator");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../services/userServices");
const authService = require("../services/authServices");
router.use(authService.protect);
router.use(authService.allowTo("admin"));
router.route("/").get(getAllUsers).post(createUserValidator,createUser);
router
  .route("/:id")
  .get(getUser)
  .put(updateUserValidator,updateUser)
  .delete(deleteUserValidator,deleteUser);
router.put("/changePassword/:id",changePasswordValidator,changePassword);
module.exports = router;
