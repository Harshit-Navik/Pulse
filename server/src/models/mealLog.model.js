import mongoose from "mongoose";

/**
 * Meal item sub-schema.
 * Maps to: Nutrition.tsx MealCard items[] → { name, cals }
 */
const mealItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cals: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

/**
 * Meal Log schema.
 * Maps to:
 *   - Nutrition.tsx MealCard → { time, type, items, totalCals }
 *   - Nutrition.tsx Log Meal modal → { meal-name, meal-calories, meal-protein, meal-type }
 *   - Nutrition.tsx Macro Distribution → { Protein, Carbs, Fats } current vs target
 */
const mealLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Meal name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Meal type is required"],
      enum: {
        values: ["Breakfast", "Lunch", "Dinner", "Snack"],
        message: "{VALUE} is not a valid meal type",
      },
    },
    calories: {
      type: Number,
      min: 0,
      default: 0,
    },
    protein: {
      type: Number,
      min: 0,
      default: 0,
    },
    carbs: {
      type: Number,
      min: 0,
      default: 0,
    },
    fats: {
      type: Number,
      min: 0,
      default: 0,
    },
    items: [mealItemSchema],
    // Time string as displayed in MealCard ("08:30 AM")
    time: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
mealLogSchema.index({ user: 1, createdAt: -1 });
mealLogSchema.index({ user: 1, type: 1 });

export const MealLog = mongoose.model("MealLog", mealLogSchema);
