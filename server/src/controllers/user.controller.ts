import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as userService from "../services/user.service.js";
import { AppError } from "../utils/AppError.js";

// REGISTER
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  if (!name || !email) throw new AppError("Name and email are required", 400);

  const { user, otp } = await userService.registerUser({ name, email, phone });

  // ✅ Simulate sending OTP via email/SMS
  console.log(`🔹 OTP for ${user.email}: ${otp}`);

  res.status(201).json({
    status: "success",
    message: "User registered. OTP sent to email (check console for simulation).",
    data: { user }, // OTP not returned in response
  });
});

// VERIFY OTP
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new AppError("Email and OTP are required", 400);

  const user = await userService.verifyOtp({ email, otp });

  res.status(200).json({
    status: "success",
    message: "OTP verified. User is now verified.",
    data: { user },
  });
});

// LOGIN (sends OTP)
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is required", 400);

  const { user, otp } = await userService.loginUser(email);

  // ✅ Simulate sending OTP via email/SMS
  console.log(`🔹 Login OTP for ${user.email}: ${otp}`);

  res.status(200).json({
    status: "success",
    message: "OTP sent to email for login (check console for simulation).",
    data: { user }, // OTP not returned in response
  });
});
