const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");

const categoryRoutes = require("./routes/categoryRoute");
const dbConnection = require("./config/database");

const app = express();

dbConnection();
// Middleware
app.use(express.json()); // parse request body into JSON

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // logging requests
}
//---------------------------------

// Mount routes
app.use("/api/v1/categories", categoryRoutes);

// handle routes that are not defined
app.all('*splat', (req, res, next) => {
  const error = new Error("Route Not Found :" + req.originalUrl);
  error.statusCode = 404;
  next(error);
});

// error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
});

// ------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
