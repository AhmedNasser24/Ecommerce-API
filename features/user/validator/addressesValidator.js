const {check} = require("express-validator");
const ApiError = require("../../../utils/ApiError");
const UserModel = require("../models/userModels");

exports.addAddressValidator = [
  check("alias").notEmpty().withMessage("Alias is required"),
  check("address").notEmpty().withMessage("Address is required"),
  
];

exports.deleteAddressValidator = [
  check("id").isMongoId().withMessage("Invalid address id").custom(async(addressId , {req}) =>{
    const user = await UserModel.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if(!address){
      throw new ApiError(`No address found with ID ${addressId}`, 404);
    }
    return true;
  }),
];

exports.updateAddressValidator = [
  check("id").isMongoId().withMessage("Invalid address id").custom(async(addressId , {req}) =>{
    const user = await UserModel.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if(!address){
      throw new ApiError(`No address found with ID ${addressId}`, 404);
    }
    return true;
  }),
  check("alias").optional().notEmpty().withMessage("Alias is required"),
  check("address").optional().notEmpty().withMessage("Address is required"),
];