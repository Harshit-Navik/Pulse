import { Router } from "express";
import { handleChatMessage, generatePlan } from "../controllers/chatController.js";

const router = Router();

// Single message exchange
router.post("/", handleChatMessage);

// Generate full diet + workout plan from collected user data
router.post("/generate-plan", generatePlan);

export default router;
