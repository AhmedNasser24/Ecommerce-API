const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModels");
const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/ApiError");
// @ts-ignore
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
  const accessToken = generateToken(user._id);
  res.status(201).json({ _id: user._id, role: user.role, accessToken });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  // @ts-ignore
  const accessToken = generateToken(user._id);
  res.status(200).json({
    ...sanatizeUser(user),
    accessToken,
  });
});

// @ts-ignore
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exists in the request headers
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }
  if (!accessToken) {
    return next(new ApiError("You are not logged in", 401));
  }
  // 2) verify token and is not expired
  
  const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
  console.log(decodedToken);

  // 3) verify user is exist
  // @ts-ignore
  const currentUser = await UserModel.findById(decodedToken._id);
  if (!currentUser) {
    return next(new ApiError("User not found", 401));
  }

  // 4) Check if the user is active
  if (!currentUser.isActive) {
    return next(new ApiError("User is not active", 401));
  }
  
  // 5) check if password was changed after the token was generated
  if (currentUser.passwordChangedAt) {
    // تحويل التاريخ لثوانٍ لمقارنته مع iat
    // @ts-ignore
    const passwordChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    
    // @ts-ignore
    if (decodedToken.iat < passwordChangedTimestamp) {
      return next(new ApiError('User recently changed password! Please login again.', 401));
    }
  }
  
  // @ts-ignore
  req.user = currentUser;
  next();
  
});

exports.allowTo = (...roles) => asyncHandler(async (req, res, next) => {
  // @ts-ignore
  if (!roles.includes(req.user.role)) {
    return next(new ApiError("You are not authorized to perform this action", 403));
  }
  next();
});
