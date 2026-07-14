import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const get = query({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products").collect();
    return allProducts.find((p) => p._id === args.productId) ?? null;
  },
});

export const getByShoeCode = query({
  args: { shoeCode: v.string() },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products").collect();
    return allProducts.find((p) => p.shoeCode === args.shoeCode) ?? null;
  },
});

export const seed = mutation({
  args: {
    products: v.array(
      v.object({
        brand: v.string(),
        name: v.string(),
        price: v.number(),
        originalPrice: v.optional(v.number()),
        rating: v.number(),
        reviewCount: v.number(),
        images: v.array(v.string()),
        description: v.string(),
        sizes: v.array(v.number()),
        colors: v.array(v.string()),
        colorsHex: v.optional(v.array(v.string())),
        category: v.union(
          v.literal("Sneakers"),
          v.literal("Luxury"),
          v.literal("Boots"),
          v.literal("Casual"),
          v.literal("New Arrivals"),
          v.literal("Sale")
        ),
        isNewArrival: v.optional(v.boolean()),
        isBestSeller: v.optional(v.boolean()),
        isTrending: v.optional(v.boolean()),
        isSale: v.optional(v.boolean()),
        isFeatured: v.optional(v.boolean()),
        discount: v.optional(v.number()),
        shoeCode: v.string(),
        specifications: v.record(v.string(), v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("products").collect();
    if (existing.length > 0) return "already_seeded";

    for (const product of args.products) {
      await ctx.db.insert("products", product);
    }
    return "seeded";
  },
});
