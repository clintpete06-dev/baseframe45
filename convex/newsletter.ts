import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) return { success: true, message: "Already subscribed" };

    await ctx.db.insert("newsletterSubscribers", { email: args.email });
    return { success: true, message: "Subscribed successfully" };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("newsletterSubscribers").collect();
  },
});
