import { DefaultSession } from "next-auth";
import { User as PrismaUser } from "@prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: PrismaUser["role"];
    } & DefaultSession["user"];
  }

  interface User {
    role: PrismaUser["role"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: PrismaUser["role"];
  }
}
