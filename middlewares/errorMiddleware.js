const ApiError = require("../utils/ApiError");

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProduction = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleJwtInvalidError = () => {
  return new ApiError("Invalid token, please login again", 401);
};

const handleTokenExpiredError = () => {
  return new ApiError("Token has expired, please login again", 401);
};

exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.name === "JsonWebTokenError") {
    err = handleJwtInvalidError();
  }
  if (err.name === "TokenExpiredError") {
    err = handleTokenExpiredError();
  }
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProduction(err, res);
  }
};
