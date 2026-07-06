import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Profutbol",
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  allowedDevOrigins: ["*"],
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;