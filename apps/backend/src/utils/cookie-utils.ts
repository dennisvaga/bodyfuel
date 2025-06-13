import { Response } from "express";

export function addCookie(res: Response, name: string, value: string) {
  // Check environment at function call time, not module load time
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000,
    path: "/",
  });
}
