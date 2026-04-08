import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("images")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 12;
    return await ctx.db
      .query("images")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

export const save = mutation({
  args: { prompt: v.string(), imageBase64: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("images", {
      userId,
      prompt: args.prompt,
      imageBase64: args.imageBase64,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("images") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const image = await ctx.db.get(args.id);
    if (!image || image.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
