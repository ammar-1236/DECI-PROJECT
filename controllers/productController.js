const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET all products
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category");

  res.status(200).json({
    status: "success",
    message: "Products retrieved successfully",
    data: products,
  });
});


// GET product by ID
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product retrieved successfully",
    data: product,
  });
});


// CREATE product
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});


// UPDATE product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});


// DELETE product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: null,
  });
});