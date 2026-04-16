import { createClient } from "./server";
import type { EventCardData } from "@/components/site/event-card";

const gradients = [
  "radial-gradient(circle at 30% 20%, rgba(255,211,0,0.32), transparent 55%), linear-gradient(140deg, #2a1d0a, #080604)",
  "radial-gradient(circle at 70% 30%, rgba(255,211,0,0.22), transparent 60%), linear-gradient(200deg, #201510, #080604)",
  "radial-gradient(circle at 50% 80%, rgba(255,211,0,0.16), transparent 55%), linear-gradient(160deg, #1a1208, #080604)",
  "radial-gradient(circle at 20% 70%, rgba(255,211,0,0.14), transparent 60%), linear-gradient(220deg, #1f1810, #080604)",
  "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.18), transparent 60%), linear-gradient(140deg, #18121a, #080604)",
  "radial-gradient(circle at 70% 60%, rgba(56,189,248,0.14), transparent 55%), linear-gradient(180deg, #0e1418, #080604)",
  "radial-gradient(circle at 30% 70%, rgba(248,113,113,0.18), transparent 60%), linear-gradient(160deg, #1a0f0a, #080604)",
];

function pickGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const parts = date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const hora = date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
  });
  return `${parts} · ${hora}`;
}

function formatPrice(reais: number | null): string {
  if (!reais || reais === 0) return "Grátis";
  return `R$ ${Math.round(reais).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

type EventoRow = {
  id: string;
  slug: string | null;
  nome: string;
  local: string;
  cidade: string | null;
  data_inicio: string;
  data_fim: string | null;
  descricao: string;
  endereco: string | null;
  foto: string | null;
  estilos: string[] | null;
  coords: { lat: number; lng: number } | null;
  publicado: boolean;
  status_evento: string | null;
  categoria: string | null;
  classificacao_etaria: string;
  comunidade_id: string | null;
  mais_vanta_config_evento: { id: string; ativo: boolean }[];
  lotes: {
    id: string;
    nome: string;
    ativo: boolean;
    variacoes_ingresso: {
      id: string;
      valor: number;
      limite: number;
      vendidos: number;
    }[];
  }[];
};

function getLowestPrice(
  lotes: EventoRow["lotes"]
): number | null {
  if (!lotes || lotes.length === 0) return null;
  let lowest: number | null = null;
  for (const l of lotes) {
    if (!l.ativo) continue;
    for (const v of l.variacoes_ingresso || []) {
      if (lowest === null || v.valor < lowest) {
        lowest = v.valor;
      }
    }
  }
  return lowest;
}

function getEventStatus(
  row: Pick<EventoRow, "data_inicio" | "data_fim" | "lotes">
): EventCardData["status"] {
  const now = new Date();
  const start = new Date(row.data_inicio);
  const end = row.data_fim ? new Date(row.data_fim) : null;

  if (start <= now && (!end || end >= now)) return "happening";

  // Check low stock
  if (row.lotes) {
    let totalRemaining = 0;
    let totalCapacity = 0;
    for (const l of row.lotes) {
      if (!l.ativo) continue;
      for (const v of l.variacoes_ingresso || []) {
        totalCapacity += v.limite;
        totalRemaining += v.limite - v.vendidos;
      }
    }
    if (totalCapacity > 0 && totalRemaining / totalCapacity < 0.1) {
      return "lowStock";
    }
  }

  // Check ending soon (starts within 24h)
  const hoursUntil =
    (start.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntil > 0 && hoursUntil < 24) return "endingSoon";

  return undefined;
}

function toEventCard(row: EventoRow): EventCardData {
  const lowestPrice = getLowestPrice(row.lotes);
  const coords = row.coords as { lat: number; lng: number } | null;

  return {
    slug: row.slug || row.id,
    name: row.nome,
    venue: row.local,
    city: row.cidade || "",
    dateLabel: formatDateLabel(row.data_inicio),
    priceLabel: formatPrice(lowestPrice),
    status: getEventStatus(row),
    maisVanta: (row.mais_vanta_config_evento || []).some((mv) => mv.ativo),
    gradient: row.foto
      ? `url(${row.foto}) center/cover`
      : pickGradient(row.id),
    genre: row.estilos?.[0] || undefined,
    priceCents: lowestPrice ?? undefined,
    dateISO: row.data_inicio,
    lat: coords?.lat,
    lng: coords?.lng,
    description: row.descricao,
    address: row.endereco || undefined,
  };
}

export async function getPublicEvents(options?: {
  limit?: number;
  city?: string;
}): Promise<EventCardData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("eventos_admin")
    .select(
      `
      id, slug, nome, local, cidade, data_inicio, data_fim,
      descricao, endereco, foto, estilos, coords, publicado,
      status_evento, categoria, classificacao_etaria, comunidade_id,
      mais_vanta_config_evento ( id, ativo ),
      lotes (
        id, nome, ativo,
        variacoes_ingresso ( id, valor, limite, vendidos )
      )
    `
    )
    .eq("publicado", true)
    .eq("status_evento", "ATIVO")
    .gte("data_fim", new Date().toISOString())
    .order("data_inicio", { ascending: true });

  if (options?.city) {
    query = query.eq("cidade", options.city);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Failed to fetch events:", error);
    return [];
  }

  return (data as unknown as EventoRow[]).map(toEventCard);
}

export async function getEventBySlug(
  slug: string
): Promise<EventCardData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("eventos_admin")
    .select(
      `
      id, slug, nome, local, cidade, data_inicio, data_fim,
      descricao, endereco, foto, estilos, coords, publicado,
      status_evento, categoria, classificacao_etaria, comunidade_id,
      mais_vanta_config_evento ( id, ativo ),
      lotes (
        id, nome, ativo,
        variacoes_ingresso ( id, valor, limite, vendidos )
      )
    `
    )
    .eq("publicado", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  return toEventCard(data as unknown as EventoRow);
}

export type LoteWithVariacoes = {
  id: string;
  nome: string;
  ativo: boolean;
  ordem: number;
  variacoes: {
    id: string;
    area: string;
    area_custom: string | null;
    genero: string;
    valor: number;
    limite: number;
    vendidos: number;
    requer_comprovante: boolean;
  }[];
};

export async function getEventLotes(
  eventoId: string
): Promise<LoteWithVariacoes[]> {
  const supabase = await createClient();

  const { data: lotes } = await supabase
    .from("lotes")
    .select("id, nome, ativo, ordem")
    .eq("evento_id", eventoId)
    .order("ordem", { ascending: true });

  if (!lotes || lotes.length === 0) return [];

  const loteIds = lotes.map((l) => l.id);

  const { data: variacoes } = await supabase
    .from("variacoes_ingresso")
    .select(
      "id, lote_id, area, area_custom, genero, valor, limite, vendidos, requer_comprovante"
    )
    .in("lote_id", loteIds);

  return lotes.map((l) => ({
    id: l.id,
    nome: l.nome,
    ativo: l.ativo,
    ordem: l.ordem,
    variacoes: (variacoes || [])
      .filter((v) => v.lote_id === l.id)
      .map((v) => ({
        id: v.id,
        area: v.area,
        area_custom: v.area_custom,
        genero: v.genero,
        valor: Number(v.valor ?? 0),
        limite: Number(v.limite ?? 100),
        vendidos: Number(v.vendidos ?? 0),
        requer_comprovante: v.requer_comprovante,
      })),
  }));
}

export async function getEventIdBySlug(slug: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos_admin")
    .select("id")
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();
  return data?.id ?? null;
}

export async function getCities(): Promise<
  { name: string; slug: string }[]
> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("eventos_admin")
    .select("cidade")
    .eq("publicado", true)
    .eq("status_evento", "ATIVO")
    .gte("data_fim", new Date().toISOString());

  if (!data) return [];

  const unique = [...new Set(data.map((r) => r.cidade).filter(Boolean))] as string[];
  return unique.sort().map((c) => ({
    name: c,
    slug: c.toLowerCase().replace(/\s+/g, "-"),
  }));
}
