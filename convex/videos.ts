import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByProduct = query({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("productVideos")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});
