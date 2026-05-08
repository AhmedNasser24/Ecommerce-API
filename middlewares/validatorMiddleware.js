
const { validationResult } = require("express-validator");

// @desc    Validate request body
// @route   POST /api/categories
// @access  Private

exports.validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      messageList: errors.array().map((error) => error.msg),
    });
  }
  next();
};