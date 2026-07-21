const express = require("express");
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getAdminOrders,
  updateOrderStatus,
} = require("../controller/order.controller");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/", auth, createOrder);
router.get("/", auth, getCustomerOrders);
router.get("/admin", adminAuth, getAdminOrders);
router.put("/:id/status", adminAuth, updateOrderStatus);

module.exports = router;
