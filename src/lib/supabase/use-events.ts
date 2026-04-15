"use client";

import { useEffect, useState } from "react";
import { createClient } from "./client";
import type { EventCardData, EventStatus } from "@/components/site/event-card";

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
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${dias[date.getDay()]} · ${date.getDate()} ${meses[date.getMonth()]} · ${date.getHours()}h`;
}

function formatPrice(centavos: number | null): string {
  if (!centavos || centavos === 0) return "Grátis";
  return `R$ ${(centavos / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toEventCard(row: any): EventCardData {
  const coords = row.coords as { lat: number; lng: number } | null;
  let lowestPrice: number | null = null;
  let totalRemaining = 0;
  let totalCapacity = 0;

  if (row.variacoes_ingresso) {
    for (const v of row.variacoes_ingresso) {
      for (const l of v.lotes || []) {
        if (l.ativo) {
          if (lowestPrice === null || l.preco < lowestPrice) lowestPrice = l.preco;
          totalCapacity += l.quantidade_total;
          totalRemaining += l.quantidade_total - l.quantidade_vendida;
        }
      }
    }
  }

  let status: EventStatus | undefined;
  const now = new Date();
  const start = new Date(row.data_inicio);
  const end = row.data_fim ? new Date(row.data_fim) : null;
  if (start <= now && (!end || end >= now)) {
    status = "happening";
  } else if (totalCapacity > 0 && totalRemaining / totalCapacity < 0.1) {
    status = "lowStock";
  } else {
    const hoursUntil = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntil > 0 && hoursUntil < 24) status = "endingSoon";
  }

  return {
    slug: row.slug || row.id,
    name: row.nome,
    venue: row.local,
    city: row.cidade || "",
    dateLabel: formatDateLabel(row.data_inicio),
    priceLabel: formatPrice(lowestPrice),
    status,
    maisVanta: false,
    gradient: row.foto ? `url(${row.foto}) center/cover` : pickGradient(row.id),
    genre: row.estilos?.[0] || undefined,
    priceCents: lowestPrice ?? undefined,
    dateISO: row.data_inicio,
    lat: coords?.lat,
    lng: coords?.lng,
    description: row.descricao,
    address: row.endereco || undefined,
  };
}

export function useEvents() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("eventos_admin")
      .select(`
        id, slug, nome, local, cidade, data_inicio, data_fim,
        descricao, endereco, foto, estilos, coords, publicado,
        status_evento, categoria, classificacao_etaria, comunidade_id,
        variacoes_ingresso (
          id, nome,
          lotes ( preco, nome, quantidade_total, quantidade_vendida, ativo )
        )
      `)
      .eq("publicado", true)
      .gte("data_inicio", new Date().toISOString())
      .order("data_inicio", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setEvents(data.map(toEventCard));
        }
        setLoading(false);
      });
  }, []);

  return { events, loading };
}
