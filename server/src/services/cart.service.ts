import prisma from "../prisma/client.js";
import { AppError } from "../utils/AppError.js";

interface AddCartInput {
  userId: number;
  foodId: number;
  quantity?: number;
}

interface UpdateCartInput {
  userId: number;
  foodId: number;
  quantity: number;
}

// Helper: get or create cart
const getOrCreateCart = async (userId: number) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { food: true } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { food: true } } },
    });
  }

  return cart;
};

// Add item to cart
export const addToCart = async ({ userId, foodId, quantity = 1 }: AddCartInput) => {
  // Check if food exists and available
  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (!food) throw new AppError("Food not found", 404);
  if (!food.isAvailable) throw new AppError("Food is unavailable", 400);

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_foodId: { cartId: cart.id, foodId } },
  });

  if (existingItem) {
    // Increase quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
    return updatedItem;
  }

  // Create new cart item
  const newItem = await prisma.cartItem.create({
    data: { cartId: cart.id, foodId, quantity },
  });

  return newItem;
};

// Get cart
export const getCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { food: true } } },
  });

  if (!cart) throw new AppError("Cart not found", 404);
  return cart;
};

// Update item quantity
export const updateCartItem = async ({ userId, foodId, quantity }: UpdateCartInput) => {
  if (quantity <= 0) throw new AppError("Quantity must be at least 1", 400);

  const cart = await getOrCreateCart(userId);

  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_foodId: { cartId: cart.id, foodId } },
  });

  if (!cartItem) throw new AppError("Cart item not found", 404);

  const updatedItem = await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
  });

  return updatedItem;
};

// Remove item from cart
export const removeCartItem = async (userId: number, foodId: number) => {
  const cart = await getOrCreateCart(userId);

  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_foodId: { cartId: cart.id, foodId } },
  });

  if (!cartItem) throw new AppError("Cart item not found", 404);

  await prisma.cartItem.delete({ where: { id: cartItem.id } });
  return true;
};

// Clear cart
export const clearCart = async (userId: number) => {
  const cart = await getOrCreateCart(userId);

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return true;
};
