import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Ensures a Clerk user exists in the Convex `users` table.
// If a record with the same `clerkId` already exists, returns its _id.
export const ensureUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        fullName: v.optional(v.string()),
        profileImageUrl: v.optional(v.string()),
        organizationId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existing) {
            // Patch fields if they've changed (e.g., organization switch, profile updates)
            const updates: Record<string, unknown> = {};
            if (existing.email !== args.email) updates.email = args.email;
            if ((existing.fullName ?? undefined) !== (args.fullName ?? undefined)) updates.fullName = args.fullName;
            if ((existing.profileImageUrl ?? undefined) !== (args.profileImageUrl ?? undefined)) updates.profileImageUrl = args.profileImageUrl;
            if ((existing.organizationId ?? undefined) !== (args.organizationId ?? undefined)) updates.organizationId = args.organizationId;

            if (Object.keys(updates).length > 0) {
                await ctx.db.patch(existing._id, updates);
            }
            return existing._id;
        }

        const userId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            fullName: args.fullName,
            profileImageUrl: args.profileImageUrl,
            organizationId: args.organizationId,
            hasSelectedDistrict: false,
        });

        return userId;
    },
});
