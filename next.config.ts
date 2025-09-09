import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // Add your domain here
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
