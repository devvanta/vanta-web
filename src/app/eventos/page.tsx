"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Crown, Filter, MapPin, Search, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EventCard } from "@/components/site/event-card";
import { useEvents } from "@/lib/supabase/use-events";
import { genres } from "@/lib/genres";
import { cn } from "@/lib/utils";

type DatePreset = "all" | "today" | "tomorrow" | "this-week" | "this-month";
type PriceBand = "all" | "free" | "lt50" | "50-100" | "gt100";

const datePresets: { value: DatePreset; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "today", label: "Hoje" },
  { value: "tomorrow", label: "Amanhã" },
  { value: "this-week", label: "Esta semana" },
  { value: "this-month", label: "Este mês" },
];

const pricePresets: { value: PriceBand; label: string }[] = [
  { value: "all", label: "Tudo" },
  { value: "free", label: "Grátis" },
  { value: "lt50", label: "Até R$50" },
  { value: "50-100", label: "R$50 a 100" },
  { value: "gt100", label: "Acima de R$100" },
];

function inDatePreset(iso: string | undefined, preset: DatePreset): boolean {
  if (preset === "all") return true;
  if (!iso) return false;
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const inSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (preset === "today") return inSameDay(date, today);
  if (preset === "tomorrow") return inSameDay(date, tomorrow);
  if (preset === "this-week") {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + (7 - today.getDay()));
    return date >= today && date <= weekEnd;
  }
  if (preset === "this-month") {
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
  return true;
}

function inPriceBand(price: number | undefined, band: PriceBand): boolean {
  if (band === "all") return true;
  if (price === undefined) return false;
  if (band === "free") return price === 0;
  if (band === "lt50") return price > 0 && price < 50;
  if (band === "50-100") return price >= 50 && price <= 100;
  if (band === "gt100") return price > 100;
  return true;
}

export default function EventosPage() {
  return <Suspense><EventosContent /></Suspense>;
}

function EventosContent() {
  const { events: allEvents, loading } = useEvents();
  const searchParams = useSearchParams();
  const [city, setCity] = useState<string>("all");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [priceBand, setPriceBand] = useState<PriceBand>("all");
  const [maisVantaOnly, setMaisVantaOnly] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  // Read URL params (from /buscar links)
  useEffect(() => {
    const cidadeParam = searchParams.get("cidade");
    const generoParam = searchParams.get("genero");
    if (cidadeParam) setCity(cidadeParam);
    if (generoParam) setSelectedGenres(new Set([generoParam]));
  }, [searchParams]);

  const filtered = useMemo(() => {
    return allEvents.filter((e) => {
      if (city !== "all" && e.city !== city) return false;
      if (!inDatePreset(e.dateISO, datePreset)) return false;
      if (!inPriceBand(e.priceCents, priceBand)) return false;
      if (maisVantaOnly && !e.maisVanta) return false;
      if (selectedGenres.size > 0) {
        if (!e.genre || !selectedGenres.has(e.genre)) return false;
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack =
          `${e.name} ${e.venue} ${e.city} ${e.genre ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allEvents, city, datePreset, priceBand, maisVantaOnly, selectedGenres, query]);

  const cityOptions = useMemo(() => {
    const used = new Set(allEvents.map((e) => e.city));
    return [...used].filter(Boolean).sort().map((c) => ({ name: c, slug: c.toLowerCase().replace(/\s+/g, "-") }));
  }, [allEvents]);

  const usedGenres = useMemo(() => {
    const used = new Set(allEvents.map((e) => e.genre).filter(Boolean));
    return genres.filter((g) => used.has(g.slug));
  }, [allEvents]);

  const activeFilters =
    (city !== "all" ? 1 : 0) +
    (datePreset !== "all" ? 1 : 0) +
    (priceBand !== "all" ? 1 : 0) +
    (maisVantaOnly ? 1 : 0) +
    selectedGenres.size +
    (query.trim() ? 1 : 0);

  function clearAll() {
    setCity("all");
    setDatePreset("all");
    setPriceBand("all");
    setMaisVantaOnly(false);
    setSelectedGenres(new Set());
    setQuery("");
  }

  function toggleGenre(slug: string) {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  return (
    <Container size="lg" className="py-12 md:py-16">
      <header className="mb-10">
        <span className="kicker mb-3 inline-block">todos os eventos</span>
        <h1 className="text-4xl md:text-6xl leading-tight mb-4">
          O que tá rolando.
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Filtre por cidade, data, preço, gênero ou clube. Encontre o rolê que
          combina com a sua noite.
        </p>
      </header>

      <div className="grid md:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">
        <aside className="md:sticky md:top-24 space-y-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gold" />
              <span className="kicker">filtros</span>
              {activeFilters > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-gold text-black text-[0.6rem] font-bold">
                  {activeFilters}
                </span>
              )}
            </div>
            {activeFilters > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-text-muted hover-real:text-text-primary transition-colors duration-200 cursor-pointer flex items-center gap-1"
              >
                <X size={12} />
                Limpar
              </button>
            )}
          </div>

          {/* Busca */}
          <div>
            <label className="ui-label block mb-2">Busca</label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nome, casa, gênero..."
                className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* Cidade */}
          <div>
            <label className="ui-label block mb-2">Cidade</label>
            <div className="relative">
              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-gold/30 focus:outline-none cursor-pointer transition-colors duration-200 appearance-none"
              >
                <option value="all">Todas as cidades</option>
                {cityOptions.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Data */}
          <div>
            <label className="ui-label block mb-2">Data</label>
            <div className="flex flex-wrap gap-2">
              {datePresets.map((d) => (
                <FilterPill
                  key={d.value}
                  active={datePreset === d.value}
                  onClick={() => setDatePreset(d.value)}
                >
                  {d.label}
                </FilterPill>
              ))}
            </div>
          </div>

          {/* Preço */}
          <div>
            <label className="ui-label block mb-2">Preço</label>
            <div className="flex flex-wrap gap-2">
              {pricePresets.map((p) => (
                <FilterPill
                  key={p.value}
                  active={priceBand === p.value}
                  onClick={() => setPriceBand(p.value)}
                >
                  {p.label}
                </FilterPill>
              ))}
            </div>
          </div>

          {/* Mais Vanta toggle */}
          <div>
            <label className="ui-label block mb-2">Acesso</label>
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

          {/* Gênero */}
          <div>
            <label className="ui-label block mb-2">Gênero musical</label>
            <div className="flex flex-wrap gap-2">
              {usedGenres.map((g) => {
                const active = selectedGenres.has(g.slug);
                return (
                  <button
                    key={g.slug}
                    onClick={() => toggleGenre(g.slug)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer transition-all duration-200 active:scale-95",
                      active
                        ? g.badgeClass
                        : "bg-input border border-white/5 text-text-muted hover-real:border-white/15"
                    )}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <p className="text-sm text-text-secondary">
              <span className="text-text-primary font-semibold">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "evento encontrado" : "eventos encontrados"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 active:scale-95",
        active
          ? "bg-gold text-black"
          : "bg-input border border-white/5 text-text-secondary hover-real:border-white/15"
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gold/10 border border-gold/20 mb-5 text-gold">
        <Search size={20} />
      </div>
      <h3 className="text-2xl mb-3 leading-tight">Nada por aqui ainda.</h3>
      <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
        Os filtros aplicados não retornaram nenhum evento. Solte um pouco e
        veja o que aparece.
      </p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 text-sm text-gold hover-real:underline cursor-pointer"
      >
        <X size={14} />
        Limpar filtros
      </button>
    </div>
  );
}
