const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Helper function to recalculate the totals securely
const recalculateCart = (cart) => {
  cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
};

// 1. VIEW Cart
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne().populate("items.product", "name price stock");

  // If no cart exists yet, return an empty structure (Sub-task 4 rule: do not return 404)
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }

  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    data: cart,
  });
});

// 2. ADD Item to Cart
exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const qtyToAdd = Number(quantity) || 1;

  // Verify product exists and check inventory levels
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  if (product.stock < qtyToAdd) {
    return next(new AppError(`Insufficient stock. Only ${product.stock} items left.`, 400));
  }

  let cart = await Cart.findOne();
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }

  // Check if item already exists in cart
  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

  if (itemIndex > -1) {
    // Increment quantity securely
    const newQty = cart.items[itemIndex].quantity + qtyToAdd;
    if (product.stock < newQty) {
      return next(new AppError(`Cannot add more. Exceeds available stock of ${product.stock}`, 400));
    }
    cart.items[itemIndex].quantity = newQty;
    cart.items[itemIndex].price = product.price; // Update to freshest DB price
  } else {
    // Add new product item (Price originates safely from database)
    cart.items.push({
      product: productId,
      quantity: qtyToAdd,
      price: product.price,
    });
  }

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item added to cart successfully",
    data: cart,
  });
});

// 3. UPDATE Item Quantity
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const newQty = Number(quantity);

  const cart = await Cart.findOne();
  if (!cart) return next(new AppError("Cart not found", 404));

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex === -1) return next(new AppError("Item not found in cart", 404));

  if (newQty <= 0) {
    // Auto-drops items if quantity reaches 0
    cart.items.splice(itemIndex, 1);
  } else {
    const product = await Product.findById(productId);
    if (!product) return next(new AppError("Product not found", 404));
    if (product.stock < newQty) {
      return next(new AppError(`Insufficient stock. Only ${product.stock} available.`, 400));
    }
    cart.items[itemIndex].quantity = newQty;
  }

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: cart,
  });
});

// 4. REMOVE single item from cart
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne();
  if (!cart) return next(new AppError("Cart not found", 404));

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item removed from cart successfully",
    data: cart,
  });
});

// 5. CLEAR Cart Entirely
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne();
  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: cart,
  });
});