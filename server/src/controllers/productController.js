import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

/**
 * GET /api/products
 * Query params: ?category=Wearable&availability=Prototype
 * Maps to: Products.tsx upcomingProducts[] display
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { category, availability } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (availability) filter.availability = availability;

  const products = await Product.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

/**
 * GET /api/products/:id
 * Maps to: Products.tsx → View Specs button (future detail page)
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});
