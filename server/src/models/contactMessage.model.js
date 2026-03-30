import mongoose from "mongoose";

/**
 * Contact Message schema.
 * Maps to: Landing.tsx contact form
 *   - Inputs: contact-name, contact-email, contact-message
 *   - Footer.tsx: support@pulse.monolith email
 */
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["new", "read", "replied", "archived"],
        message: "{VALUE} is not a valid status",
      },
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
