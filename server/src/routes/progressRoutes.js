import { Router } from "express";
import {
  logSession,
  getSessions,
  getProgressStats,
} from "../controllers/progressController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All progress routes are protected
router.use(verifyJWT);

router.post("/sessions", logSession);
router.get("/sessions", getSessions);
router.get("/stats", getProgressStats);

export default router;
