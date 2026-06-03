const express = require("express");
const { signup, login, forgetPassword } = require("../services/authServices");
const { signupValidator, loginValidator , forgetPasswordValidator} =
  require("../validator/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
module.exports = router;