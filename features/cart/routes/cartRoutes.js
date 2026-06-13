
const express = require("express");
const router = express.Router();

const {removeCartItem , addNewCartItem} = require("../services/cartServices");
const authServices = require("../../user/services/authServices");
const {removeCartItemValidator , addNewCartItemValidator} = require("../validators/cartValidators");


router.use(authServices.protect, authServices.allowTo("user"));
router.delete("/:id", removeCartItemValidator, removeCartItem);
router.post("/", addNewCartItemValidator, addNewCartItem);


module.exports = router;