const express = require("express");
const router = express.Router();
const {
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator,

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

router
  .route("/")
  .get(authService.allowTo("admin"), getAllUsers)
  .post(authService.allowTo("admin"), createUserValidator, createUser);

router
  .route("/:id")
  .get(authService.allowTo("admin"), getUser)
  .put(authService.allowTo("admin"), updateUserValidator, updateUser)
  .delete(authService.allowTo("admin"), deleteUserValidator, deleteUser);
  
router.put(
  "/changePassword/:id",
  authService.allowTo("user", "admin"),
  changePasswordValidator,
  changePassword,
);


module.exports = router;
