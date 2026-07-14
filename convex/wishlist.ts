import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getWishlist = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return items.map((item) => ({
      _id: item._id,
      productId: item.productId,
    }));
  },
});

export const toggle = mutation({
  args: { userId: v.string(), productId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return "removed";
    } else {
      await ctx.db.insert("wishlistItems", {
        userId: args.userId,
        productId: args.productId,
      });
      return "added";
    }
  },
});
