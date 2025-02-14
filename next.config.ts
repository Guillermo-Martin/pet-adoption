import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Configuration for external images: https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns
        hostname: "**.cloudfront.net"
      }
    ]
  }
};

export default nextConfig;
