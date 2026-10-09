import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build enxuto para rodar em Docker na VPS (node server.js).
  output: "standalone",
  poweredByHeader: false,
  turbopack: {
    // o repositório tem outro package-lock (banco/); a raiz do app é esta pasta
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
