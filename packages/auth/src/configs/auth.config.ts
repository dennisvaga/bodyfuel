// This configuration must be edge-compatible
// * We cannot use prisma here, even with prisma pg adapter. but we can send fetch requests from here.

import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";

import Credentials from "next-auth/providers/credentials";

import { authService } from "#services/authService";
import Google from "next-auth/providers/google";

const providers: Provider[] = [
  // 1) Google OAuth provider
  Google({
    clientId: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
  }),

  // 2) Credentials Provider (email + password)
  // Sign In
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials): Promise<any | null> {
      const email = credentials?.email?.toString();
      const password = credentials?.password?.toString();

      if (!email || !password) {
        throw new Error("Missing email or password.");
      }

      try {
        // Send credentials to API route
        const response = await authService.signIn({ email, password });

        // Check if authentication was successful
        if (!response || !response.success) {
          return null;
        }

        // Return the user data
        return response.data;
      } catch (error) {
        console.error("Auth error:", error);
        return null;
      }
    },
  }),
];

export default {
  providers,
  // The rest of your NextAuth config can also go here,
  // if you want separate callbacks, session settings, etc.
} satisfies NextAuthConfig;

export const providerMap = [{ id: "google", name: "Google" }];
