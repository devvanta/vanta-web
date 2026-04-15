"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Check,
  Crown,
  Gift,
  MapPin,
  Send,
  Shield,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "ativos" | "historico" | "cortesias";

type ActiveTicket = {
  id: string;
  event: string;
  venue: string;
  city: string;
  date: string;
  variation: string;
  code: string;
  maisVanta?: boolean;
  gradient: string;
};

const active: ActiveTicket[] = [
  {
    id: "TCK-0042",
    event: "Noite do Samba",
    venue: "Casa do Samba",
    city: "Rio de Janeiro",
    date: "Sáb · 19 abr · 22h",
    variation: "1º Lote · Pista",
    code: "A1B2C3",
    maisVanta: true,
    gradient:
      "radial-gradient(circle at 30% 20%, rgba(255,211,0,0.32), transparent 55%), linear-gradient(140deg, #2a1d0a, #080604)",
  },
  {
    id: "TCK-0043",
    event: "Sunset Privilege",
    venue: "Rooftop Ipanema",
    city: "Rio de Janeiro",
    date: "Dom · 20 abr · 17h",
    variation: "1º Lote · VIP",
    code: "D4E5F6",
    gradient:
      "radial-gradient(circle at 70% 30%, rgba(255,211,0,0.22), transparent 60%), linear-gradient(200deg, #201510, #080604)",
  },
  {
    id: "TCK-0044",
    event: "Techno Underground",
    venue: "Comuna",
    city: "Rio de Janeiro",
    date: "Qui · 24 abr · 20h",
    variation: "Cortesia",
    code: "G7H8I9",
    maisVanta: true,
    gradient:
      "radial-gradient(circle at 20% 70%, rgba(255,211,0,0.16), transparent 60%), linear-gradient(220deg, #1f1810, #080604)",
  },
];

const history = [
  {
    event: "Sambinha da Lapa",
    venue: "Armazém 1",
    date: "12 abr 2026",
    checkedIn: true,
  },
  {
    event: "Funk da Quebrada",
    venue: "Galpão Tijuca",
    date: "5 abr 2026",
    checkedIn: true,
  },
  {
    event: "Jazz Sessions",
    venue: "Mistura Fina",
    date: "28 mar 2026",
    checkedIn: true,
  },
  {
    event: "House Nights",
    venue: "Fundição",
    date: "15 mar 2026",
    checkedIn: false,
  },
];

const cortesias = [
  {
    event: "Baile da Casa",
    venue: "Casa do Samba",
    qty: 1,
    expires: "até 30 abr",
    from: "Casa parceira",
  },
  {
    event: "Sunset exclusivo",
    venue: "Rooftop Ipanema",
    qty: 2,
    expires: "até 15 mai",
    from: "Mais Vanta",
  },
];

