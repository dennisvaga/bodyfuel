import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  try {
    // Get token that contains user role.
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
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

export const config = {
  matcher: [
    // Exclude NextAuth API routes, static files, and auth pages
    "/((?!api/auth|_next/static|_next/image|favicon.ico|signin|login|signout).*)",
  ],
};
