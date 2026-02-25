import prisma from "../prisma/client.js";
import { AppError } from "../utils/AppError.js";

interface FoodCreateInput {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  publicId?: string;
  isAvailable?: boolean;
}

interface FoodUpdateInput {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  publicId?: string;
  isAvailable?: boolean;
}

// CREATE FOOD
export const createFood = async (data: FoodCreateInput) => {
  const { name, price, description, imageUrl, publicId, isAvailable } = data;

  if (!name || price === undefined || price === null) {
    throw new AppError("Name and price are required", 400);
  }

  if (typeof name !== "string" || name.trim() === "") {
    throw new AppError("Name must be a non-empty string", 400);
  }

  if (typeof price !== "number" || price <= 0) {
    throw new AppError("Price must be a positive number", 400);
  }

  const food = await prisma.food.create({
    data: {
      name: name.trim(),
      price,
      description: description?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      publicId: publicId || null,
      isAvailable: isAvailable ?? true,
    },
  });

  return food;
};

export const getAllFoods = async () => {
  const foods = await prisma.food.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
  });

  const foodsWithRatings = await Promise.all(
    foods.map(async (food: { id: number; [key: string]: any }) => { // type food explicitly
      const ratings = await prisma.rating.findMany({ where: { foodId: food.id } });
      const averageRating =
        ratings.reduce((acc: number, r: { value: number }) => acc + r.value, 0) / (ratings.length || 1);
      return { ...food, averageRating, ratingCount: ratings.length };
    })
  );

  return foodsWithRatings;
};

// GET FOOD BY ID with ratings
export const getFoodById = async (id: number) => {
  if (!id || isNaN(id)) throw new AppError("Invalid food ID", 400);

  const food: { id: number; [key: string]: any } | null = await prisma.food.findUnique({ where: { id } });
  if (!food) throw new AppError("Food not found", 404);

  const ratings = await prisma.rating.findMany({ where: { foodId: id } });
  const averageRating =
    ratings.reduce((acc: number, r: { value: number }) => acc + r.value, 0) / (ratings.length || 1);

  return { ...food, averageRating, ratingCount: ratings.length };
};

// UPDATE FOOD
export const updateFood = async (id: number, data: FoodUpdateInput) => {
  if (!id || isNaN(id)) throw new AppError("Invalid food ID", 400);

  const existingFood = await prisma.food.findUnique({ where: { id } });
  if (!existingFood) throw new AppError("Food not found", 404);

  if (Object.keys(data).length === 0) throw new AppError("At least one field is required", 400);

  if (data.name !== undefined) data.name = data.name.trim();
  if (data.description !== undefined) data.description = data.description.trim();

  try {
    const updatedFood = await prisma.food.update({ where: { id }, data });
    return updatedFood;
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update food", 500);
  }
};

// DELETE FOOD
export const deleteFood = async (id: number) => {
  if (!id || isNaN(id)) throw new AppError("Invalid food ID", 400);

  const existingFood = await prisma.food.findUnique({ where: { id } });
  if (!existingFood) throw new AppError("Food not found", 404);

  try {
    await prisma.food.delete({ where: { id } });
    return true;
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete food", 500);
  }
};