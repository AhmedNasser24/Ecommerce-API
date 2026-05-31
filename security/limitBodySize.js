const express = require("express");

exports.limitBodySizeMiddleware = express.json({ limit: "10kb" });