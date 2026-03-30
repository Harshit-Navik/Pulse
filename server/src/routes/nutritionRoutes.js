import { Router } from "express";
import {
  logMeal,
  getMeals,
  getDailySummary,
  updateMeal,
  deleteMeal,
} from "../controllers/nutritionController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All nutrition routes are protected
router.use(verifyJWT);

router.post("/meals", logMeal);
router.get("/meals", getMeals);
router.get("/summary", getDailySummary);
router.put("/meals/:id", updateMeal);
router.delete("/meals/:id", deleteMeal);

export default router;
