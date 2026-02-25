import express from "express";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

// POST /api/users/register
router.post("/register", userController.registerUser);

// POST /api/users/verify-otp
router.post("/verify-otp", userController.verifyOtp);

// POST /api/users/login
router.post("/login", userController.loginUser);

export default router;
