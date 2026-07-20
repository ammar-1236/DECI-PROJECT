const express = require("express");

const {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router
  .route("/")
  .get(getCart)
  .delete(clearCart);

router
  .route("/items")
  .post(addToCart);

router
  .route("/items/:productId")
  .patch(updateCart)
  .delete(deleteCart);

module.exports = router;