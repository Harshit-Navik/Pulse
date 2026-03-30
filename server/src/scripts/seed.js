/**
 * Seed script — populates the database with the 4 default workouts
 * from Workouts.tsx / WorkoutDetail.tsx (so the Workouts page isn't empty).
 *
 * Usage: node -r dotenv/config src/scripts/seed.js
 */
import mongoose from "mongoose";
import { Workout } from "../models/workout.model.js";
import { DB_NAME } from "../constants.js";

const defaultWorkouts = [
  {
    title: "Neural Hypertrophy 1.0",
    tag: "STRENGTH",
    duration: "65 MINS",
    difficulty: "ELITE",
    equipment: "FULL GYM",
    image: "/assets/images/neural-hypertrophy.png",
    description:
      "A high-intensity neural drive program designed to maximize motor unit recruitment and mechanical tension for advanced hypertrophy.",
    exercises: [
      { name: "Barbell Back Squat", sets: 5, reps: "5", rest: "3 min" },
      { name: "Romanian Deadlift", sets: 4, reps: "8", rest: "2 min" },
      { name: "Weighted Pull-Ups", sets: 4, reps: "6", rest: "2.5 min" },
      { name: "Incline Dumbbell Press", sets: 4, reps: "8", rest: "2 min" },
      { name: "Barbell Row", sets: 3, reps: "10", rest: "90 sec" },
      { name: "Face Pulls", sets: 3, reps: "15", rest: "60 sec" },
    ],
    isDefault: true,
    createdBy: null,
  },
  {
    title: "VO2 Max Threshold",
    tag: "CARDIO",
    duration: "45 MINS",
    difficulty: "ADVANCED",
    equipment: "TREADMILL",
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&h=400&fit=crop",
    description:
      "Interval-based conditioning protocol to push your aerobic ceiling and improve cardiovascular output at lactate threshold.",
    exercises: [
      { name: "Dynamic Warm-Up", sets: 1, reps: "5 min", rest: "-" },
      {
        name: "Treadmill Intervals (90% MHR)",
        sets: 6,
        reps: "3 min on / 2 min rest",
        rest: "2 min",
      },
      { name: "Incline Walk Recovery", sets: 1, reps: "5 min", rest: "-" },
      {
        name: "Assault Bike Sprint",
        sets: 4,
        reps: "30 sec on / 90 sec off",
        rest: "90 sec",
      },
      { name: "Cool Down Jog", sets: 1, reps: "5 min", rest: "-" },
    ],
    isDefault: true,
    createdBy: null,
  },
  {
    title: "Fascial Chain Release",
    tag: "MOBILITY",
    duration: "30 MINS",
    difficulty: "BEGINNER",
    equipment: "MAT",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&h=400&fit=crop",
    description:
      "A restorative session targeting the myofascial chains to improve range of motion, reduce adhesions, and accelerate recovery.",
    exercises: [
      {
        name: "Foam Roll — Thoracic Spine",
        sets: 1,
        reps: "3 min",
        rest: "-",
      },
      { name: "Cat-Cow Flow", sets: 3, reps: "10", rest: "30 sec" },
      {
        name: "World's Greatest Stretch",
        sets: 3,
        reps: "5 each side",
        rest: "30 sec",
      },
      {
        name: "90/90 Hip Switch",
        sets: 3,
        reps: "8 each side",
        rest: "30 sec",
      },
      { name: "Pigeon Pose Hold", sets: 2, reps: "60 sec each", rest: "-" },
    ],
    isDefault: true,
    createdBy: null,
  },
  {
    title: "Metabolic Engine Builder",
    tag: "HYBRID",
    duration: "50 MINS",
    difficulty: "EXPERT",
    equipment: "KETTLEBELLS",
    image:
      "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=600&h=400&fit=crop",
    description:
      "A metabolic conditioning circuit combining strength and cardio elements for maximum caloric output and functional endurance.",
    exercises: [
      { name: "Kettlebell Swing", sets: 5, reps: "15", rest: "45 sec" },
      { name: "Goblet Squat", sets: 4, reps: "12", rest: "60 sec" },
      {
        name: "Turkish Get-Up",
        sets: 3,
        reps: "3 each side",
        rest: "90 sec",
      },
      {
        name: "Clean & Press",
        sets: 4,
        reps: "8 each side",
        rest: "60 sec",
      },
      { name: "Renegade Row", sets: 3, reps: "10", rest: "60 sec" },
      {
        name: "Kettlebell Snatch",
        sets: 3,
        reps: "8 each side",
        rest: "90 sec",
      },
    ],
    isDefault: true,
    createdBy: null,
  },
];

async function seed() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("✅ Connected to MongoDB");

    // Check if workouts already exist
    const existing = await Workout.countDocuments({ isDefault: true, createdBy: null });
    if (existing >= 4) {
      console.log(`ℹ️  ${existing} platform workouts already exist. Skipping seed.`);
    } else {
      // Remove old platform defaults and re-insert
      await Workout.deleteMany({ isPublic: true, createdBy: null }); // Also delete the legacy ones
      await Workout.deleteMany({ isDefault: true, createdBy: null });
      const result = await Workout.insertMany(defaultWorkouts);
      console.log(`🌱 Seeded ${result.length} default workouts`);
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected. Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
