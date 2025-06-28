import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bodyfuel-store.s3.eu-north-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },
  // Enable source maps for better debugging
  productionBrowserSourceMaps: true,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
