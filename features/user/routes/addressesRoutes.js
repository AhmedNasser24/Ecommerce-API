const express = require("express");
const router = express.Router();
const {
  getAllAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
} = require("../services/addressesServices");
const authService = require("../services/authServices");
const {
  addAddressValidator,
  deleteAddressValidator,
  updateAddressValidator,
} = require("../validator/addressesValidator");

router.use(authService.protect);
router.get("/", authService.allowTo("user"), getAllAddresses);
router.post("/", authService.allowTo("user"), addAddressValidator, addAddress);
router.delete(
  "/:id",
  authService.allowTo("user"),
  deleteAddressValidator,
  deleteAddress,
);
router.put(
  "/:id",
  authService.allowTo("user"),
  updateAddressValidator,
  updateAddress,
);

module.exports = router;
