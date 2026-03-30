import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { WorkoutSession } from "../models/workoutSession.model.js";

/**
 * POST /api/progress/sessions
 * Body: { workout, title, duration, volume, caloriesBurned, exercises, completedAt }
 * Maps to: WorkoutDetail.tsx → on workout completion (timer stop + all exercises checked)
 */
export const logSession = asyncHandler(async (req, res) => {
  const { workout, title, duration, volume, caloriesBurned, exercises, completedAt } =
    req.body;

  if (!title) {
    throw new ApiError(400, "Session title is required");
  }

  const session = await WorkoutSession.create({
    user: req.user._id,
    workout: workout || null,
    title,
    duration: duration || 0,
    volume: volume || "N/A",
    caloriesBurned: caloriesBurned || 0,
    exercises: exercises || [],
    completedAt: completedAt || new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, session, "Workout session logged successfully"));
});

/**
 * GET /api/progress/sessions
 * Returns user's recent workout sessions.
 * Maps to: Progress.tsx SessionCard list → { title, date, duration, volume }
 */
export const getSessions = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const sessions = await WorkoutSession.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate("workout", "title tag image");

  return res
    .status(200)
    .json(new ApiResponse(200, sessions, "Sessions fetched successfully"));
});

/**
 * GET /api/progress/stats
 * Returns aggregated progress statistics.
 * Maps to: Progress.tsx QuickStat → { Total Workouts, Avg Duration, Total Calories }
 *          Dashboard.tsx → calorie stats, weekly volume
 */
export const getProgressStats = asyncHandler(async (req, res) => {
  const result = await WorkoutSession.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalDuration: { $sum: "$duration" },
        totalCalories: { $sum: "$caloriesBurned" },
        avgDuration: { $avg: "$duration" },
      },
    },
  ]);

  const stats = result[0] || {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    avgDuration: 0,
  };

  stats.avgDuration = Math.round(stats.avgDuration || 0);

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Progress stats fetched"));
});
