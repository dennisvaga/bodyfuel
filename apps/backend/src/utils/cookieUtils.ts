import { Response } from "express";

export function addCookie(res: Response, name: string, value: string) {
  // Check environment at function call time, not module load time
  const isProduction = process.env.NODE_ENV === "production";

  // Add more detailed logging
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("isProduction value:", process.env.NODE_ENV === "production");

  console.log(
    `Setting cookie ${name} with SameSite=${isProduction ? "none" : "lax"}`
  );

  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000,
    path: "/",
  });
}
