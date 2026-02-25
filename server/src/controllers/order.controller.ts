import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as orderService from "../services/order.service.js";
import { AppError } from "../utils/AppError.js";

// CREATE ORDER from cart
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.body.userId);
  if (!userId) throw new AppError("userId is required", 400);

  const order = await orderService.createOrder({ userId });

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: { order },
  });
});

// GET ALL ORDERS or USER ORDERS
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.userId
    ? Number(req.query.userId)
    : undefined;

  const orders = await orderService.getOrders(userId);

  res.status(200).json({
    status: "success",
    data: { orders },
  });
});



// GET ORDER BY ID
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError("Invalid order ID", 400);

  const order = await orderService.getOrderById(id);

  res.status(200).json({ status: "success", data: { order } });
});

// CANCEL ORDER
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError("Invalid order ID", 400);

  const order = await orderService.cancelOrder(id);

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully",
    data: { order },
  });
});

// UPDATE PAYMENT STATUS (Admin only)
export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!["PENDING", "PAID", "FAILED"].includes(status)) {
    throw new AppError("Invalid payment status", 400);
  }

  const order = await orderService.updatePaymentStatus(id, status as any);

  res.status(200).json({
    status: "success",
    message: "Payment status updated successfully",
    data: { order },
  });
});
