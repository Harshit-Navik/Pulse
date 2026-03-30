import mongoose from "mongoose";

/**
 * Workout session exercise log sub-schema.
 * Tracks which exercises were completed during a session.
 */
const sessionExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    rest: { type: String, default: "-" },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

/**
 * Workout Session schema.
 * Maps to:
 *   - WorkoutDetail.tsx → timer (elapsed seconds), exercise toggles (completed)
 *   - Progress.tsx SessionCard → { title, date, duration, volume }
 *   - Dashboard.tsx RegimenItem → { session, title, duration, volume, impact }
 *   - Dashboard.tsx stats → Calories Burned (1,842 / 2,400)
 */
const workoutSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      default: null,
    },
    title: {
      type: String,
      required: [true, "Session title is required"],
      trim: true,
    },
    // Duration in minutes (Progress.tsx: "72m", "45m")
    duration: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Volume as string (Progress.tsx: "14.2k", "18.5k", "N/A")
    volume: {
      type: String,
      default: "N/A",
    },
    caloriesBurned: {
      type: Number,
      min: 0,
      default: 0,
    },
    exercises: [sessionExerciseSchema],
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
workoutSessionSchema.index({ user: 1, createdAt: -1 });
workoutSessionSchema.index({ user: 1, completedAt: -1 });

export const WorkoutSession = mongoose.model("WorkoutSession", workoutSessionSchema);
