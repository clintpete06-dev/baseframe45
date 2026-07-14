import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        productName: v.string(),
        brand: v.string(),
        selectedSize: v.number(),
        selectedColor: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    subtotal: v.number(),
    discount: v.optional(v.number()),
    shipping: v.number(),
    total: v.number(),
    promoCode: v.optional(v.string()),
    shippingAddress: v.object({
      fullName: v.string(),
      address: v.string(),
      city: v.string(),
      zip: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "processing",
      createdAt: Date.now(),
    });

    // Clear user's cart after order
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return orderId;
  },
});

export const getUserOrders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
