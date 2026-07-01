import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
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
      },
      {
        hostname: "hearty-reindeer-11.convex.cloud",
        protocol: "https",
        port: "",
      }
    ],
  },
};

export default nextConfig;