const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// 1. POST /api/orders (Checkout Logic)
exports.checkoutOrder = asyncHandler(async (req, res, next) => {
  const { userId, shippingAddress } = req.body;

  // Find user's active cart state
  const cart = await Cart.findOne().populate("items.product");
  if (!cart || cart.items.length === 0) {
    return next(new AppError("Your shopping cart is currently empty", 400));
  }

  let finalTotalPrice = 0;
  const orderItems = [];

  // Step 2 & 3 Verification Loop: validate inventory levels & snapshot pricing structural details
  for (const item of cart.items) {
    const currentProduct = item.product;

    if (!currentProduct) {
      return next(new AppError("One of the products in your cart no longer exists", 404));
    }

    if (currentProduct.stock < item.quantity) {
      return next(new AppError(`Insufficient inventory available for: ${currentProduct.name}`, 400));
    }

    // Server-side financial aggregation
    finalTotalPrice += currentProduct.price * item.quantity;

    orderItems.push({
      product: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price, // Frozen historical price
      quantity: item.quantity,
    });
  }

  // Deduct inventory levels
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }
    });
  }

  // Create unique transaction confirmation number
  const uniqueOrderNumber = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  const order = await Order.create({
    orderNumber: uniqueOrderNumber,
    user: userId,
    items: orderItems,
    totalPrice: finalTotalPrice,
    shippingAddress,
  });

  // Wipe / reset matching cart configurations cleanly back to zero elements
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Checkout successful. Order placed!",
    data: order,
  });
});

// 2. GET /api/orders (All)
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");
  res.status(200).json({
    status: "success",
    message: "Orders retrieved successfully",
    data: orders,
  });
});

// 3. GET /api/orders/:id (Single)
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    return next(new AppError("Order not found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Order details retrieved successfully",
    data: order,
  });
});

// 4. PATCH /api/orders/:id/status (Status Only Update)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  // Explicit enum validation array check
  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return next(new AppError("Invalid status modification update provided", 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new AppError("Order not found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order status modified successfully",
    data: order,
  });
});