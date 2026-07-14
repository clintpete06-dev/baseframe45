import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
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
  }),

  users: defineTable({
    email: v.string(),
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    firebaseUid: v.optional(v.string()),
    xpPoints: v.optional(v.number()),
  }).index("by_email", ["email"]).index("by_firebaseUid", ["firebaseUid"]),

  cartItems: defineTable({
    userId: v.string(),
    productId: v.string(),
    selectedSize: v.number(),
    selectedColor: v.string(),
    quantity: v.number(),
  }).index("by_user", ["userId"]),

  wishlistItems: defineTable({
    userId: v.string(),
    productId: v.string(),
  }).index("by_user", ["userId"]).index("by_user_product", ["userId", "productId"]),

  orders: defineTable({
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
    status: v.union(
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered")
    ),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  reviews: defineTable({
    productId: v.string(),
    user: v.string(),
    rating: v.number(),
    date: v.string(),
    comment: v.string(),
  }).index("by_product", ["productId"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
});
