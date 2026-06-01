const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModels");
const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/ApiError");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  // @ts-ignore
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_DATE,
  });
};

const sanatizeUser = function (user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    image: user.image,
    address: user.address,
    isActive: user.isActive,
  };
};

exports.signup = asyncHandler(async (req, res) => {
  // create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // sign token
  const token = generateToken(user._id);
  res.status(201).json({ _id: user._id, role: user.role, token });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  // @ts-ignore
  const token = generateToken(user._id);
  res.status(200).json({
    ...sanatizeUser(user),
    token,
  });
});
