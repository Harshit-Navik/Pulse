import mongoose from "mongoose";

/**
 * BMI Record schema.
 * Maps to: BMICalculator.tsx
 *   - Inputs: bmi-height (cm or ft/in), bmi-weight (kg or lbs), unit toggle
 *   - Result: BMIResult { value, category, color, icon, tips, range }
 *
 * Stores the computed BMI with raw inputs for history tracking.
 */
const bmiRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    height: {
      type: Number,
      required: [true, "Height is required"],
      min: [1, "Height must be positive"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [1, "Weight must be positive"],
    },
    unit: {
      type: String,
      required: true,
      enum: {
        values: ["metric", "imperial"],
        message: "{VALUE} is not a valid unit system",
      },
      default: "metric",
    },
    bmiValue: {
      type: Number,
      required: [true, "BMI value is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "BMI category is required"],
      enum: {
        values: ["Underweight", "Normal", "Overweight", "Obese"],
        message: "{VALUE} is not a valid BMI category",
      },
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
bmiRecordSchema.index({ user: 1, createdAt: -1 });

export const BMIRecord = mongoose.model("BMIRecord", bmiRecordSchema);
