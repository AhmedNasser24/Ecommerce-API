
const express = require("express");

const router = express.Router();

const {getCategories,createCategory} = require("../services/categoryServices");

// @route   GET /categories
// @desc    Get all categories
// @access  Public
router.get("/", getCategories);

// @route   GET /categories/:id
// @desc    Get a single category by ID
// @access  Public
router.get("/:id", (req, res) => {
  res.send(`Get category ${req.params.id}`);
});

// @route   POST /categories
// @desc    Create a new category
// @access  Public
router.post("/", createCategory);

// @route   PUT /categories/:id
// @desc    Update a category by ID
// @access  Public
router.put("/:id", (req, res) => {
  res.send(`Update category ${req.params.id}`);
});

// @route   DELETE /categories/:id
// @desc    Delete a category by ID
// @access  Public
router.delete("/:id", (req, res) => {
  res.send(`Delete category ${req.params.id}`);
});

module.exports = router;