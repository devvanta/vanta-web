"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Crosshair,
  Crown,
  Loader2,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Radio,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useEvents } from "@/lib/supabase/use-events";
import { genres, genreBySlug } from "@/lib/genres";
import { cn } from "@/lib/utils";
import type { EventCardData } from "@/components/site/event-card";

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
  }
);

function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export default function RadarPage() {
  const { events: allEvents, loading } = useEvents();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [city, setCity] = useState<string>("all");
  const [genreSlug, setGenreSlug] = useState<string>("all");
  const [maisVantaOnly, setMaisVantaOnly] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [zoomAction, setZoomAction] = useState<"in" | "out" | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // Geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const withCoords = useMemo(
    () => allEvents.filter((e) => e.lat != null && e.lng != null),
    [allEvents]
  );

  const filtered = useMemo(() => {
    return withCoords.filter((e) => {
      if (city !== "all" && e.city !== city) return false;
      if (genreSlug !== "all" && e.genre !== genreSlug) return false;
      if (maisVantaOnly && !e.maisVanta) return false;
      if (selectedRadius && userLocation && e.lat != null && e.lng != null) {
        if (distanceKm(userLocation, { lat: e.lat, lng: e.lng }) > selectedRadius)
          return false;
      }
      return true;
    });
  }, [withCoords, city, genreSlug, maisVantaOnly, selectedRadius, userLocation]);

  const availableCities = useMemo(() => {
    const used = [...new Set(withCoords.map((e) => e.city).filter(Boolean))];
    return used
      .sort()
      .map((c) => ({ name: c, slug: c.toLowerCase().replace(/\s+/g, "-") }));
  }, [withCoords]);

  const availableGenres = useMemo(() => {
    const used = new Set(withCoords.map((e) => e.genre).filter(Boolean));
    return genres.filter((g) => used.has(g.slug));
  }, [withCoords]);

  const selectedEvent = filtered.find((e) => e.slug === selectedSlug) ?? null;

  // Closest event to user
  const closestSlug = useMemo(() => {
    if (!userLocation) return null;
    let min = Infinity;
    let slug: string | null = null;
    for (const e of filtered) {
      if (e.lat == null || e.lng == null) continue;
      const d = distanceKm(userLocation, { lat: e.lat, lng: e.lng });
      if (d < min) {
        min = d;
        slug = e.slug;
      }
    }
    return slug;
  }, [filtered, userLocation]);

  const center: [number, number] = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (filtered.length === 0) return [-22.9105, -43.1768];
    if (city !== "all" && filtered.length > 0) {
      const avg = filtered.reduce(
        (acc, e) => ({
          lat: acc.lat + (e.lat ?? 0),
          lng: acc.lng + (e.lng ?? 0),
        }),
        { lat: 0, lng: 0 }
      );
      return [avg.lat / filtered.length, avg.lng / filtered.length];
    }
    return [-22.9105, -43.1768];
  }, [userLocation, city, filtered]);

  const handleZoom = useCallback((dir: "in" | "out") => {
    setZoomAction(dir);
    setTimeout(() => setZoomAction(null), 100);
  }, []);

  const getDistLabel = (e: EventCardData) => {
    if (!userLocation || e.lat == null || e.lng == null) return null;
    const d = distanceKm(userLocation, { lat: e.lat, lng: e.lng });
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
  };

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
            Mapa interativo com eventos próximos. Filtre por cidade, gênero,
            distância ou só Mais Vanta. Clique num pin pra ver os detalhes.
          </p>
        </Container>
      </section>

      <Container size="lg" className="py-10">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="space-y-5">
              {/* Location */}
              <div>
                <label className="ui-label block mb-2">Localização</label>
                {userLocation ? (
                  <div className="flex items-center gap-2 text-sm text-success mb-3">
                    <LocateFixed size={14} />
                    <span>Localização ativa</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigator.geolocation?.getCurrentPosition(
                        (pos) =>
                          setUserLocation({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                          }),
                        () => {},
                        { enableHighAccuracy: true, timeout: 10000 }
                      );
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-black text-sm font-bold uppercase tracking-widest w-full justify-center cursor-pointer active:scale-95 transition-all mb-3"
                  >
                    <LocateFixed size={14} />
                    Ativar localização
                  </button>
                )}

                {/* Radius filter */}
                {userLocation && (
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Todos", value: null },
                      { label: "5 km", value: 5 },
                      { label: "10 km", value: 10 },
                      { label: "25 km", value: 25 },
                      { label: "50 km", value: 50 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedRadius(opt.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all border active:scale-95",
                          selectedRadius === opt.value
                            ? "bg-gold text-black border-gold shadow-[0_0_8px_rgba(255,211,0,0.3)]"
                            : "bg-input text-text-muted border-white/5 hover-real:border-white/15"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* City */}
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

              {/* Genre */}
              <div>
                <label className="ui-label block mb-2">Gênero</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setGenreSlug("all")}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 active:scale-95",
                      genreSlug === "all"
                        ? "bg-gold text-black"
                        : "bg-input border border-white/5 text-text-secondary hover-real:border-white/15"
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
                          : "bg-input border border-white/5 text-text-muted hover-real:border-white/15"
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mais Vanta */}
              <button
                onClick={() => setMaisVantaOnly((v) => !v)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors duration-200 cursor-pointer w-full",
                  maisVantaOnly
                    ? "bg-gold/10 border-gold/40 text-gold"
                    : "bg-input border-white/5 text-text-secondary hover-real:border-white/15"
                )}
              >
                <Crown size={14} strokeWidth={2.5} />
                <span>Apenas Mais Vanta</span>
              </button>
            </div>

            {/* Event list */}
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
                  const dist = getDistLabel(e);
                  return (
                    <li key={e.slug}>
                      <button
                        onClick={() => setSelectedSlug(e.slug)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-colors duration-200 cursor-pointer",
                          active
                            ? "bg-gold/10 border-gold/40"
                            : "bg-card border-white/5 hover-real:border-white/15"
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
                            {dist && ` · ${dist}`}
                          </p>
                          {genre && (
                            <span
                              className={cn(
                                "inline-block mt-1.5 px-2 py-0.5 rounded-full text-[0.55rem] font-semibold uppercase tracking-[0.14em]",
                                genre.badgeClass
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

          {/* Map */}
          <div className="relative h-[70vh] min-h-[500px]">
            <RadarMap
              events={filtered}
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
              center={center}
              userLocation={userLocation}
              selectedRadius={selectedRadius}
              closestSlug={closestSlug}
              zoomAction={zoomAction}
              recenterTrigger={recenterTrigger}
            />

            {/* Loading */}
            {loading && filtered.length === 0 && (
              <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
                <div className="bg-black/80 backdrop-blur-sm border border-white/10 p-6 rounded-full shadow-2xl">
                  <Loader2 size="2rem" className="text-gold animate-spin" />
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-auto">
                <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 shadow-2xl text-center max-w-[16.25rem]">
                  <p className="text-zinc-400 text-xs mb-3">
                    Nenhum evento encontrado com esses filtros
                  </p>
                </div>
              </div>
            )}

            {/* Zoom + recenter controls */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-[1000]">
              <button
                aria-label="Centralizar"
                onClick={() => {
                  setSelectedSlug(null);
                  setRecenterTrigger((n) => n + 1);
                }}
                className={cn(
                  "w-10 h-10 backdrop-blur border rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer",
                  userLocation
                    ? "bg-zinc-900/90 border-gold/30 text-gold shadow-gold/10"
                    : "bg-zinc-800/50 border-white/5 text-zinc-400"
                )}
              >
                <Crosshair size="1.125rem" />
              </button>
              <div className="h-4" />
              <button
                onClick={() => handleZoom("in")}
                className="w-10 h-10 bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full flex items-center justify-center text-zinc-300 shadow-lg active:bg-zinc-800 cursor-pointer"
              >
                <Plus size="1.125rem" />
              </button>
              <button
                onClick={() => handleZoom("out")}
                className="w-10 h-10 bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full flex items-center justify-center text-zinc-300 shadow-lg active:bg-zinc-800 cursor-pointer"
              >
                <Minus size="1.125rem" />
              </button>
            </div>

            {/* Active event card */}
            {selectedEvent && (
              <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-14 lg:max-w-sm z-[1000] pointer-events-auto">
                <Link
                  href={`/evento/${selectedEvent.slug}`}
                  className="bg-[#0F0D08]/95 backdrop-blur-sm border border-gold/20 rounded-[1.5rem] p-3 shadow-2xl flex gap-3 active:scale-[0.98] transition-transform"
                >
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden shrink-0"
                    style={{ background: selectedEvent.gradient }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-[0.5rem] font-bold text-gold uppercase tracking-wider mb-0.5">
                      {selectedEvent.genre || "evento"}
                    </span>
                    <h3 className="font-display text-sm text-white leading-tight mb-0.5 truncate">
                      {selectedEvent.name}
                    </h3>
                    <p className="text-zinc-400 text-[0.625rem] mb-1.5">
                      {selectedEvent.dateLabel}
                      {(() => {
                        const dist = getDistLabel(selectedEvent);
                        return dist ? ` · ${dist}` : null;
                      })()}
                      {" · "}
                      <span className="text-gold font-semibold">
                        {selectedEvent.priceLabel}
                      </span>
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.625rem] font-bold text-white flex items-center">
                        Ver detalhes
                        <ArrowRight size="0.75rem" className="ml-1 text-gold" />
                      </span>
                      {selectedEvent.lat != null && selectedEvent.lng != null && (
                        <button
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${selectedEvent.lat},${selectedEvent.lng}`,
                              "_blank"
                            );
                          }}
                          className="flex items-center gap-1 text-[0.625rem] font-bold text-gold active:opacity-50"
                        >
                          <Navigation size="0.625rem" />
                          Ir
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
