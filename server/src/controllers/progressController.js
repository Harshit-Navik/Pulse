import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { WorkoutSession } from "../models/workoutSession.model.js";
import { MealLog } from "../models/mealLog.model.js";
import { WeightLog } from "../models/weightLog.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Returns midnight (start) of a given date as a Date object.
 */
function startOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns end-of-day (23:59:59.999) of a given date.
 */
function endOf(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Build an array of the last N day labels ["Mon", "Tue", ...] ending today.
 */
function lastNDayLabels(n) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push(labels[d.getDay()]);
  }
  return result;
}

/**
 * Compute the current workout streak (consecutive days with ≥1 session).
 * Sessions is an array of { completedAt / createdAt } sorted newest-first.
 */
function computeStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;

  const activityDays = new Set(
    sessions.map((s) => {
      const d = startOf(s.completedAt || s.createdAt);
      return d.toDateString();
    })
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (activityDays.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      // Allow today to be empty (we haven't worked out yet today)
      break;
    }
  }

  return streak;
}

/**
 * Derive daily calorie target from user profile (auto-calculation).
 * Multipliers:
 *   Fat Loss  → weight(kg) × 28
 *   Muscle Gain → weight(kg) × 36
 *   Maintenance / General Fitness → weight(kg) × 32
 * Falls back to 2200 if no data.
 */
function calcCalorieTarget(user) {
  if (!user?.weight) return 2200;
  const multipliers = {
    "Fat Loss": 28,
    "Muscle Gain": 36,
    Maintenance: 32,
    "General Fitness": 32,
  };
  const multiplier = multipliers[user.fitnessGoal] || 32;
  return Math.round(user.weight * multiplier);
}

// ── Controllers ────────────────────────────────────────────────────

/**
 * POST /api/progress/sessions
 * Body: { workout, title, duration, volume, caloriesBurned, exercises, completedAt }
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
 * Returns aggregated stats + 7-day chart + streak + active days.
 */
export const getProgressStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const today = new Date();

  // ── All-time aggregates ────────────────────────────────────────
  const overallResult = await WorkoutSession.aggregate([
    { $match: { user: userId } },
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

  const overall = overallResult[0] || {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    avgDuration: 0,
  };
  overall.avgDuration = Math.round(overall.avgDuration || 0);

  // ── Last 7-day chart ───────────────────────────────────────────
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weekSessions = await WorkoutSession.find({
    user: userId,
    createdAt: { $gte: sevenDaysAgo },
  }).select("caloriesBurned duration createdAt completedAt");

  // Build per-day buckets
  const dayLabels = lastNDayLabels(7);
  const weeklyChart = dayLabels.map((day, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - idx));
    const dayStr = d.toDateString();

    const daySessions = weekSessions.filter((s) => {
      return startOf(s.completedAt || s.createdAt).toDateString() === dayStr;
    });

    return {
      day,
      caloriesBurned: daySessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0),
      duration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      hasSession: daySessions.length > 0,
    };
  });

  // ── Weekly calories & active days ─────────────────────────────
  const weeklyCalories = weeklyChart.reduce((sum, d) => sum + d.caloriesBurned, 0);
  const activeDaysThisWeek = weeklyChart.filter((d) => d.hasSession).length;

  // ── Streak ────────────────────────────────────────────────────
  const allSessions = await WorkoutSession.find({ user: userId })
    .select("completedAt createdAt")
    .sort({ createdAt: -1 });
  const streak = computeStreak(allSessions);

  return res.status(200).json(
    new ApiResponse(200, {
      ...overall,
      weeklyChart,
      weeklyCalories,
      activeDaysThisWeek,
      streak,
    }, "Progress stats fetched")
  );
});

