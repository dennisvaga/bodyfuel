import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

export function addCookie(res: Response, name: string, value: string) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 1 week (in milliseconds)
  });
}
