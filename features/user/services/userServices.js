
const factory = require("../../../utils/handlersFactory");
const UserModel = require("../models/userModels");

// @desc Create User
exports.createUser = factory.createOne(UserModel);

// @desc Get all Users
exports.getAllUsers = factory.getAll(UserModel);

// @desc Get specific User by ID
exports.getUser = factory.getOne(UserModel);

// @desc Update specific User by ID
exports.updateUser = factory.updateOne(UserModel);

// @desc Delete specific User by ID
exports.deleteUser = factory.deleteOne(UserModel);
