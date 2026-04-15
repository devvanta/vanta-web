"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  Crown,
  MapPin,
  Radio,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { mockEvents } from "@/lib/mock-events";
import { cities } from "@/lib/cities";
import { genres, genreBySlug } from "@/lib/genres";
import { cn } from "@/lib/utils";

const RadarMap = dynamic(
  () => import("@/components/site/radar-map").then((m) => m.RadarMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full rounded-2xl border border-white/10 bg-card flex items-center justify-center">
        <div className="flex items-center gap-2 text-text-muted">
          <Radio size={18} className="text-gold animate-pulse" />
          <span className="text-sm">Carregando mapa...</span>
        </div>
      </div>
    ),
  },
);

export default function RadarPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [city, setCity] = useState<string>("all");
  const [genreSlug, setGenreSlug] = useState<string>("all");
  const [maisVantaOnly, setMaisVantaOnly] = useState(false);

  const withCoords = useMemo(
    () => mockEvents.filter((e) => e.lat !== undefined && e.lng !== undefined),
    [],
  );

  const filtered = useMemo(() => {
    return withCoords.filter((e) => {
      if (city !== "all" && e.city !== city) return false;
      if (genreSlug !== "all" && e.genre !== genreSlug) return false;
      if (maisVantaOnly && !e.maisVanta) return false;
      return true;
    });
  }, [withCoords, city, genreSlug, maisVantaOnly]);

  const availableCities = useMemo(() => {
    const used = new Set(withCoords.map((e) => e.city));
    return cities.filter((c) => used.has(c.name));
  }, [withCoords]);

  const availableGenres = useMemo(() => {
    const used = new Set(withCoords.map((e) => e.genre).filter(Boolean));
    return genres.filter((g) => used.has(g.slug));
  }, [withCoords]);

  const selectedEvent = filtered.find((e) => e.slug === selectedSlug) ?? null;

  const center: [number, number] = useMemo(() => {
    if (filtered.length === 0) return [-22.9105, -43.1768];
    if (city !== "all" && filtered.length > 0) {
      const avg = filtered.reduce(
        (acc, e) => ({
          lat: acc.lat + (e.lat ?? 0),
          lng: acc.lng + (e.lng ?? 0),
        }),
        { lat: 0, lng: 0 },
      );
      return [avg.lat / filtered.length, avg.lng / filtered.length];
    }
    return [-22.9105, -43.1768];
  }, [city, filtered]);

  return (
    <>
      <section className="border-b border-white/5">
        <Container size="lg" className="py-10 md:py-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 text-gold">
              <Radio size={18} />
            </span>
            <span className="kicker">radar</span>
          </div>
          <h1 className="text-4xl md:text-6xl leading-tight mb-4">
            Onde tá rolando, <span className="text-gold">agora</span>.
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Mapa interativo com eventos próximos. Filtre por cidade, gênero ou
            só Mais Vanta. Clique num pin pra ver os detalhes.
          </p>
        </Container>
      </section>

      <Container size="lg" className="py-10">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Painel lateral */}
          <aside className="space-y-6">
            {/* Filtros */}
            <div className="space-y-5">
              <div>
                <label className="ui-label block mb-2">Cidade</label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setSelectedSlug(null);
                    }}
                    className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-gold/30 focus:outline-none cursor-pointer transition-colors duration-200 appearance-none"
                  >
                    <option value="all">Todas as cidades</option>
                    {availableCities.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="ui-label block mb-2">Gênero</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setGenreSlug("all")}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 active:scale-95",
                      genreSlug === "all"
                        ? "bg-gold text-black"
                        : "bg-input border border-white/5 text-text-secondary hover-real:border-white/15",
                    )}
                  >
                    Todos
                  </button>
                  {availableGenres.map((g) => (
                    <button
                      key={g.slug}
                      onClick={() => setGenreSlug(g.slug)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer transition-colors duration-200 active:scale-95",
                        genreSlug === g.slug
                          ? g.badgeClass
                          : "bg-input border border-white/5 text-text-muted hover-real:border-white/15",
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setMaisVantaOnly((v) => !v)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors duration-200 cursor-pointer w-full",
                  maisVantaOnly
                    ? "bg-gold/10 border-gold/40 text-gold"
                    : "bg-input border-white/5 text-text-secondary hover-real:border-white/15",
                )}
              >
                <Crown size={14} strokeWidth={2.5} />
                <span>Apenas Mais Vanta</span>
              </button>
            </div>

            {/* Lista de eventos visíveis */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                <span className="kicker">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "evento" : "eventos"} no mapa
                </span>
              </div>
              <ul className="space-y-2 max-h-[420px] overflow-auto no-scrollbar">
                {filtered.map((e) => {
                  const active = selectedSlug === e.slug;
                  const genre = e.genre ? genreBySlug.get(e.genre) : null;
                  return (
                    <li key={e.slug}>
                      <button
                        onClick={() => setSelectedSlug(e.slug)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-colors duration-200 cursor-pointer",
                          active
                            ? "bg-gold/10 border-gold/40"
                            : "bg-card border-white/5 hover-real:border-white/15",
                        )}
                      >
                        <div
                          className="h-10 w-10 rounded-lg shrink-0"
                          style={{ background: e.gradient }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {e.name}
                          </p>
                          <p className="text-[0.65rem] text-text-muted truncate">
                            {e.venue} · {e.dateLabel}
                          </p>
                          {genre && (
                            <span
                              className={cn(
                                "inline-block mt-1.5 px-2 py-0.5 rounded-full text-[0.55rem] font-semibold uppercase tracking-[0.14em]",
                                genre.badgeClass,
                              )}
                            >
                              {genre.label}
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Mapa */}
          <div className="relative h-[70vh] min-h-[500px]">
            <RadarMap
              events={filtered}
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
              center={center}
            />

            {selectedEvent && (
              <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-auto lg:right-6 lg:max-w-sm">
                <div className="glass-premium rounded-2xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="h-16 w-16 rounded-xl shrink-0"
                      style={{ background: selectedEvent.gradient }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="kicker text-[0.6rem] mb-1">
                        {selectedEvent.dateLabel}
                      </p>
                      <h3 className="text-lg leading-tight mb-1">
                        {selectedEvent.name}
                      </h3>
                      <p className="text-xs text-text-muted truncate">
                        {selectedEvent.venue} · {selectedEvent.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Calendar size={12} className="text-gold" />
                      <span>A partir de</span>
                      <span className="text-gold font-semibold">
                        {selectedEvent.priceLabel}
                      </span>
                    </div>
                    <Link
                      href={`/evento/${selectedEvent.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-gold hover-real:underline"
                    >
                      Ver
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
