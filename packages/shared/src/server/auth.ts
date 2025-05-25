import NextAuth, { NextAuthResult } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrisma } from "@repo/database";

import authConfig from "#auth/configs/auth.config";

/**
 * Files with server-side functionallity should be exported separately
 */
const prisma = await getPrisma();

const result = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      } // Store role inside token
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role; // Assign role from token to session
      return session;
    },
  },
});

// Exported this way to fix bug
export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
