import { Router } from "express";
import {
  logMeal,
  getMeals,
  getDailySummary,
  updateMeal,
  deleteMeal,
  getDiets,
  getDietById,
  createDiet,
  updateDiet,
  deleteDiet,
  addMealToDiet,
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

router.get("/diets", getDiets);
router.get("/diets/:id", getDietById);
router.post("/diets", createDiet);
router.put("/diets/:id", updateDiet);
router.delete("/diets/:id", deleteDiet);
router.post("/diets/:id/meals", addMealToDiet);

export default router;
