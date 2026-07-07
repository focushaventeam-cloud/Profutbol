import type { NextConfig } from "next";

const isBuild = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isBuild ? {
    output: "export" as const,
    basePath: "/Profutbol",
  } : {}),
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  allowedDevOrigins: ["*"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;