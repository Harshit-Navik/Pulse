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

  const filter = {
    $or: [
      { isPublic: true },
      { createdBy: req.user._id }
    ]
  };

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
 * GET /api/workouts/my
 * Protected — returns only the user's custom workouts.
 */
export const getUserWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, workouts, "User workouts fetched successfully"));
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
 * Body: { title, duration, tag, difficulty, equipment, description, exercises }
 * Maps to: Workouts.tsx Quick-Add modal
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
    createdBy: req.user._id,
    isPublic: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, workout, "Workout created successfully"));
});

/**
 * PUT /api/workouts/:id
 * Protected — only the creator can update their workout.
 */
export const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    throw new ApiError(404, "Workout not found");
  }

  // Allow editing if the user created it OR if it has no creator (platform default)
  if (workout.createdBy && workout.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own workouts");
  }

  const allowedFields = [
    "title", "tag", "duration", "difficulty", "equipment",
    "image", "description", "exercises", "isPublic",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = field === "tag" || field === "difficulty"
        ? req.body[field].toUpperCase()
        : req.body[field];
    }
  }

  const updated = await Workout.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Workout updated successfully"));
});

/**
 * DELETE /api/workouts/:id
 * Protected — only the creator can delete their workout.
 */
export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    throw new ApiError(404, "Workout not found");
  }

  if (workout.createdBy && workout.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own workouts");
  }

  await Workout.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Workout deleted successfully"));
});
