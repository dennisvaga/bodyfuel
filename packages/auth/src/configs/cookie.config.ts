export const getCookieConfig = () => ({
  sessionToken: {
    name:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      // Share cookie across all subdomains in production
      domain:
        process.env.NODE_ENV === "production"
          ? ".bodyfuel.dennisvaga.com"
          : undefined,
    },
  },
});
