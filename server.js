const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");

const categoryRoutes = require("./routes/categoryRoute");
const dbConnection = require("./config/database");

const app = express();

dbConnection();
// Middleware
app.use(express.json());    // parse request body into JSON

if(process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));  // logging requests
}
//---------------------------------

// Mount routes
app.use("/api/v1/categories", categoryRoutes);

// ------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
