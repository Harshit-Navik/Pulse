import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ContactMessage } from "../models/contactMessage.model.js";

/**
 * POST /api/contact
 * Body: { name, email, message }
 * Maps to: Landing.tsx contact form → { contact-name, contact-email, contact-message }
 */
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  if (message.trim().length < 10) {
    throw new ApiError(400, "Message must be at least 10 characters");
  }

  const contact = await ContactMessage.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, contact, "Message sent successfully"));
});
