import { Router } from "express";
import {
  getWorkouts,
  getWorkoutById,
  getUserWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
} from "../controllers/workoutController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All workout routes must be protected to ensure data scoping
router.use(verifyJWT);

router.get("/", getWorkouts);
router.get("/my", getUserWorkouts);
router.get("/:id", getWorkoutById);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);
router.post("/:id/exercises", addExerciseToWorkout);

export default router;
