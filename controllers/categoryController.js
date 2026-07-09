const Category = require("../models/category.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    status: "success",
    message: "Categories retrieved successfully",
    data: categories,
  });
});

// GET category by ID
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category retrieved successfully",
    data: category,
  });
});

// CREATE category
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: category,
  });
});

// UPDATE category
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
});

// DELETE category
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
    data: null,
  });
});