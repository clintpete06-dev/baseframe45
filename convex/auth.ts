import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const syncFirebaseUser = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists by firebaseUid
    const allUsers = await ctx.db.query("users").collect();
    const existing = allUsers.find(
      (u) => (u as any).firebaseUid === args.firebaseUid
    );

    if (existing) {
      // Update if needed
      if (existing.fullName !== args.fullName || existing.email !== args.email) {
        await ctx.db.patch(existing._id, {
          email: args.email,
          fullName: args.fullName,
        });
      }
      return { success: true, userId: existing._id };
    }

    // Create new Convex user record linked to Firebase UID
    const userId = await ctx.db.insert("users", {
      email: args.email,
      fullName: args.fullName,
      xpPoints: 0,
      firebaseUid: args.firebaseUid,
    } as any);

    return { success: true, userId };
  },
});

export const getUserByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    const allUsers = await ctx.db.query("users").collect();
    const user = allUsers.find(
      (u) => (u as any).firebaseUid === args.firebaseUid
    );
    if (!user) return null;
    return {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      xpPoints: user.xpPoints,
    };
  },
});

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

    if ((user as any).passwordHash !== args.password) {
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
