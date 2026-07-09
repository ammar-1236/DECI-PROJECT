const express = require("express");
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cartController");

const router = express.Router();

router.route("/")
  .get(getCart)
  .delete(clearCart);

router.route("/items")
  .post(addItemToCart);

router.route("/items/:productId")
  .patch(updateCartItem)
  .delete(removeCartItem);

module.exports = router;