const Cart = require("../models/cart.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET all cart items
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find().populate("product");

  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    data: cart,
  });
});

// ADD product to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const cartItem = await Cart.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cartItem,
  });
});

// UPDATE cart item quantity
exports.updateCart = asyncHandler(async (req, res, next) => {
  const cartItem = await Cart.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!cartItem) {
    return next(new AppError("Cart item not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: cartItem,
  });
});

// REMOVE item from cart
exports.deleteCart = asyncHandler(async (req, res, next) => {
  const cartItem = await Cart.findByIdAndDelete(req.params.id);

  if (!cartItem) {
    return next(new AppError("Cart item not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Cart item deleted successfully",
    data: null,
  });
});