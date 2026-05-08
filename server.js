const express = require("express");
require("dotenv").config();
const morgan = require("morgan");

const categoryRoutes = require("./routes/categoryRoute");
const subcategoryRoutes = require("./routes/subcategoryRoute");
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
app.use("/api/v1/subcategories", subcategoryRoutes);

// handle routes that are not defined
app.all('*splat', (req, res, next) => {
  next(new ApiError("Route Not Found :" + req.originalUrl, 404));
});

// error handling middleware for express
app.use(errorHandler);

// ------------------------------------------------
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Error: ${err.name} ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
