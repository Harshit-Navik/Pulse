import mongoose from "mongoose";

/**
 * Product schema.
 * Maps to:
 *   - Products.tsx upcomingProducts[] → { id, name, description, tag, icon, image }
 *   - Landing.tsx ProductCard pricing → { tier, price, description, features, highlighted }
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    tag: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      enum: {
        values: ["Wearable", "Equipment", "Supplement", "Recovery", "Software"],
        message: "{VALUE} is not a valid product category",
      },
      default: "Equipment",
    },
    availability: {
      type: String,
      enum: {
        values: ["Available", "Pre-Order", "Coming Soon", "In Development", "Prototype"],
        message: "{VALUE} is not a valid availability status",
      },
      default: "Coming Soon",
    },
    features: {
      type: [String],
      default: [],
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────
productSchema.index({ category: 1 });
productSchema.index({ availability: 1 });

export const Product = mongoose.model("Product", productSchema);
