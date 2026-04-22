import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daldttuibmxwkpbqtebm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    // Fix #177 M4 (2026-04-21): security headers globais.
    // HSTS força HTTPS por 2 anos + inclui subdomains (app, hq). preload permite
    // submissão à lista do Chrome (https://hstspreload.org) quando CNPJ sair.
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin/:path*",
        destination: "https://app.maisvanta.com/admin/:path*",
        permanent: false,
      },
      // Mobile detecta → app.maisvanta.com
      // Header matching no Vercel Edge: rapido, sem middleware (build do
      // Next 16 com middleware + turbopack quebra com ENOENT
      // middleware.js.nft.json — verificado em 2026-04-20).
      // Cobre só "/" pra MVP — se precisar mais paths depois, adicionar.
      // Skip: cookie vanta_stay_on_site=1 desliga (escape hatch debug).
      {
        source: "/:path*",
        has: [
          { type: "header", key: "user-agent", value: ".*(Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini).*" },
        ],
        missing: [
          { type: "cookie", key: "vanta_stay_on_site" },
        ],
        destination: "https://app.maisvanta.com/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
