import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build enxuto para rodar em Docker na VPS (node server.js).
  output: "standalone",
  poweredByHeader: false,
  // dev: não tirar a barra de /explorar/ (os caminhos do site estático são relativos)
  skipTrailingSlashRedirect: Boolean(process.env.BIO_EXPLORAR_DEV),
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
  // Em desenvolvimento, /explorar/* vem de um servidor estático da raiz do repo
  // (BIO_EXPLORAR_DEV=http://127.0.0.1:8799), igual à produção, onde o Caddy serve /explorar.
  async rewrites() {
    const dev = process.env.BIO_EXPLORAR_DEV;
    return dev ? [{ source: "/explorar/:caminho*", destination: `${dev}/:caminho*` }] : [];
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
