import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

/**
 * ADMIN SIMULATION MIDDLEWARE
 * 
 * To simulate admin access, send this header in Postman:
 *    x-admin: true
 * 
 * If header is missing or false → request is blocked
 */

export const simulateAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const isAdmin = req.headers["x-admin"];

  if (isAdmin !== "true") {
    return next(new AppError("Admin access only (simulation)", 403));
  }

  next();
};
