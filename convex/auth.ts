import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
  args: {
    email: v.string(),
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return { success: false, message: "User already exists", userId: existing._id };
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      fullName: args.fullName,
      username: args.username,
      passwordHash: args.password,
      xpPoints: 0,
    });

    return { success: true, message: "Registered successfully", userId };
  },
});

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.passwordHash !== args.password) {
      return { success: false, message: "Invalid password" };
    }

    return {
      success: true,
      message: "Login successful",
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
    };
  },
});

export const loginAsGuest = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        email: args.email,
        fullName: "Guest",
        xpPoints: 1450,
      });
      return { success: true, userId, email: args.email, fullName: "Guest" };
    }

    return { success: true, userId: user._id, email: user.email, fullName: user.fullName };
  },
});

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) return null;
    return {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      xpPoints: user.xpPoints,
    };
  },
});
