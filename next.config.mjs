import path from "path";
import envPkg from "@next/env";
const { loadEnvConfig } = envPkg;

const projectDir = process.cwd();
// Automatically load root .env from parent directory if available
if (typeof loadEnvConfig === "function") {
  loadEnvConfig(path.resolve(projectDir, ".."));
  loadEnvConfig(projectDir);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // reactCompiler: true, // Disabled due to known Next.js Turbopack Windows WebpackLoaders bug
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ]
  },
  async rewrites() {
    const backendUrl = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");
    return [
      {
        source: "/api/ai/:path*",
        destination: `${backendUrl}/api/ai/:path*`,
      },
      {
        source: "/api/send-email",
        destination: `${backendUrl}/api/send-email`,
      },
    ];
  }
};

export default nextConfig;
