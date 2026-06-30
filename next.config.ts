import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "i.pinimg.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "superb-cuttlefish-666.convex.cloud",
        protocol: 'https',
        port: "",
      }
    ],
  },
};

export default nextConfig;