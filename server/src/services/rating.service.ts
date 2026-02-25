import prisma from "../prisma/client.js";
import { AppError } from "../utils/AppError.js";

interface RatingInput {
  userId: number;
  foodId: number;
  value: number;
  comment?: string;
}

// Add or update a rating
export const rateFood = async ({ userId, foodId, value, comment }: RatingInput) => {
  if (value < 1 || value > 5) throw new AppError("Rating must be between 1 and 5", 400);

  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (!food) throw new AppError("Food not found", 404);

  const rating = await prisma.rating.upsert({
    where: { userId_foodId: { userId, foodId } },
    update: { value, comment },
    create: { userId, foodId, value, comment },
  });

  return rating;
};

// Get all ratings for a food
export const getFoodRatings = async (foodId: number) => {
  const ratings = await prisma.rating.findMany({
    where: { foodId },
    include: { user: { select: { id: true, name: true } } },
  });

  const averageRating =
    ratings.reduce((acc: number, r: { value: number }) => acc + r.value, 0) / (ratings.length || 1);

  return { ratings, averageRating };
};