"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  MapPin,
  Music,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { EventCard } from "@/components/site/event-card";
import { useEvents } from "@/lib/supabase/use-events";
import { genres } from "@/lib/genres";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const trending = [
  "Sunset",
  "House",
  "Mais Vanta",
  "Sábado",
  "Grátis",
  "Ipanema",
  "Samba",
  "Techno",
];

type Suggestion =
  | { kind: "event"; label: string; meta: string; href: string }
  | { kind: "venue"; label: string; meta: string; href: string }
  | { kind: "city"; label: string; meta: string; href: string }
  | { kind: "genre"; label: string; meta: string; href: string };

type CityItem = { name: string; slug: string; state?: string };

export default function BuscarPage() {
  const { events: allEvents } = useEvents();
  const [q, setQ] = useState("");
  const [cities, setCities] = useState<CityItem[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("eventos_admin")
      .select("cidade")
      .eq("publicado", true)
      .gte("data_inicio", new Date().toISOString())
      .then(({ data }) => {
        if (!data) return;
        const unique = [...new Set(data.map((r) => r.cidade).filter(Boolean))] as string[];
        setCities(
          unique.sort().map((c) => ({
            name: c,
            slug: c.toLowerCase().replace(/\s+/g, "-"),
          }))
        );
      });
  }, []);

  const filteredEvents = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.trim().toLowerCase();
    return allEvents.filter((e) => {
      const hay =
        `${e.name} ${e.venue} ${e.city} ${e.genre ?? ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [q, allEvents]);

  const suggestions: Suggestion[] = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.trim().toLowerCase();
    const out: Suggestion[] = [];

    // Casas
    const venues = new Set<string>();
    allEvents.forEach((e) => {
      if (e.venue.toLowerCase().includes(needle)) venues.add(e.venue);
    });
    venues.forEach((v) => {
      const ev = allEvents.find((e) => e.venue === v);
      out.push({
        kind: "venue",
        label: v,
        meta: ev ? `Casa · ${ev.city}` : "Casa",
        href: `/buscar?q=${encodeURIComponent(v)}`,
      });
    });

    // Cidades
    cities.forEach((c) => {
      if (c.name.toLowerCase().includes(needle)) {
        out.push({
          kind: "city",
          label: c.name,
          meta: "Cidade",
          href: `/eventos?cidade=${encodeURIComponent(c.name)}`,
        });
      }
    });

    // Gêneros
    genres.forEach((g) => {
      if (g.label.toLowerCase().includes(needle)) {
        out.push({
          kind: "genre",
          label: g.label,
          meta: "Gênero musical",
          href: `/eventos?genero=${g.slug}`,
        });
      }
    });

    return out.slice(0, 6);
  }, [q, allEvents, cities]);

  return (
    <Container size="lg" className="py-12 md:py-16">
      <header className="mb-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 text-gold">
            <Search size={18} />
          </span>
          <span className="kicker">buscar</span>
        </div>
        <h1 className="text-4xl md:text-6xl leading-tight mb-4">
          Encontre <span className="text-gold">o rolê certo</span>.
        </h1>
        <p className="text-text-secondary text-lg">
          Busque por evento, casa, gênero ou cidade. Filtros mais detalhados na
          página de eventos.
        </p>
      </header>

      {/* Input gigante */}
      <div className="relative mb-8">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tente 'samba', 'ipanema', 'mais vanta'..."
          className="w-full bg-card border border-white/10 rounded-2xl pl-14 pr-14 py-5 text-lg focus:border-gold/40 focus:outline-none transition-colors duration-200"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-elevated border border-white/10 flex items-center justify-center text-text-muted hover-real:text-text-primary cursor-pointer transition-colors duration-200"
            aria-label="Limpar"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Chips populares */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-gold" />
          <span className="kicker">sugestões</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map((t) => (
            <button
              key={t}
              onClick={() => setQ(t)}
              className="px-4 py-2 rounded-full text-sm bg-card border border-white/5 text-text-secondary hover-real:border-gold/40 hover-real:text-gold cursor-pointer transition-colors duration-200"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Vazio: mostrar atalhos */}
      {!q.trim() && (
        <div className="grid md:grid-cols-3 gap-5">
          <ShortcutCard
            icon={Calendar}
            title="Esta semana"
            body="Eventos de sexta até domingo na sua cidade."
            href="/eventos"
          />
          <ShortcutCard
            icon={Sparkles}
            title="Só Mais Vanta"
            body="Rolês com benefícios automáticos pra membros."
            href="/eventos"
          />
          <ShortcutCard
            icon={MapPin}
            title="Perto de você"
            body="Abra o Radar e veja o que tá acontecendo no mapa."
            href="/radar"
          />
        </div>
      )}

      {/* Resultados */}
      {q.trim() && (
        <div className="space-y-10">
          {suggestions.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-gold" />
                <span className="kicker">sugestões</span>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3">
                {suggestions.map((s) => {
                  const Icon = suggestionIcon(s.kind);
                  return (
                    <li key={`${s.kind}-${s.label}`}>
                      <Link
                        href={s.href}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200"
                      >
                        <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {s.label}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {s.meta}
                          </p>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-text-muted shrink-0"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="kicker">eventos</span>
                <p className="text-sm text-text-secondary mt-1">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1
                    ? "evento encontrado"
                    : "eventos encontrados"}
                </p>
              </div>
              {filteredEvents.length > 0 && (
                <Link
                  href="/eventos"
                  className="text-xs text-gold hover-real:underline flex items-center gap-1"
                >
                  Filtros avançados
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>

            {filteredEvents.length === 0 && suggestions.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gold/10 border border-gold/20 mb-5 text-gold">
                  <Search size={20} />
                </div>
                <h3 className="text-2xl mb-3 leading-tight">
                  Nada por &quot;{q}&quot;.
                </h3>
                <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
                  Tenta um termo mais geral, uma cidade ou um gênero.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvents.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </Container>
  );
}

function suggestionIcon(kind: Suggestion["kind"]) {
  switch (kind) {
    case "venue":
      return Building2;
    case "city":
      return MapPin;
    case "genre":
      return Music;
    default:
      return Users;
  }
}

function ShortcutCard({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: typeof Calendar;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group p-6 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200"
    >
      <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4">
        <Icon size={18} />
      </div>
      <h3 className="text-lg mb-2 leading-tight">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed mb-4">{body}</p>
      <span className="inline-flex items-center gap-1 text-xs text-gold">
        Explorar
        <ArrowRight size={12} />
      </span>
    </Link>
  );
}
