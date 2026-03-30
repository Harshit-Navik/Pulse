import mongoose from "mongoose";

const dietMealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Meal name is required"],
      trim: true,
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
    quantity: {
      type: String,
      default: "",
      trim: true,
    },
    time: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const dietSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Diet title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
      index: true,
    },
    meals: [dietMealSchema],
  },
  { timestamps: true }
);

dietSchema.index({ createdBy: 1, createdAt: -1 });

export const Diet = mongoose.model("Diet", dietSchema);
