/**
 * Shared Express Auth.js Configuration
 *
 * This file provides a centralized authentication configuration for Auth.js Express
 * to eliminate code duplication across multiple middleware files in the backend.
 *
 * The configuration includes:
 * - JWT strategy with role-based authentication
 * - Session management with secure cookie settings
 * - Token and session callbacks for role propagation
 * - Environment-specific security settings
 *
 * Used by: admin-auth.ts and user-auth.ts middleware
 */
import type { ExpressAuthConfig } from "@auth/express";

export function getExpressAuthConfig(): ExpressAuthConfig {
  return {
    adapter: {},
    providers: [],
    trustHost: true,
    useSecureCookies: process.env.NODE_ENV === "production",
    secret: process.env.AUTH_SECRET,
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
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
  };
}
