import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as cartService from "../services/cart.service.js";
import { AppError } from "../utils/AppError.js";

// Add to cart
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId, foodId, quantity } = req.body;
  if (!userId || !foodId) throw new AppError("userId and foodId are required", 400);

  const item = await cartService.addToCart({ userId, foodId, quantity });
  res.status(200).json({ status: "success", data: { item } });
});

// Get cart
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const cart = await cartService.getCart(userId);
  res.status(200).json({ status: "success", data: { cart } });
});

// Update cart item
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { userId, foodId, quantity } = req.body;
  if (!userId || !foodId || quantity === undefined)
    throw new AppError("userId, foodId, and quantity are required", 400);

  const updatedItem = await cartService.updateCartItem({ userId, foodId, quantity });
  res.status(200).json({ status: "success", data: { item: updatedItem } });
});

// Remove item
export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { userId, foodId } = req.body;
  if (!userId || !foodId) throw new AppError("userId and foodId are required", 400);

  await cartService.removeCartItem(userId, foodId);
  res.status(200).json({ status: "success", message: "Item removed from cart" });
});

// Clear cart
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  await cartService.clearCart(userId);
  res.status(200).json({ status: "success", message: "Cart cleared" });
});
