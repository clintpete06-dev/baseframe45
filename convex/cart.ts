import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const products = await ctx.db.query("products").collect();
    const productMap = new Map(products.map((p) => [p._id, p]));

    return items.map((item) => {
      const product = productMap.get(item.productId);
      return { ...item, product: product ?? null };
    });
  },
});

export const addItem = mutation({
  args: {
    userId: v.string(),
    productId: v.string(),
    selectedSize: v.number(),
    selectedColor: v.string(),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const existing = items.find(
      (item) =>
        item.productId === args.productId &&
        item.selectedSize === args.selectedSize &&
        item.selectedColor === args.selectedColor
    );

    if (existing) {
      await ctx.db.patch(existing._id, { quantity: existing.quantity + 1 });
    } else {
      await ctx.db.insert("cartItems", {
        userId: args.userId,
        productId: args.productId,
        selectedSize: args.selectedSize,
        selectedColor: args.selectedColor,
        quantity: 1,
      });
    }
  },
});

export const updateQuantity = mutation({
  args: { itemId: v.id("cartItems"), quantity: v.number() },
  handler: async (ctx, args) => {
    if (args.quantity <= 0) {
      await ctx.db.delete(args.itemId);
    } else {
      await ctx.db.patch(args.itemId, { quantity: args.quantity });
    }
  },
});

export const removeItem = mutation({
  args: { itemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
  },
});

export const clearCart = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }
  },
});
