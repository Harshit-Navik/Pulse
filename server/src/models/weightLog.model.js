import mongoose from "mongoose";

/**
 * Weight Log schema.
 * Maps to:
 *   - Progress.tsx weight chart → { weight, date }
 *   - Progress.tsx add-weight form → POST /api/progress/weight
 *   - Dashboard.tsx user summary card → current weight (latest entry)
 */
const weightLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [10, "Weight must be at least 10"],
      max: [500, "Weight must be at most 500"],
    },
    unit: {
      type: String,
      enum: ["kg", "lbs"],
      default: "kg",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
weightLogSchema.index({ user: 1, date: -1 });

export const WeightLog = mongoose.model("WeightLog", weightLogSchema);
