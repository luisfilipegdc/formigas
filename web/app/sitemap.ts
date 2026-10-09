import type { MetadataRoute } from "next";

const BASE = "https://estudodebolso.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/explorar/", "/planos", "/privacidade", "/termos"].map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly" }));
}
