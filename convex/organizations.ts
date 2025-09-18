import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Ensures a Clerk organization exists in the Convex `organizations` table.
// If a record with the same `clerkId` already exists, returns its _id.
export const ensureOrganization = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    slug: v.string(),
    ownerId: v.string(),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      const updates: Record<string, unknown> = {};
      if (existing.name !== args.name) updates.name = args.name;
      if (existing.slug !== args.slug) updates.slug = args.slug;
      if (existing.ownerId !== args.ownerId) updates.ownerId = args.ownerId;
      if ((existing.profileImageUrl ?? undefined) !== (args.profileImageUrl ?? undefined)) updates.profileImageUrl = args.profileImageUrl;

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existing._id, updates);
      }
      return existing._id;
    }

    const organizationId = await ctx.db.insert("organizations", {
      clerkId: args.clerkId,
      name: args.name,
      slug: args.slug,
      ownerId: args.ownerId,
      profileImageUrl: args.profileImageUrl,
    });

    return organizationId;
  },
});
