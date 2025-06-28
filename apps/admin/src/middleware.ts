import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  try {
    // Get token that contains user role.
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    if (!token) {
      // Redirect to signin page without error for better UX
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(`/signin?error=access_denied`, req.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
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
