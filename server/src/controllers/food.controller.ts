import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as foodService from "../services/food.service.js";
import { AppError } from "../utils/AppError.js";

// CREATE FOOD
export const createFood = asyncHandler(async (req: Request, res: Response) => {
  let { name, price, description, isAvailable } = req.body;

  if (!name || price === undefined) {
    throw new AppError("Name and price are required", 400);
  }

  const numericPrice = Number(price);
  if (isNaN(numericPrice)) throw new AppError("Price must be a number", 400);

  const available =
    isAvailable === undefined
      ? undefined
      : isAvailable === true || isAvailable === "true" || isAvailable === "1";

  const imageUrl = req.body.imageUrl ?? null;
  const publicId = req.body.publicId ?? null;

  const food = await foodService.createFood({
    name: name.trim(),
    price: numericPrice,
    description,
    isAvailable: available,
    imageUrl,
    publicId,
  });

  res.status(201).json({
    status: "success",
    message: "Food created successfully",
    data: { food },
  });
});

// GET ALL FOODS (with ratings)
export const getAllFoods = asyncHandler(async (_req: Request, res: Response) => {
  const foods = await foodService.getAllFoods(); // service already adds averageRating & ratingCount
  res.status(200).json({ status: "success", data: { foods } });
});

// GET FOOD BY ID (with ratings)
export const getFoodById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError("Invalid food ID", 400);

  const food = await foodService.getFoodById(id); // service already adds averageRating & ratingCount
  res.status(200).json({ status: "success", data: { food } });
});

// UPDATE FOOD
export const updateFood = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, price, description, isAvailable, imageUrl, publicId } = req.body;

  const updatedFood = await foodService.updateFood(id, {
    name,
    price,
    description,
    isAvailable,
    imageUrl,
    publicId,
  });

  res.status(200).json({
    status: "success",
    message: "Food updated successfully",
    data: { food: updatedFood },
  });
});

// DELETE FOOD
export const deleteFood = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await foodService.deleteFood(id);
  res.status(200).json({ status: "success", message: "Food deleted successfully" });
});