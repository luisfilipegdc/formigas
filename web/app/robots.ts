import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/conta", "/entrar", "/criar-conta"] }],
    sitemap: "https://estudodebolso.com.br/sitemap.xml",
  };
}
