const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET cart
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne().populate("items.product");

  if (!cart) {
    cart = await Cart.create({
      items: [],
      totalPrice: 0,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    data: cart,
  });
});

// ADD product to cart
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { product, quantity } = req.body;

  const existingProduct = await Product.findById(product);

  if (!existingProduct) {
    return next(new AppError("Product not found", 404));
  }

  if (existingProduct.stock < quantity) {
    return next(new AppError("Not enough stock available", 400));
  }

  let cart = await Cart.findOne();

  if (!cart) {
    cart = await Cart.create({
      items: [],
      totalPrice: 0,
    });
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === product
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product,
      quantity,
      price: existingProduct.price,
    });
  }

  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  await cart.populate("items.product");

  res.status(201).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cart,
  });
});

// UPDATE quantity
exports.updateCart = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne();

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const item = cart.items.find(
    item => item.product.toString() === req.params.productId
  );

  if (!item) {
    return next(new AppError("Cart item not found", 404));
  }

if (quantity <= 0) {
  cart.items = cart.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );
} else {
  item.quantity = quantity;
}
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  await cart.populate("items.product");

  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: cart,
  });
});

// REMOVE one item
exports.deleteCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne();

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== req.params.productId
  );

  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart item deleted successfully",
    data: cart,
  });
});

// CLEAR cart
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne();

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: cart,
  });
});