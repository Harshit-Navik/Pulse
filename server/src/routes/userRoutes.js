import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshAccessToken,
} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.patch("/password", verifyJWT, changePassword);
router.get("/profile", verifyJWT, getCurrentUser);
/** Alias for session validation (same handler as profile). */
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/profile", verifyJWT, updateProfile);

export default router;
