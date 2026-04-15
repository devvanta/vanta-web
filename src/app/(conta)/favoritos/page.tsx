"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { EventCard, type EventCardData } from "@/components/site/event-card";
import { createClient } from "@/lib/supabase/client";

export default function FavoritosPage() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch favorited event IDs
      const { data: favs } = await supabase
        .from("evento_favoritos")
        .select("evento_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!favs || favs.length === 0) {
        setLoading(false);
        return;
      }

      const ids = favs.map((f) => f.evento_id);

      // Fetch event details
      const { data: eventData } = await supabase
        .from("eventos_admin")
        .select(
          `id, slug, nome, local, cidade, data_inicio, foto, estilos,
          mais_vanta_config_evento ( id, ativo ),
          lotes ( id, nome, ativo, variacoes_ingresso ( id, valor, limite, vendidos ) )`
        )
        .in("id", ids);

      if (eventData) {
        setEvents(
          eventData.map((row) => {
            let lowestPrice: number | null = null;
            const lotes = (row.lotes || []) as {
              ativo: boolean;
              variacoes_ingresso: { valor: number }[];
            }[];
            for (const l of lotes) {
              if (!l.ativo) continue;
              for (const v of l.variacoes_ingresso || []) {
                if (lowestPrice === null || v.valor < lowestPrice)
                  lowestPrice = v.valor;
              }
            }
            const priceLabel =
              lowestPrice === null || lowestPrice === 0
                ? "Grátis"
                : `R$ ${Math.round(lowestPrice)}`;
            const date = new Date(row.data_inicio);
            const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
            const meses = [
              "jan", "fev", "mar", "abr", "mai", "jun",
              "jul", "ago", "set", "out", "nov", "dez",
            ];
            return {
              slug: row.slug || row.id,
              name: row.nome,
              venue: row.local,
              city: row.cidade || "",
              dateLabel: `${dias[date.getDay()]} · ${date.getDate()} ${meses[date.getMonth()]} · ${date.getHours()}h`,
              priceLabel,
              maisVanta: (
                (row.mais_vanta_config_evento || []) as { ativo: boolean }[]
              ).some((mv) => mv.ativo),
              gradient: row.foto
                ? `url(${row.foto}) center/cover`
                : "radial-gradient(circle at 30% 20%, rgba(255,211,0,0.32), transparent 55%), linear-gradient(140deg, #2a1d0a, #080604)",
              genre: (row.estilos as string[] | null)?.[0],
              dateISO: row.data_inicio,
            };
          })
        );
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/perfil"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover-real:text-text-primary transition-colors duration-200 mb-4"
        >
          <ArrowLeft size={12} />
          Voltar pro perfil
        </Link>
        <span className="kicker mb-3 inline-block">salvos</span>
        <h1 className="text-3xl md:text-4xl leading-tight mb-3">
          Eventos <span className="text-gold">favoritos</span>.
        </h1>
        <p className="text-text-secondary">
          Os rolês que você salvou pra ver depois.
        </p>
      </header>

      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">
          Carregando...
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
          <Heart size={24} className="text-gold mx-auto mb-4" />
          <h3 className="text-lg mb-2">Nenhum favorito</h3>
          <p className="text-text-muted text-sm mb-4">
            Salve eventos que te interessam pra acompanhar aqui.
          </p>
          <Link
            href="/eventos"
            className="text-sm text-gold hover-real:underline"
          >
            Ver eventos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {events.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
