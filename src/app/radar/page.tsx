"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  ChevronRight,
  Crosshair,
  Loader2,
  LocateFixed,
  Minus,
  Navigation,
  Plus,
  Radio,
  RotateCcw,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useEvents } from "@/lib/supabase/use-events";
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

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDateLabel(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() === today.getTime()) return "Hoje";
  if (target.getTime() === tomorrow.getTime()) return "Amanhã";
  return target
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "");
}

function isLiveEvent(e: EventCardData): boolean {
  if (!e.dateISO) return false;
  const now = new Date();
  const start = new Date(e.dateISO);
  if (now < start) return false;
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);
  return now <= end;
}

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
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [zoomAction, setZoomAction] = useState<"in" | "out" | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // Request geolocation silently on mount
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

  const dateLabel = useMemo(() => getDateLabel(selectedDate), [selectedDate]);
  const isToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate.getTime() === today.getTime();
  }, [selectedDate]);

  // Filter events by date + radius + live
  const filtered = useMemo(() => {
    const targetDate = selectedDate.toISOString().split("T")[0];
    let result = allEvents.filter((e) => {
      if (!e.dateISO) return false;
      const eventDate = e.dateISO.split("T")[0];
      return eventDate === targetDate && e.lat != null && e.lng != null;
    });

    if (selectedRadius && userLocation) {
      result = result.filter((e) => {
        if (e.lat == null || e.lng == null) return false;
        return (
          distanceKm(userLocation, { lat: e.lat, lng: e.lng }) <=
          selectedRadius
        );
      });
    }

    if (showLiveOnly) {
      result = result.filter(isLiveEvent);
    }

    return result;
  }, [allEvents, selectedDate, selectedRadius, userLocation, showLiveOnly]);

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

  const activeEvent = selectedSlug
    ? filtered.find((e) => e.slug === selectedSlug)
    : null;

  const center: [number, number] = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (filtered.length > 0) {
      const avg = filtered.reduce(
        (acc, e) => ({
          lat: acc.lat + (e.lat ?? 0),
          lng: acc.lng + (e.lng ?? 0),
        }),
        { lat: 0, lng: 0 }
      );
      return [avg.lat / filtered.length, avg.lng / filtered.length];
    }
    return [-22.9068, -43.1729]; // Rio fallback
  }, [userLocation, filtered]);

  const handleZoom = useCallback((dir: "in" | "out") => {
    setZoomAction(dir);
    setTimeout(() => setZoomAction(null), 100);
  }, []);

  const resetToToday = useCallback(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
    setSelectedSlug(null);
    setShowLiveOnly(false);
  }, []);

  const setTomorrow = useCallback(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
    setSelectedSlug(null);
    setShowLiveOnly(false);
  }, []);

  const findClosest = useCallback(() => {
    const todayISO = new Date().toISOString().split("T")[0];
    const future = allEvents.filter(
      (e) =>
        e.dateISO &&
        e.dateISO.split("T")[0] >= todayISO &&
        e.lat != null &&
        e.lng != null
    );
    if (future.length === 0) return;

    let target: EventCardData;
    if (userLocation) {
      target = future.sort(
        (a, b) =>
          distanceKm(userLocation, { lat: a.lat!, lng: a.lng! }) -
          distanceKm(userLocation, { lat: b.lat!, lng: b.lng! })
      )[0];
    } else {
      target = future.sort((a, b) =>
        (a.dateISO ?? "").localeCompare(b.dateISO ?? "")
      )[0];
    }

    const eventDate = new Date(target.dateISO!.split("T")[0] + "T00:00:00");
    eventDate.setHours(0, 0, 0, 0);
    setSelectedDate(eventDate);
    setSelectedSlug(target.slug);
  }, [allEvents, userLocation]);

  const getDistLabel = (e: EventCardData) => {
    if (!userLocation || e.lat == null || e.lng == null) return null;
    const d = distanceKm(userLocation, { lat: e.lat, lng: e.lng });
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
  };

  const isTomorrow = dateLabel === "Amanhã";

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#0F0D08] overflow-hidden">
      {/* Map fills entire area */}
      <div className="absolute inset-0">
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
      </div>

      {/* Header overlay — title + date filters + radius */}
      <div className="absolute top-6 left-0 right-0 z-[1000] pointer-events-none flex flex-col items-center gap-2 px-6">
        {/* Title */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl text-gold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              Radar
            </h1>
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                filtered.length > 0
                  ? "bg-gold animate-pulse shadow-[0_0_8px_#FFD300]"
                  : "bg-zinc-600"
              }`}
            />
            <p className="text-gold text-[0.625rem] uppercase tracking-widest font-bold drop-shadow-md">
              {dateLabel}
            </p>
          </div>
          <p className="text-text-muted text-xs pointer-events-auto">
            {filtered.length} {filtered.length === 1 ? "evento" : "eventos"}
          </p>
        </div>

        {/* Date filter bar */}
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 p-1 rounded-full flex items-center shadow-2xl">
            <button
              onClick={() => {
                resetToToday();
              }}
              className={`px-3 py-1.5 rounded-full text-[0.5625rem] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                isToday && !showLiveOnly
                  ? "bg-gold text-black shadow-[0_0_15px_rgba(255,211,0,0.4)]"
                  : "text-zinc-400 hover-real:text-white"
              }`}
            >
              Hoje
            </button>
            <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
            <button
              onClick={() => {
                resetToToday();
                setShowLiveOnly(true);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[0.5625rem] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                showLiveOnly
                  ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "text-zinc-400 hover-real:text-white"
              }`}
            >
              <Radio
                size="0.625rem"
                className={showLiveOnly ? "animate-pulse" : ""}
              />
              Ao Vivo
            </button>
            <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
            <button
              onClick={setTomorrow}
              className={`px-3 py-1.5 rounded-full text-[0.5625rem] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                isTomorrow && !showLiveOnly
                  ? "bg-gold text-black shadow-[0_0_15px_rgba(255,211,0,0.4)]"
                  : "text-zinc-400 hover-real:text-white"
              }`}
            >
              Amanhã
            </button>
          </div>
          {!isToday && (
            <button
              onClick={resetToToday}
              className="bg-black/80 backdrop-blur-sm border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-2 text-[0.5rem] font-black uppercase tracking-[0.2em] text-gold shadow-lg cursor-pointer"
            >
              <RotateCcw size="0.625rem" />
              Voltar para Hoje
            </button>
          )}
        </div>

        {/* Radius filter */}
        {userLocation ? (
          <div className="pointer-events-auto flex gap-1.5 justify-center">
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
                className={`shrink-0 px-3 py-1 rounded-full text-[0.5rem] font-black uppercase tracking-widest transition-all border cursor-pointer ${
                  selectedRadius === opt.value
                    ? "bg-gold text-black border-gold shadow-[0_0_8px_rgba(255,211,0,0.3)]"
                    : "bg-black/80 backdrop-blur text-zinc-400 border-white/10"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="pointer-events-auto flex justify-center">
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
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold text-black text-[0.5rem] font-black uppercase tracking-widest border border-gold shadow-[0_0_8px_rgba(255,211,0,0.3)] active:scale-95 transition-all cursor-pointer"
            >
              <LocateFixed size="0.75rem" />
              Ativar localização
            </button>
          </div>
        )}
      </div>

      {/* Loading spinner */}
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
              Nenhum evento para{" "}
              <span className="text-white font-bold">{dateLabel}</span>
            </p>
            <button
              onClick={findClosest}
              className="text-gold text-[0.625rem] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto active:opacity-50 cursor-pointer"
            >
              Ver próximo <ArrowRight size="0.75rem" />
            </button>
          </div>
        </div>
      )}

      {/* Right side controls — zoom + recenter */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-[1000]">
        <button
          aria-label="Centralizar"
          onClick={() => {
            setSelectedSlug(null);
            setRecenterTrigger((n) => n + 1);
          }}
          className={`w-10 h-10 backdrop-blur border rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer ${
            userLocation
              ? "bg-zinc-900/90 border-gold/30 text-gold shadow-gold/10"
              : "bg-zinc-800/50 border-white/5 text-zinc-400"
          }`}
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

      {/* Active event card — bottom */}
      {activeEvent && (
        <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[1000] pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
          <Link
            href={`/evento/${activeEvent.slug}`}
            className="bg-[#0F0D08]/95 backdrop-blur-sm border border-gold/20 rounded-[1.5rem] p-3 shadow-2xl flex gap-3 active:scale-[0.98] transition-transform"
          >
            <div
              className="w-16 h-16 rounded-xl overflow-hidden shrink-0"
              style={{ background: activeEvent.gradient }}
            />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="text-[0.5rem] font-bold text-gold uppercase tracking-wider mb-0.5">
                {activeEvent.genre || "evento"}
              </span>
              <h3 className="font-display text-sm text-white leading-tight mb-0.5 truncate">
                {activeEvent.name}
              </h3>
              <p className="text-zinc-400 text-[0.625rem] mb-1.5">
                {activeEvent.dateLabel}
                {(() => {
                  const dist = getDistLabel(activeEvent);
                  return dist ? ` · ${dist}` : null;
                })()}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[0.625rem] font-bold text-white flex items-center">
                  Ver detalhes
                  <ArrowRight
                    size="0.75rem"
                    className="ml-1 text-gold"
                  />
                </span>
                {activeEvent.lat != null && activeEvent.lng != null && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${activeEvent.lat},${activeEvent.lng}`,
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
  );
}
