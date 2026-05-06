const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.log(error);
  process.exit(1);
})

const app = express();

if(process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("You are welcome to my api");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
