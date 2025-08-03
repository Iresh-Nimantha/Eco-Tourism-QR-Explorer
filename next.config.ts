import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "dynamic-media-cdn.tripadvisor.com",
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
=======
  /* config options here */
>>>>>>> 31186843fa8a9845df05159cbb06f7eae7df9cff
};

export default nextConfig;
