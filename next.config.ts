import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Change as needed: "5mb", "20mb", etc.
    },
  },
  // ...other config options
};

export default nextConfig;
