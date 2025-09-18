import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    users: defineTable({
        clerkId: v.string(),
        fullName: v.optional(v.string()),
        email: v.string(),
        profileImageUrl: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        hasSelectedDistrict: v.boolean(),
    }).index("by_clerk_id", ["clerkId"]),

    organizations: defineTable({
        name: v.string(),
        slug: v.string(),
        clerkId: v.string(),
        ownerId: v.string(),
        profileImageUrl: v.optional(v.string()),
    }).index("by_clerk_id", ["clerkId"])

});