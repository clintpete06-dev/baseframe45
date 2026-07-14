import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordSuccessfulPayment = mutation({
  args: {
    reference: v.string(),
    amount: v.number(),
    currency: v.string(),
    userId: v.string(),
    email: v.string(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("paymentTransactions")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .unique();

    if (existing) return existing._id;

    const paymentId = await ctx.db.insert("paymentTransactions", {
      reference: args.reference,
      amount: args.amount,
      currency: args.currency,
      userId: args.userId,
      email: args.email,
      status: "success",
      metadata: args.metadata,
      createdAt: Date.now(),
    });

    return paymentId;
  },
});

export const getByReference = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("paymentTransactions")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .unique();
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("paymentTransactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
