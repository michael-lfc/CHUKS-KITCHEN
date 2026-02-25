import express from "express";
import * as cartController from "../controllers/cart.controller.js";

const router = express.Router();

// Add item to cart
router.post("/add", cartController.addToCart);

// View cart
router.get("/:userId", cartController.getCart);

// Update item quantity
router.put("/update", cartController.updateCartItem);

// Remove item from cart
router.delete("/remove", cartController.removeCartItem);

// Clear cart
router.delete("/clear/:userId", cartController.clearCart);

export default router;
