import prisma from "../prisma/client.js";
import { AppError } from "../utils/AppError.js";

interface CreateOrderInput {
  userId: number;
}

// CREATE ORDER
export const createOrder = async ({ userId }: CreateOrderInput) => {
  // 1️⃣ Find user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { food: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty. Cannot create order.", 400);
  }

  // 2️⃣ Check food availability & calculate total
  let totalAmount = 0;
  for (const item of cart.items) {
    if (!item.food.isAvailable) {
      throw new AppError(`Food "${item.food.name}" is unavailable`, 400);
    }
    totalAmount += item.food.price * item.quantity;
  }

  // 3️⃣ Create order
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: "PENDING",
      paymentStatus: "PENDING",
      items: {
        create: cart.items.map((item: any) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          price: item.food.price, // snapshot of price at order time
        })),
      },
    },
    include: { items: true },
  });

  // 4️⃣ Clear cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return order;
};

// GET ALL ORDERS (optional filtering by user)
export const getOrders = async (userId?: number) => {
  return prisma.order.findMany({
    where: userId ? { userId } : undefined,
    include: {
      items: { include: { food: true } },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
};


// GET ORDER BY ID
export const getOrderById = async (id: number) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { food: true } }, user: true },
  });

  if (!order) throw new AppError("Order not found", 404);

  return order;
};

// CANCEL ORDER
export const cancelOrder = async (id: number) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError("Order not found", 404);

  if (order.status === "COMPLETED" || order.status === "CANCELLED") {
    throw new AppError("Cannot cancel a completed or already cancelled order", 400);
  }

  return prisma.order.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

// UPDATE PAYMENT STATUS (Admin simulation)
export const updatePaymentStatus = async (id: number, status: "PENDING" | "PAID" | "FAILED") => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError("Order not found", 404);

  return prisma.order.update({
    where: { id },
    data: { paymentStatus: status },
  });
};
