import NextAuth, { NextAuthResult } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrisma } from "@repo/database";
import { getCookieConfig } from "#configs/cookie.config";
import authConfig from "#configs/auth.config";

/**
 * Files with server-side functionality should be exported separately
 *
 * This file is designed to work in both backend and frontend contexts:
 * - In backend: Uses PrismaAdapter with direct database access
 * - In frontend: Uses JWT strategy without database access
 */
const isBackend = !!process.env.DATABASE_URL;

const result = NextAuth({
  adapter: isBackend ? PrismaAdapter(await getPrisma()) : undefined,
  session: { strategy: "jwt" },
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: getCookieConfig(),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
});

// Log the current environment for debugging
if (process.env.NODE_ENV !== "production") {
  console.log(
    `NextAuth initialized in ${isBackend ? "backend" : "frontend"} mode`
  );
}

// Export NextAuth handlers and utilities
export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
