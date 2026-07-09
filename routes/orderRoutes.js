const express = require("express");
const {
  checkoutOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();

router.route("/")
  .get(getAllOrders)
  .post(checkoutOrder);

router.route("/:id")
  .get(getOrderById);

router.route("/:id/status")
  .patch(updateOrderStatus);

module.exports = router;