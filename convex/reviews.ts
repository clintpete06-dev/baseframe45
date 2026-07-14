import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProductReviews = query({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});

export const addReview = mutation({
  args: {
    productId: v.string(),
    user: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const date = new Date().toISOString().split("T")[0];
    const reviewId = await ctx.db.insert("reviews", {
      productId: args.productId,
      user: args.user,
      rating: args.rating,
      date,
      comment: args.comment,
    });
    return reviewId;
  },
});
