const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("products.product");

  res.status(200).json({
    status: "success",
    message: "Orders retrieved successfully",
    data: orders,
  });
});

// GET order by ID
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("products.product");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order retrieved successfully",
    data: order,
  });
});

// CREATE order from cart
exports.createOrder = asyncHandler(async (req, res, next) => {
  const cartItems = await Cart.find().populate("product");

  if (cartItems.length === 0) {
    return next(new AppError("Your shopping cart is currently empty", 400));
  }

  const products = [];
  let totalPrice = 0;

  for (const item of cartItems) {
    products.push({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    });

    totalPrice += item.product.price * item.quantity;
  }

  const order = await Order.create({
    products,
    totalPrice,
  });

  await Cart.deleteMany();

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

// UPDATE order
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate("products.product");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order updated successfully",
    data: order,
  });
});

// DELETE order
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
    data: null,
  });
});