import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    // ── Core Auth Fields (existing) ──────────────────────────────
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },

    // ── Profile Fields ───────────────────────────────────────────
    // Maps to: Profile.tsx (profile-phone, Camera button)
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },

    // ── Subscription & Tier ──────────────────────────────────────
    // Maps to: AuthContext.tsx (tier), Landing.tsx pricing cards, Profile.tsx subscription
    tier: {
      type: String,
      enum: ["Starter", "Black", "Obsidian", "Elite"],
      default: "Starter",
    },
    subscription: {
      plan: {
        type: String,
        enum: ["Free", "Pulse Black", "Pulse Obsidian"],
        default: "Free",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "trial", "cancelled"],
        default: "active",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
    },

    // ── Body Metrics ─────────────────────────────────────────────
    // Maps to: Chatbot.tsx steps (height, weight, age, gender)
    //          BMICalculator.tsx inputs
    height: {
      type: Number,
      min: [50, "Height must be at least 50 cm"],
      max: [300, "Height must be at most 300 cm"],
    },
    weight: {
      type: Number,
      min: [10, "Weight must be at least 10 kg"],
      max: [500, "Weight must be at most 500 kg"],
    },
    age: {
      type: Number,
      min: [10, "Age must be at least 10"],
      max: [120, "Age must be at most 120"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    // ── Fitness Profile ──────────────────────────────────────────
    // Maps to: Chatbot.tsx steps (goal, activity, diet)
    //          Profile.tsx GoalItem cards
    fitnessGoal: {
      type: String,
      enum: ["Fat Loss", "Muscle Gain", "Maintenance", "General Fitness"],
    },
    activityLevel: {
      type: String,
      enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
    },
    dietaryPreference: {
      type: String,
      enum: ["No Preference", "Vegetarian", "Vegan", "Keto", "Paleo"],
    },

    // ── User Preferences ─────────────────────────────────────────
    // Maps to: Profile.tsx ToggleItem components
    preferences: {
      biometricSync: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
      publicProfile: { type: Boolean, default: false },
    },

    // ── Aggregated Stats ─────────────────────────────────────────
    // Maps to: Profile.tsx ProfileStat components (Consistency, Workouts, Level)
    stats: {
      consistency: { type: Number, default: 0, min: 0, max: 100 },
      totalWorkouts: { type: Number, default: 0, min: 0 },
      level: { type: Number, default: 1, min: 1 },
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
userSchema.index({ tier: 1 });
userSchema.index({ createdAt: -1 });

// ── Pre-save Middleware ────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ── Instance Methods ───────────────────────────────────────────────
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
