import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow native modules in API routes (better-sqlite3)
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
