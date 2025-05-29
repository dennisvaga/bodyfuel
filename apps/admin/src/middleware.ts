import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Log all requests hitting middleware
  console.log("🔍 Middleware intercepted:", pathname);
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("🔑 AUTH_SECRET exists:", !!process.env.AUTH_SECRET);

  try {
    // Get token that contains user role.
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    console.log("🎫 Token found:", !!token);
    if (token) {
      console.log("👤 User role:", token.role);
      console.log("📧 User email:", token.email);
    }

    if (!token) {
      console.log("❌ No token - redirecting to signin");
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (token.role !== "ADMIN") {
      console.log("🚫 User is not ADMIN - access denied");
      return NextResponse.redirect(
        new URL(`/signin?error=access_denied`, req.url)
      );
    }

    console.log("✅ Admin access granted");
    return NextResponse.next();
  } catch (error) {
    console.error("💥 Middleware error:", error);

    // Type-safe error logging
    if (error instanceof Error) {
      console.error("🔍 Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    } else {
      console.error("🔍 Unknown error:", error);
    }

    return NextResponse.redirect(
      new URL(`/signin?error=server_error`, req.url)
    );
  }
}

// Fix matcher pattern to properly exclude auth pages
export const config = {
  matcher: [
    // Use individual path matchers instead of a complex regex
    "/((?!api|_next|.*\\..*|signin|login|signout).*)",
  ],
};
