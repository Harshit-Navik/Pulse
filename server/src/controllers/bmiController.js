import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BMIRecord } from "../models/bmiRecord.model.js";

/**
 * POST /api/bmi
 * Body: { height, weight, unit, bmiValue, category }
 * Maps to: BMICalculator.tsx → after calculateBMI() and getBMIResult()
 */
export const saveBMIRecord = asyncHandler(async (req, res) => {
  const { height, weight, unit, bmiValue, category } = req.body;

  if (!height || !weight || !unit || !bmiValue || !category) {
    throw new ApiError(400, "All BMI fields are required");
  }

  const record = await BMIRecord.create({
    user: req.user._id,
    height,
    weight,
    unit,
    bmiValue,
    category,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, record, "BMI record saved successfully"));
});

/**
 * GET /api/bmi/history
 * Returns the user's BMI calculation history (latest first).
 */
export const getBMIHistory = asyncHandler(async (req, res) => {
  const records = await BMIRecord.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  return res
    .status(200)
    .json(new ApiResponse(200, records, "BMI history fetched successfully"));
});
