import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Workout } from "../models/workout.model.js";

/**
 * GET /api/workouts
 * Query params: ?tag=STRENGTH&difficulty=ELITE
 * Maps to: Workouts.tsx allWorkouts[] display, discipline filter tabs
 */
export const getWorkouts = asyncHandler(async (req, res) => {
  const { tag, difficulty } = req.query;

  const filter = { isPublic: true };
  if (tag && tag !== "ALL") filter.tag = tag.toUpperCase();
  if (difficulty) filter.difficulty = difficulty.toUpperCase();

  const workouts = await Workout.find(filter)
    .sort({ createdAt: -1 })
    .select("-exercises");

  return res
    .status(200)
    .json(new ApiResponse(200, workouts, "Workouts fetched successfully"));
});

/**
 * GET /api/workouts/:id
 * Maps to: WorkoutDetail.tsx workoutDatabase[id] → full workout with exercises
 */
export const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    throw new ApiError(404, "Workout not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, workout, "Workout fetched successfully"));
});

/**
 * POST /api/workouts
 * Body: { title, duration, tag }
 * Maps to: Workouts.tsx Quick-Add modal → { workout-name, workout-duration, workout-type }
 */
export const createWorkout = asyncHandler(async (req, res) => {
  const { title, duration, tag, difficulty, equipment, description, exercises } =
    req.body;

  if (!title || !duration || !tag) {
    throw new ApiError(400, "Title, duration, and discipline are required");
  }

  const workout = await Workout.create({
    title,
    duration,
    tag: tag.toUpperCase(),
    difficulty: difficulty?.toUpperCase() || "BEGINNER",
    equipment: equipment || "NONE",
    description: description || "",
    exercises: exercises || [],
    createdBy: req.user?._id || null,
    isPublic: !req.user,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, workout, "Workout created successfully"));
});
