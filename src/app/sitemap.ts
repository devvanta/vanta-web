import type { MetadataRoute } from "next";
import { getPublicEvents } from "@/lib/supabase/queries";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maisvanta.com";

const staticRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/eventos", priority: 0.9, changeFrequency: "daily" },
  { path: "/radar", priority: 0.85, changeFrequency: "daily" },
  { path: "/buscar", priority: 0.7, changeFrequency: "weekly" },
  { path: "/mais-vanta", priority: 0.9, changeFrequency: "weekly" },
  { path: "/parceiro", priority: 0.85, changeFrequency: "weekly" },
  { path: "/sobre", priority: 0.6, changeFrequency: "monthly" },
  { path: "/entrar", priority: 0.4, changeFrequency: "yearly" },
  { path: "/criar-conta", priority: 0.5, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Eventos publicados (best-effort: se o backend falhar por qualquer motivo
  // só retornamos as rotas estáticas — o sitemap nunca pode quebrar).
  let eventEntries: MetadataRoute.Sitemap = [];
  try {
    const events = await getPublicEvents({ limit: 500 });
    eventEntries = events.map((e) => ({
      url: `${SITE}/evento/${e.slug}`,
      lastModified: e.dateISO ? new Date(e.dateISO) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // silencioso: sitemap robusto
  }

  return [...staticEntries, ...eventEntries];
}
