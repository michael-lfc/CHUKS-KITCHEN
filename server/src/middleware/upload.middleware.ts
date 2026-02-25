import multer from "multer";
import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary.js";
import { AppError } from "../utils/AppError.js";

// --------------------
// Multer memory storage
// --------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Middleware for single file upload under "image" field
export const uploadSingleImage = upload.single("image");

// Middleware to optionally upload image to Cloudinary
export const uploadToCloudinaryOptional = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // If no file, just continue
  if (!req.file) return next();

  try {
    // Validate file type
    if (!req.file.mimetype.startsWith("image/")) {
      throw new AppError("Only image files are allowed", 400);
    }

    // Convert buffer to base64 for Cloudinary upload
    const base64 = req.file.buffer.toString("base64");
    const fileStr = `data:${req.file.mimetype};base64,${base64}`;

    // Upload to Cloudinary under folder "chuks_kitchen_foods"
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "chuks_kitchen_foods",
      resource_type: "image",
    });

    // Only set imageUrl and publicId if upload succeeded
    if (result?.secure_url && result?.public_id) {
      req.body.imageUrl = result.secure_url;
      req.body.publicId = result.public_id;
    }

    next();
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    next(new AppError(error.message || "Image upload failed", 500));
  }
};
