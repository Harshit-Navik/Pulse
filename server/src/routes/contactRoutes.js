import { Router } from "express";
import { submitContactMessage } from "../controllers/contactController.js";

const router = Router();

// Public route — no auth required for contact form
router.post("/", submitContactMessage);

export default router;
