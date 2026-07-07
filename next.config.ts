import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static generation for API routes that require database
  experimental: {
    dynamicIO: true,
  },
};

export default nextConfig;
