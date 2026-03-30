import { Router } from "express";
import { saveBMIRecord, getBMIHistory } from "../controllers/bmiController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All BMI routes are protected
router.use(verifyJWT);

router.post("/", saveBMIRecord);
router.get("/history", getBMIHistory);

export default router;
