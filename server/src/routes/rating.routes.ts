import express from "express";
import * as ratingController from "../controllers/rating.controller.js";

const router = express.Router();

// Submit or update a rating
router.post("/", ratingController.rateFood);

// Get all ratings for a food
router.get("/:foodId", ratingController.getFoodRatings);

export default router;