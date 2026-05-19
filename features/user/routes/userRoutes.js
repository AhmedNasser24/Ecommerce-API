const express = require("express");
const router = express.Router();
const userServices = require("../services/userServices");

router.route("/").get(userServices.getAllUsers).post(userServices.createUser);
router
  .route("/:id")
  .get(userServices.getUser)
  .put(userServices.updateUser)
  .delete(userServices.deleteUser);

module.exports = router;
