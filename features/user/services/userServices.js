const factory = require("../../../utils/handlersFactory");
const UserModel = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/ApiError");
const bcrypt = require("bcrypt");
const { sanatizeUser } = require("../../../utils/sanatizeUser");
// @desc Create User
// @access Private
exports.createUser = factory.createOne(UserModel);

// @desc Get all Users
// @access Protected , admin
exports.getAllUsers = factory.getAll(UserModel);

// @desc Get specific User by ID
// @access protected , admin
exports.getUser = factory.getOne(UserModel);

// @desc Delete specific User by ID
// @access protected , admin
exports.deleteUser = factory.deleteOne(UserModel);

// @desc Update specific User by ID
// @access protected , admin
exports.updateUser = factory.updateOne(UserModel);

// @desc Change Password
// @access protected , user,admin
exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!document) {
    return next(
      new ApiError(`No document found with ID ${req.params.id}`, 404),
    );
  }
  res.status(200).json({ data: document });
});

//