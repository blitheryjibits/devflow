import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
