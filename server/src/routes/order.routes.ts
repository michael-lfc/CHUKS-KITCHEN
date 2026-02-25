import express from "express";
import * as orderController from "../controllers/order.controller.js";
import { simulateAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Get all orders or user-specific orders
router.get("/", orderController.getOrders);


// Create order from cart (customer)
router.post("/", orderController.createOrder);

// Get order by ID (customer/admin)
router.get("/:id", orderController.getOrderById);

// Cancel order (customer/admin simulation)
router.put("/:id/cancel", orderController.cancelOrder);

// Optional: Simulate payment update (admin only)
router.put("/:id/payment", simulateAdmin, orderController.updatePaymentStatus);

export default router;
