import express from "express";
import * as foodController from "../controllers/food.controller.js";
import { simulateAdmin } from "../middleware/admin.middleware.js";
import { uploadSingleImage, uploadToCloudinaryOptional } from "../middleware/upload.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", foodController.getAllFoods);
router.get("/:id", foodController.getFoodById);

// ADMIN SIMULATION
router.post(
  "/",
  simulateAdmin,
  uploadSingleImage,             // handle multipart form-data
  uploadToCloudinaryOptional,   // optional Cloudinary upload
  foodController.createFood
);

router.put(
  "/:id",
  simulateAdmin,
  uploadSingleImage,
  uploadToCloudinaryOptional,
  foodController.updateFood
);

router.delete("/:id", simulateAdmin, foodController.deleteFood);

export default router;
