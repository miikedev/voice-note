import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'i.ytimg.com'], // Add your domain here
  },
  eslint: {
    ignoreDuringBuilds: true, // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
