import prisma from "../prisma/client.js";
import { generateOtp } from "../utils/generateOtp.js";
import { AppError } from "../utils/AppError.js";

interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
}

interface VerifyOtpInput {
  email: string;
  otp: string;
}

const OTP_EXPIRATION_MINUTES = 5;

// REGISTER
export const registerUser = async (data: RegisterInput) => {
  // 1️⃣ Check for duplicate email
  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) throw new AppError("Email already registered", 409);

  // 2️⃣ Check for duplicate phone (only if provided)
  if (data.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existingPhone) throw new AppError("Phone number already registered", 409);
  }

  // 3️⃣ Generate OTP
  const otp = generateOtp(6);
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  // 4️⃣ Create user — force role to CUSTOMER
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      role: "CUSTOMER", // 🔒 Cannot self-assign ADMIN
      otp,
      otpExpiresAt,
      isVerified: false,
    },
  });

  return { user, otp }; // OTP returned for testing / assignment purposes
};

// VERIFY OTP
export const verifyOtp = async ({ email, otp }: VerifyOtpInput) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);
  if (user.isVerified) throw new AppError("User already verified", 400);
  if (!user.otp || user.otp !== otp) throw new AppError("Invalid OTP", 400);

  if (user.otpExpiresAt && new Date() > user.otpExpiresAt)
    throw new AppError("OTP has expired", 400);

  return prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
    },
  });
};

// LOGIN (send OTP)
export const loginUser = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);
  if (!user.isVerified)
    throw new AppError("Please verify your account first", 403);

  const otp = generateOtp(6);
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });

  return { user: updatedUser, otp };
};
