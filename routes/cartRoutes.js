const express = require("express");

const {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
} = require("../controllers/cartController");

const router = express.Router();

router
  .route("/")
  .get(getCart)
  .post(addToCart);

router
  .route("/:id")
  .patch(updateCart)
  .delete(deleteCart);

module.exports = router;