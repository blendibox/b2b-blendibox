import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    turbo: undefined  // desativa Turbopack
  }
};

export default nextConfig;
