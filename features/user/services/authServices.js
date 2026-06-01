const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModels");
const jwt = require("jsonwebtoken");
exports.signup = asyncHandler(async (req, res) => {
  // create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    
  });
  // sign token
  // @ts-ignore
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_DATE,
  });
  res.status(201).json({ data: user, token });
});
