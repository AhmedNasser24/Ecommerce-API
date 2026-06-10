const path = require("path");
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const ApiError = require("./utils/ApiError");
const { errorHandler } = require("./middlewares/errorMiddleWare");
const dbConnection = require("./config/database");

const categoryRoutes = require("./features/category/routes/categoryRoute");
const subcategoryRoutes = require("./features/subcategory/routes/subcategoryRoute");
const brandRoutes = require("./features/brand/routes/brandRoute");
const productRoutes = require("./features/product/routes/productRoutes");
const userRoutes = require("./features/user/routes/userRoutes");
const profileRoutes = require("./features/user/routes/profileRoutes");
const authRoutes = require("./features/user/routes/authRoutes");
const reviewRoutes = require("./features/review/routes/reviewRoutes");
const addressesRoutes = require("./features/user/routes/addressesRoutes");

const app = express();
// security
const { rateLimiterMiddlewareSecurity } = require("./security/rateLimiter");
const { hppMiddlewareSecurity  } = require("./security/hpp");
// const expressMongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");

dbConnection();
// Middleware
app.set("query parser", "extended");  // allows to use gte, gt, lte, lt in query strings

// security
app.use(express.json({ limit: "10kb" })); 
app.use(rateLimiterMiddlewareSecurity);
app.use(hppMiddlewareSecurity);
// app.use(expressMongoSanitize());
// app.use(xss());

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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/addresses", addressesRoutes);
app.use("/api/v1/profile", profileRoutes);

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
