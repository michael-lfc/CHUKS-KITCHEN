import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("🔥 ERROR:", err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Prisma known errors
  if (err.code === "P2002") {
    message = "Duplicate field value";
    statusCode = 400;
  }

  if (err.code === "P2025") {
    message = "Record not found";
    statusCode = 404;
  }

  // Invalid JSON
  if (err instanceof SyntaxError && "body" in err) {
    message = "Invalid JSON payload";
    statusCode = 400;
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    message = "File too large";
    statusCode = 400;
  }

  res.status(statusCode).json({
    status: statusCode < 500 ? "fail" : "error",
    message,
  });
};
