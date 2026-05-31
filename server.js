const path = require("path");
const express = require("express");
const { RateLimiterMemory } = require('rate-limiter-flexible');
require("dotenv").config();
const morgan = require("morgan");

const categoryRoutes = require("./features/category/routes/categoryRoute");
const subcategoryRoutes = require("./features/subcategory/routes/subcategoryRoute");
const brandRoutes = require("./features/brand/routes/brandRoute");
const productRoutes = require("./features/product/routes/productRoutes");
const dbConnection = require("./config/database");
const userRoutes = require("./features/user/routes/userRoutes");
const ApiError = require("./utils/ApiError");
const { errorHandler } = require("./middlewares/errorMiddleWare");
const app = express();
// security
const { limitBodySizeMiddleware } = require("./security/limitBodySize");
const { rateLimiterMiddleware } = require("./security/rateLimiter");


dbConnection();
// Middleware
app.set("query parser", "extended");  // allows to use gte, gt, lte, lt in query strings
app.use(limitBodySizeMiddleware); 
app.use(rateLimiterMiddleware);

// parse request body into JSON
app.use(express.static(path.join(__dirname, "uploads"))); // serve static files like images

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // logging requests
}
//---------------------------------

// Mount routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subcategoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

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
  console.log(`unhandledRejection Error: ${err}`);
  server.close(() => {
    process.exit(1);
  });
});
