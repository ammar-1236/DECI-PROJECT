const express = require("express");

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router
  .route("/")
  .get(getAllOrders)
  .post(createOrder);

router
  .route("/:id")
  .get(getOrderById);

router
  .route("/:id/status")
  .patch(updateOrderStatus);

module.exports = router;