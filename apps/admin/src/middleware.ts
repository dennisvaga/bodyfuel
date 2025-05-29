import { NextRequest, NextResponse } from "next/server";
// Import from @repo/auth instead of next-auth/jwt
import { auth } from "@repo/auth/server";

export default async function middleware(req: NextRequest) {
  try {
    // Use the Auth.js v5 method with the request
    const session = await auth({ req });

    // Debug logs
    console.log("🔍 Session found:", !!session);
    if (session?.user) {
      console.log("👤 User:", session.user);
    }

    if (!session?.user) {
      console.log("❌ No session - redirecting to signin");
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (session.user.role !== "ADMIN") {
      console.log("🚫 User is not ADMIN - access denied");
      return NextResponse.redirect(
        new URL(`/signin?error=access_denied`, req.url)
      );
    }

    console.log("✅ Admin access granted");
    return NextResponse.next();
  } catch (error) {
    console.error("💥 Middleware error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return NextResponse.redirect(
      new URL(`/signin?error=server_error`, req.url)
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*|signin|login|signout).*)"],
};
