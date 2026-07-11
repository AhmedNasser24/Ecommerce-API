// npm install axios --legacy-peer-deps
const path = require("path");
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const ApiError = require("./utils/ApiError");
const { errorHandler } = require("./middlewares/errorMiddleWare");
const dbConnection = require("./config/database");
const mountRoutes = require("./utils/mountRoutes");


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
mountRoutes(app);

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
