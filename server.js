const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");

const categoryRoutes = require("./routes/categoryRoute");
const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
const { errorHandler } = require("./middlewares/errorMiddleWare");
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
  next(new ApiError("Route Not Found :" + req.originalUrl, 404));
});

// error handling middleware
app.use(errorHandler);

// ------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