export default function CarteiraPage() {
  const [tab, setTab] = useState<Tab>("ativos");

  return (
    <div className="space-y-6">
      <header>
        <span className="kicker mb-3 inline-block">carteira</span>
        <h1 className="text-3xl md:text-4xl leading-tight mb-3">
          Seus ingressos, <span className="text-gold">num só lugar</span>.
        </h1>
        <p className="text-text-secondary">
          QR anti-screenshot, transferência em um toque, cortesias liberadas
          pelas casas parceiras.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5">
        {(["ativos", "historico", "cortesias"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-3 text-sm font-medium cursor-pointer border-b-2 -mb-[2px] transition-colors duration-200",
              tab === t
                ? "text-gold border-gold"
                : "text-text-muted border-transparent hover-real:text-text-primary",
            )}
          >
            {t === "ativos" && `Ativos · ${active.length}`}
            {t === "historico" && `Histórico · ${history.length}`}
            {t === "cortesias" && `Cortesias · ${cortesias.length}`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "ativos" && (
        <div className="grid md:grid-cols-2 gap-5">
          {active.map((t) => (
            <TicketCard key={t.id} t={t} />
          ))}
        </div>
      )}

      {tab === "historico" && (
        <ul className="rounded-2xl border border-white/5 bg-card overflow-hidden">
          {history.map((h, i) => (
            <li
              key={`${h.event}-${i}`}
              className={cn(
                "p-5 flex items-center gap-4",
                i > 0 && "border-t border-white/5",
              )}
            >
              <div
                className="h-10 w-10 rounded-xl shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,211,0,0.15), #080604)",
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{h.event}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {h.venue} · {h.date}
                </p>
              </div>
              {h.checkedIn ? (
                <span className="inline-flex items-center gap-1 text-xs text-success">
                  <Check size={12} />
                  Check-in
                </span>
              ) : (
                <span className="text-xs text-text-muted">No-show</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {tab === "cortesias" && (
        <div className="space-y-3">
          {cortesias.map((c) => (
            <div
              key={c.event}
              className="rounded-2xl border border-gold/20 bg-gradient-to-br from-card to-midnight p-5 flex items-start gap-4"
            >
              <div className="h-11 w-11 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                <Gift size={16} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <p className="text-sm font-semibold">{c.event}</p>
                  <span className="kicker text-[0.6rem]">
                    {c.qty} {c.qty === 1 ? "cortesia" : "cortesias"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-3">
                  {c.venue} · Vale {c.expires} · {c.from}
                </p>
                <Link
                  href="/eventos"
                  className="inline-flex items-center gap-1 text-xs text-gold hover-real:underline"
                >
                  Usar em um evento
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dica de segurança */}
      <div className="rounded-2xl border border-white/5 bg-card p-5 flex items-start gap-3">
        <Shield size={14} className="text-gold shrink-0 mt-0.5" />
        <p className="text-xs text-text-muted leading-relaxed">
          O QR tem proteção anti-screenshot e PIN com hash PBKDF2. Nunca
          compartilhe sua tela na portaria — transfira o ingresso pelo app
          direto pro seu amigo.
        </p>
      </div>
    </div>
  );
}

function TicketCard({ t }: { t: ActiveTicket }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
      <div className="relative h-40" style={{ background: t.gradient }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {t.maisVanta && (
          <span
            className="absolute right-4 top-4 inline-flex items-center justify-center h-8 w-8 rounded-full bg-gold/15 border border-gold/40"
            style={{ filter: "drop-shadow(0 0 4px rgba(255,211,0,0.5))" }}
          >
            <Crown size={12} className="text-gold" strokeWidth={2.5} />
          </span>
        )}
        <div className="absolute bottom-4 left-5 right-5">
          <p className="kicker text-[0.6rem] mb-1">{t.date}</p>
          <p className="font-display text-base leading-tight">{t.event}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-text-muted mb-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-gold" />
            {t.venue}, {t.city}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-gold" />
            {t.date}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={() => setFlipped((v) => !v)}
            className="relative h-24 w-24 rounded-xl bg-white p-2 shrink-0 cursor-pointer hover-real:brightness-95 transition-all duration-200"
            aria-label="Ver QR do ingresso"
          >
            <QRPlaceholder code={t.code} blurred={!flipped} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="kicker text-[0.55rem] mb-1">ingresso</p>
            <p className="text-sm font-semibold mb-1 truncate">
              {t.variation}
            </p>
            <p className="text-xs text-text-muted mb-2">#{t.id}</p>
            <p className="text-[0.65rem] text-text-muted leading-relaxed">
              {flipped
                ? "QR ativo. Mostre na portaria."
                : "Clique no QR para revelar."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 h-10 rounded-xl bg-elevated border border-white/10 text-xs font-semibold text-text-primary hover-real:border-white/20 transition-colors duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2">
            <Send size={12} />
            Transferir
          </button>
          <button className="flex-1 h-10 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-[0.18em] hover-real:brightness-110 transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2">
            <Ticket size={12} />
            Abrir QR
          </button>
        </div>
      </div>
    </div>
  );
}

function QRPlaceholder({
  code,
  blurred,
}: {
  code: string;
  blurred?: boolean;
}) {
  // Gera um pseudo-QR visual baseado no hash do code (não é um QR real)
  const seed = code
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cells: boolean[] = [];
  let x = seed;
  for (let i = 0; i < 81; i++) {
    x = (x * 9301 + 49297) % 233280;
    cells.push(x % 2 === 0);
  }
  const corners = [0, 6, 42, 48];

  return (
    <div className="relative h-full w-full">
      <div className="grid grid-cols-9 gap-0 h-full w-full">
        {cells.map((on, i) => {
          const row = Math.floor(i / 9);
          const col = i % 9;
          const isCorner =
            corners.some((c) => {
              const cr = Math.floor(c / 9);
              const cc = c % 9;
              return (
                Math.abs(row - cr) <= 1 && Math.abs(col - cc) <= 1
              );
            }) ||
            (row === 0 && col === 0) ||
            (row === 0 && col === 6) ||
            (row === 6 && col === 0);
          return (
            <div
              key={i}
              className={cn(
                "aspect-square",
                on || isCorner ? "bg-black" : "bg-white",
              )}
            />
          );
        })}
      </div>
      {blurred && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center rounded">
          <Ticket size={16} className="text-black" />
        </div>
      )}
    </div>
  );
}
