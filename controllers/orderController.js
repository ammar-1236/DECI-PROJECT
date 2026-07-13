const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("items.product");

  res.status(200).json({
    status: "success",
    message: "Orders retrieved successfully",
    data: orders,
  });
});

// GET order by ID
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order retrieved successfully",
    data: order,
  });
});

// CREATE order (Checkout)
exports.createOrder = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne().populate("items.product");

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Your shopping cart is currently empty", 400));
  }

  let totalPrice = 0;
  const items = [];

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.product._id);

    if (!product) {
      return next(
        new AppError(`Product "${cartItem.name}" no longer exists`, 404)
      );
    }

    if (product.stock < cartItem.quantity) {
      return next(
        new AppError(
          `Not enough stock for ${product.name}. Available: ${product.stock}`,
          400
        )
      );
    }

    totalPrice += product.price * cartItem.quantity;

    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
    });
  }

  const order = await Order.create({
    items,
    totalPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // Reduce stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  // Empty cart
  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

// UPDATE order status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Invalid order status", 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: order,
  });
});