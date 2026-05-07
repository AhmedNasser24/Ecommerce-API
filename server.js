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

// error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ err });
});

// ------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
