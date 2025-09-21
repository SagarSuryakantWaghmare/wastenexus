"use client";

import { ConvexReactClient, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignIn } from "@clerk/nextjs";
import FullscreenLoader from "../utility/fullscreen-loader";
import PostAuthSync from "./post-auth-sync";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <ConvexProviderWithClerk
                client={convex}
                useAuth={useAuth}
            >
                <Authenticated>
                    <PostAuthSync />
                    {children}
                </Authenticated>

                <Unauthenticated>
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <SignIn routing="hash" />
                    </div>
                </Unauthenticated>

                <AuthLoading>
                    <FullscreenLoader label="Auth Loading..." />
                </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}