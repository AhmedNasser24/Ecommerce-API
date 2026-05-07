const express = require("express");

const router = express.Router();

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory, 
} = require("../services/categoryServices");

// @route   GET /categories
// @desc    Get all categories
// @access  Public
router.get("/", getCategories);

// @route   GET /categories/:id
// @desc    Get a single category by ID
// @access  Public
router.get("/:id", getCategory);

// @route   POST /categories
// @desc    Create a new category
// @access  Public
router.post("/", createCategory);

// @route   PUT /categories/:id
// @desc    Update a category by ID
// @access  Public
router.put("/:id", updateCategory);

// @route   DELETE /categories/:id
// @desc    Delete a category by ID
// @access  Public
router.delete("/:id", deleteCategory);

module.exports = router;