/**
 * GET /api/progress/dashboard
 * Single aggregated endpoint for the Dashboard page.
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const today = new Date();

  // ── User profile ──────────────────────────────────────────────
  const user = await User.findById(userId).select(
    "name weight fitnessGoal activityLevel stats"
  );

  const calorieTarget = calcCalorieTarget(user);
  const proteinTarget = user?.weight ? Math.round(user.weight * 2) : 150;

  // ── Today's nutrition summary ─────────────────────────────────
  const nutritionResult = await MealLog.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: startOf(today), $lte: endOf(today) },
      },
    },
    {
      $group: {
        _id: null,
        todayCalories: { $sum: "$calories" },
        todayProtein: { $sum: "$protein" },
        todayCarbs: { $sum: "$carbs" },
        todayFats: { $sum: "$fats" },
        mealCount: { $sum: 1 },
      },
    },
  ]);

  const nutrition = nutritionResult[0] || {
    todayCalories: 0,
    todayProtein: 0,
    todayCarbs: 0,
    todayFats: 0,
    mealCount: 0,
  };

  // ── Last 7-day workout chart ───────────────────────────────────
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weekSessions = await WorkoutSession.find({
    user: userId,
    createdAt: { $gte: sevenDaysAgo },
  }).select("caloriesBurned duration createdAt completedAt title");

  const dayLabels = lastNDayLabels(7);
  const weeklyChart = dayLabels.map((day, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - idx));
    const dayStr = d.toDateString();

    const daySessions = weekSessions.filter((s) => {
      return startOf(s.completedAt || s.createdAt).toDateString() === dayStr;
    });

    return {
      day,
      caloriesBurned: daySessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0),
      duration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      hasSession: daySessions.length > 0,
    };
  });

  // ── Weekly totals ─────────────────────────────────────────────
  const weeklyCalories = weeklyChart.reduce((sum, d) => sum + d.caloriesBurned, 0);
  const activeDaysThisWeek = weeklyChart.filter((d) => d.hasSession).length;

  // ── Streak ────────────────────────────────────────────────────
  const allSessions = await WorkoutSession.find({ user: userId })
    .select("completedAt createdAt")
    .sort({ createdAt: -1 });
  const streak = computeStreak(allSessions);

  // ── Total workouts ────────────────────────────────────────────
  const totalWorkouts = await WorkoutSession.countDocuments({ user: userId });

  // ── Recent sessions (last 5) ──────────────────────────────────
  const recentSessions = await WorkoutSession.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("workout", "title tag image");

  // ── Latest weight entry ───────────────────────────────────────
  const latestWeight = await WeightLog.findOne({ user: userId }).sort({ date: -1 });

  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        name: user?.name || "Athlete",
        weight: latestWeight?.weight || user?.weight || null,
        weightUnit: latestWeight?.unit || "kg",
        fitnessGoal: user?.fitnessGoal || null,
        totalWorkouts: user?.stats?.totalWorkouts || totalWorkouts,
      },
      calorieTarget,
      proteinTarget,
      nutrition,
      weeklyChart,
      weeklyCalories,
      activeDaysThisWeek,
      streak,
      totalWorkouts,
      recentSessions,
    }, "Dashboard data fetched")
  );
});

/**
 * GET /api/progress/weight
 * Returns user's weight history (last 30 entries).
 */
export const getWeightHistory = asyncHandler(async (req, res) => {
  const { limit = 30 } = req.query;

  const entries = await WeightLog.find({ user: req.user._id })
    .sort({ date: -1 })
    .limit(parseInt(limit));

  return res
    .status(200)
    .json(new ApiResponse(200, entries, "Weight history fetched"));
});

/**
 * POST /api/progress/weight
 * Body: { weight, unit, date }
 */
export const addWeightEntry = asyncHandler(async (req, res) => {
  const { weight, unit = "kg", date } = req.body;

  if (!weight || isNaN(weight)) {
    throw new ApiError(400, "Valid weight is required");
  }

  const entry = await WeightLog.create({
    user: req.user._id,
    weight: parseFloat(weight),
    unit,
    date: date ? new Date(date) : new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, entry, "Weight entry added successfully"));
});
