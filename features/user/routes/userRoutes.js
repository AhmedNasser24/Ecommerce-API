
const express = require("express");
const router = express.Router();
const {
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
} = require("../validator/userValidator");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../services/userServices");

router.route("/").get(getAllUsers).post(createUserValidator,createUser);
router
  .route("/:id")
  .get(getUser)
  .put(updateUserValidator,updateUser)
  .delete(deleteUserValidator,deleteUser);

module.exports = router;
