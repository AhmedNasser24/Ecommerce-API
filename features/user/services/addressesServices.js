const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModels");
// @desc Get all addresses
// @access Private , user
exports.getAllAddresses = asyncHandler(async (req, res) => {
  // @ts-ignore
  const user = await UserModel.findById(req.user._id);

  res.status(200).json({
    results: user.addresses.length,
    data: user.addresses,
  });
});
// @desc Add Address
// @access Private , user
exports.addAddress = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  const user = await UserModel.findByIdAndUpdate(
    // @ts-ignore
    req.user._id,
    { $push: { addresses: req.body } },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({ data: user.addresses });
});

exports.updateAddress = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  let user = await UserModel.findByIdAndUpdate(
    // @ts-ignore
    req.user._id,
    { $pull: { addresses: { _id: req.params.id } } },
    {
      new: true,
      runValidators: true,
    },
  );

  user = await UserModel.findByIdAndUpdate(
    // @ts-ignore
    req.user._id,
    { $push: { addresses: {...req.body , _id: req.params.id} } },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({ data: user.addresses });
});

exports.deleteAddress = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  const user = await UserModel.findByIdAndUpdate(
    // @ts-ignore
    req.user._id,
    { $pull: { addresses: { _id: req.params.id } } },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(204).send();
});
