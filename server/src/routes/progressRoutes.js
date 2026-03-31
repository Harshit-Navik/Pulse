import { Router } from "express";
import {
  logSession,
  getSessions,
  getProgressStats,
  getDashboard,
  getWeightHistory,
  addWeightEntry,
} from "../controllers/progressController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All progress routes are protected
router.use(verifyJWT);

// Session routes (existing)
router.post("/sessions", logSession);
router.get("/sessions", getSessions);
router.get("/stats", getProgressStats);

// Dashboard aggregate (new)
router.get("/dashboard", getDashboard);

// Weight log routes (new)
router.get("/weight", getWeightHistory);
router.post("/weight", addWeightEntry);

export default router;
