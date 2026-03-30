import mongoose from "mongoose";

/**
 * Chat Session schema.
 * Maps to: Chatbot.tsx
 *   - User inputs collected via STEPS: age, gender, height, weight, goal, activity, diet
 *   - API body sent to /api/chat/generate-plan: { age, gender, height, weight, goal, activityLevel, dietaryPreference }
 *   - Plan interface: { summary, dailyCalories, macros, diet[], workout[], tips[] }
 *   - Message interface: { id, role, text, timestamp, options?, plan? }
 */

// ── Diet item sub-schema ───────────────────────────────────────────
const dietItemSchema = new mongoose.Schema(
  {
    meal: { type: String, required: true },
    time: { type: String, required: true },
    items: { type: [String], default: [] },
    calories: { type: Number, required: true },
  },
  { _id: false }
);

// ── Workout item sub-schema ────────────────────────────────────────
const workoutItemSchema = new mongoose.Schema(
  {
    exercise: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    rest: { type: String, default: "" },
  },
  { _id: false }
);

// ── Chat message sub-schema ────────────────────────────────────────
const chatMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ── Main Chat Session schema ───────────────────────────────────────
const chatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },

    // Data collected during the conversational flow
    // Field names match the API body sent to /api/chat/generate-plan
    userInputs: {
      age: { type: String, required: true },
      gender: { type: String, required: true },
      height: { type: String, required: true },
      weight: { type: String, required: true },
      goal: { type: String, required: true },
      activityLevel: { type: String, required: true },
      dietaryPreference: { type: String, required: true },
    },

    // Generated plan — mirrors the Plan TypeScript interface in Chatbot.tsx
    plan: {
      summary: { type: String, default: "" },
      dailyCalories: { type: Number, default: 0 },
      macros: {
        protein: { type: String, default: "0g" },
        carbs: { type: String, default: "0g" },
        fats: { type: String, default: "0g" },
      },
      diet: [dietItemSchema],
      workout: [workoutItemSchema],
      tips: { type: [String], default: [] },
    },

    // Full chat message history for replay
    messages: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
chatSessionSchema.index({ user: 1, createdAt: -1 });

export const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
