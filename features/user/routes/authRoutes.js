const express = require("express");
const { signup, login } = require("../services/authServices");
const { signupValidator, loginValidator } =
  require("../validator/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
module.exports = router;