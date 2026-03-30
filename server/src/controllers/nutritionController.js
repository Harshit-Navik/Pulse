import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { MealLog } from "../models/mealLog.model.js";
import { Diet } from "../models/diet.model.js";

/**
 * POST /api/nutrition/meals
 * Body: { name, type, calories, protein, carbs, fats, items, time }
 * Maps to: Nutrition.tsx Log Meal modal
 */
export const logMeal = asyncHandler(async (req, res) => {
  const { name, type, calories, protein, carbs, fats, items, time } = req.body;

  if (!name || !type) {
    throw new ApiError(400, "Meal name and type are required");
  }

  const meal = await MealLog.create({
    user: req.user._id,
    name,
    type,
    calories: calories || 0,
    protein: protein || 0,
    carbs: carbs || 0,
    fats: fats || 0,
    items: items || [],
    time: time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, meal, "Meal logged successfully"));
});

/**
 * GET /api/nutrition/meals
 * Query: ?date=2024-10-01 (optional, defaults to all)
 * Maps to: Nutrition.tsx MealCard list
 */
export const getMeals = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const filter = { user: req.user._id };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }

  const meals = await MealLog.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, meals, "Meals fetched successfully"));
});

/**
 * GET /api/nutrition/summary
 * Returns daily macro totals for today.
 * Maps to: Nutrition.tsx calorie summary + MacroBar components
 */
export const getDailySummary = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const result = await MealLog.aggregate([
    {
      $match: {
        user: req.user._id,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        totalCalories: { $sum: "$calories" },
        totalProtein: { $sum: "$protein" },
        totalCarbs: { $sum: "$carbs" },
        totalFats: { $sum: "$fats" },
        mealCount: { $sum: 1 },
      },
    },
  ]);

  const summary = result[0] || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    mealCount: 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, summary, "Daily summary fetched"));
});

/**
 * PUT /api/nutrition/meals/:id
 * Protected — only the owner can update their meal.
 */
export const updateMeal = asyncHandler(async (req, res) => {
  const meal = await MealLog.findById(req.params.id);

  if (!meal) {
    throw new ApiError(404, "Meal not found");
  }

  if (meal.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own meals");
  }

  const allowedFields = [
    "name", "type", "calories", "protein", "carbs", "fats", "items", "time",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const updated = await MealLog.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Meal updated successfully"));
});

/**
 * DELETE /api/nutrition/meals/:id
 * Protected — only the owner can delete their meal.
 */
export const deleteMeal = asyncHandler(async (req, res) => {
  const meal = await MealLog.findById(req.params.id);

  if (!meal) {
    throw new ApiError(404, "Meal not found");
  }

  if (meal.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own meals");
  }

  await MealLog.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Meal deleted successfully"));
});

/**
 * GET /api/nutrition/diets
 * Protected — returns only current user's diets.
 */
export const getDiets = asyncHandler(async (req, res) => {
  const diets = await Diet.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, diets, "Diets fetched successfully"));
});

/**
 * GET /api/nutrition/diets/:id
 * Protected — owner-only access.
 */
export const getDietById = asyncHandler(async (req, res) => {
  const diet = await Diet.findById(req.params.id);

  if (!diet) {
    throw new ApiError(404, "Diet not found");
  }

  if (diet.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view this diet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, diet, "Diet fetched successfully"));
});

/**
 * POST /api/nutrition/diets
 * Body: { title, description }
 */
export const createDiet = asyncHandler(async (req, res) => {
  const incomingTitle = req.body?.title ?? req.body?.dietName ?? req.body?.name;
  const incomingDescription = req.body?.description ?? req.body?.notes ?? "";
  const incomingMeals = Array.isArray(req.body?.meals) ? req.body.meals : [];

  if (!incomingTitle?.trim()) {
    throw new ApiError(400, "Diet title is required");
  }

  const diet = await Diet.create({
    title: incomingTitle.trim(),
    description: incomingDescription?.trim() || "",
    createdBy: req.user._id,
    meals: incomingMeals,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, diet, "Diet created successfully"));
});

/**
 * PUT /api/nutrition/diets/:id
 * Protected — owner-only.
 */
export const updateDiet = asyncHandler(async (req, res) => {
  const diet = await Diet.findById(req.params.id);

  if (!diet) {
    throw new ApiError(404, "Diet not found");
  }

  if (diet.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own diets");
  }

  const updates = {};
  if (req.body.title !== undefined || req.body.dietName !== undefined) {
    updates.title = req.body.title ?? req.body.dietName;
  }
  if (req.body.description !== undefined || req.body.notes !== undefined) {
    updates.description = req.body.description ?? req.body.notes;
  }

  const updated = await Diet.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Diet updated successfully"));
});

/**
 * DELETE /api/nutrition/diets/:id
 * Protected — owner-only.
 */
export const deleteDiet = asyncHandler(async (req, res) => {
  const diet = await Diet.findById(req.params.id);

  if (!diet) {
    throw new ApiError(404, "Diet not found");
  }

  if (diet.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own diets");
  }

  await Diet.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Diet deleted successfully"));
});

/**
 * POST /api/nutrition/diets/:id/meals
 * Body: { name, calories, protein, carbs, fats, quantity, time, notes }
 * Protected — owner-only.
 */
export const addMealToDiet = asyncHandler(async (req, res) => {
  const diet = await Diet.findById(req.params.id);

  if (!diet) {
    throw new ApiError(404, "Diet not found");
  }

  if (diet.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this diet");
  }

  if (!req.body?.name?.trim()) {
    throw new ApiError(400, "Meal name is required");
  }

  diet.meals.push({
    name: req.body.name.trim(),
    calories: req.body.calories || 0,
    protein: req.body.protein || 0,
    carbs: req.body.carbs || 0,
    fats: req.body.fats || 0,
    quantity: req.body.quantity || "",
    time: req.body.time || "",
    notes: req.body.notes || "",
  });

  await diet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, diet, "Meal added to diet successfully"));
});
