import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as ratingService from "../services/rating.service.js";
import { AppError } from "../utils/AppError.js";

// Add or update rating
export const rateFood = asyncHandler(async (req: Request, res: Response) => {
  const { userId, foodId, value, comment } = req.body;

  if (!userId || !foodId || value === undefined) {
    throw new AppError("Missing fields", 400);
  }

  const rating = await ratingService.rateFood({ userId, foodId, value, comment });

  res.status(201).json({
    status: "success",
    message: "Rating submitted successfully",
    data: { rating },
  });
});

// Get all ratings for a food
export const getFoodRatings = asyncHandler(async (req: Request, res: Response) => {
  const foodId = Number(req.params.foodId);
  if (isNaN(foodId)) throw new AppError("Invalid food ID", 400);

  const data = await ratingService.getFoodRatings(foodId);
  res.status(200).json({ status: "success", data });
});