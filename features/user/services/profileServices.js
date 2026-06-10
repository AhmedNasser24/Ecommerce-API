const UserModel = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/ApiError");
const {sanatizeUser} = require("../../../utils/sanatizeUser");



exports.getMyProfile = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  const user = await UserModel.findById(req.user._id);
  res.status(200).json({ ...sanatizeUser(user) });
});

exports.updateMyProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    // @ts-ignore
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!user) {
    return next(new ApiError(`No User found with ID ${req.params.id}`, 404));
  }
  res.status(200).json({ ...sanatizeUser(user) });
});

