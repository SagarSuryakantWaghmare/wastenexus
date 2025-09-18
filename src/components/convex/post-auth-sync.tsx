"use client";

import { useEffect } from "react";
import { useConvex } from "convex/react";
import { useUser, useOrganization, useAuth } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";

// This component runs once after the user is authenticated
// to ensure their Clerk user/org are present in Convex tables.
export default function PostAuthSync() {
  const convex = useConvex();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  useEffect(() => {
    const run = async () => {
      if (!isSignedIn || !user) return;

      // Ensure user exists
      await convex.mutation(api.users.ensureUser, {
        clerkId: user.id,
        email:
          user.primaryEmailAddress?.emailAddress ??
          (user.emailAddresses && user.emailAddresses[0]?.emailAddress) ??
          "",
        fullName: user.fullName ?? undefined,
        profileImageUrl: user.imageUrl ?? undefined,
        organizationId: organization?.id ?? undefined,
      });

      // If an organization is selected in Clerk, ensure it exists
      if (organization) {
        await convex.mutation(api.organizations.ensureOrganization, {
          clerkId: organization.id,
          name: organization.name ?? "Organization",
          slug: organization.slug ?? organization.id,
          ownerId: user.id,
          profileImageUrl: organization.imageUrl ?? undefined,
        });
      }
    };

    run().catch((err) => {
      console.error("PostAuthSync error:", err);
    });
  }, [convex, isSignedIn, user, organization]);

  return null;
}
