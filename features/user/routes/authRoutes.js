const express = require("express");
const { signup } = require("../services/authServices");
const { signupValidator } = require("../validator/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);

module.exports = router;