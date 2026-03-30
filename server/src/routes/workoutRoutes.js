import { Router } from "express";
import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
} from "../controllers/workoutController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getWorkouts);
router.get("/:id", getWorkoutById);

// Protected routes
router.post("/", verifyJWT, createWorkout);

export default router;
