import mongoose from "mongoose";

/**
 * Exercise sub-document schema.
 * Maps to: WorkoutDetail.tsx Exercise interface
 *   { name, sets, reps, rest, completed }
 */
const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
    },
    sets: {
      type: Number,
      required: [true, "Number of sets is required"],
      min: 1,
    },
    reps: {
      type: String,
      required: [true, "Reps information is required"],
      trim: true,
    },
    rest: {
      type: String,
      default: "-",
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Workout schema.
 * Maps to:
 *   - Workouts.tsx allWorkouts[] → { id, tag, title, duration, difficulty, equipment, image }
 *   - WorkoutDetail.tsx workoutDatabase → { id, tag, title, duration, difficulty, equipment, image, description, exercises }
 *   - Workouts.tsx Quick-Add modal → { workout-name, workout-duration, workout-type (discipline) }
 *   - Dashboard.tsx RegimenItem → { session, title, duration, volume, image }
 */
const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Workout title is required"],
      trim: true,
      index: true,
    },
    tag: {
      type: String,
      required: [true, "Workout discipline (tag) is required"],
      enum: {
        values: ["STRENGTH", "CARDIO", "MOBILITY", "HYBRID", "RECOVERY"],
        message: "{VALUE} is not a valid discipline",
      },
      index: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["BEGINNER", "ADVANCED", "EXPERT", "ELITE"],
        message: "{VALUE} is not a valid difficulty level",
      },
      default: "BEGINNER",
    },
    equipment: {
      type: String,
      trim: true,
      default: "NONE",
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    exercises: [exerciseSchema],

    // Creator reference (null for platform-default workouts)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Distinguishes platform defaults from user-created workouts
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
workoutSchema.index({ tag: 1, difficulty: 1 });
workoutSchema.index({ createdBy: 1 });
workoutSchema.index({ createdAt: -1 });

export const Workout = mongoose.model("Workout", workoutSchema);
