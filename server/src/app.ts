import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

import { AppError } from "./utils/AppError.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

import userRoutes from "./routes/user.routes.js";
import foodRoutes from "./routes/food.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import ratingRoutes from "./routes/rating.routes.js";   

const app = express();

// ========================
// MIDDLEWARES
// ========================
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// HEALTH CHECK
// ========================
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Chuks Kitchen API running 🚀" });
});

// ========================
// ROUTES
// ========================
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/ratings", ratingRoutes);

// ========================
// 404 CATCH-ALL
// ========================
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${_req.originalUrl} not found`, 404));
});

// ========================
// GLOBAL ERROR HANDLER
// ========================
app.use(globalErrorHandler);

export default app;
