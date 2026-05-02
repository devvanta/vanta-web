import Link from "next/link";
import Image from "next/image";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Extrai URL de uma string gradient. Retorna null se for gradient CSS puro.
 * `url(https://foo.jpg) center/cover` → `https://foo.jpg`
 */
function extractImageUrl(gradient: string): string | null {
  const match = gradient.match(/^url\((["']?)(.+?)\1\)/);
  return match ? match[2] : null;
}

export type EventStatus = "happening" | "startingSoon" | "lowStock";

export type EventCardData = {
  slug: string;
  name: string;
  venue: string;
  city: string;
  dateLabel: string;
  priceLabel: string;
  status?: EventStatus;
  maisVanta?: boolean;
  gradient: string;
  /** dados estendidos pra filtros — opcionais pro card */
  genre?: string;
  priceCents?: number;
  dateISO?: string;
  lat?: number;
  lng?: number;
  /** detalhes pra página de evento */
  description?: string;
  address?: string;
  lineUp?: Array<{ name: string; role: string; time: string }>;
};

const statusStyles: Record<
  EventStatus,
  { label: string; className: string; pulse: boolean }
> = {
  happening: {
    label: "Acontecendo agora",
    className: "bg-success/20 border border-success/40 text-success",
    pulse: true,
  },
  startingSoon: {
    label: "Começa em breve",
    className: "bg-warning/15 border border-warning/40 text-warning",
    pulse: false,
  },
  lowStock: {
    label: "Últimas vagas",
    className: "bg-warning/15 border border-warning/40 text-warning",
    pulse: false,
  },
};

export function EventCard({ event }: { event: EventCardData }) {
  const status = event.status ? statusStyles[event.status] : null;
  // Fix #177 L1 (2026-04-21): se gradient é uma foto (url(...)), usa
  // Next.js <Image> pra ter srcset responsivo + lazy loading + AVIF/WebP.
  // Fallback pra background quando é gradient CSS puro.
  const imageUrl = extractImageUrl(event.gradient);
  return (
    <Link
      href={`/evento/${event.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-white/[0.06] transition-colors duration-200 active:scale-[0.97]",
        event.maisVanta &&
          "border-[1.5px] border-gold/40 shadow-[0_0_12px_rgba(255,211,0,0.1)]",
        "hover-real:border-white/20"
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: event.gradient }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {status && (
          <span
            className={cn(
              "absolute left-4 top-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-semibold uppercase tracking-[0.18em] backdrop-blur",
              status.className
            )}
          >
            {status.pulse && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
              </span>
            )}
            {status.label}
          </span>
        )}

        {event.maisVanta && (
          <span
            className="absolute right-4 top-4 inline-flex items-center justify-center h-8 w-8 rounded-full bg-gold/15 border border-gold/40"
            style={{ filter: "drop-shadow(0 0 4px rgba(255,211,0,0.5))" }}
            aria-label="Evento Mais Vanta"
          >
            <Crown size={14} className="text-gold" strokeWidth={2.5} />
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="kicker text-[0.6rem] mb-1.5">{event.dateLabel}</p>
          <h3
            className="font-display text-[0.9rem] leading-tight mb-1 line-clamp-2"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
          >
            {event.name}
          </h3>
          <p className="text-xs text-text-muted line-clamp-1">
            {event.venue} · {event.city}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
        <span className="text-xs text-text-muted">A partir de</span>
        <span className="text-sm font-semibold text-gold">
          {event.priceLabel}
        </span>
      </div>
    </Link>
  );
}
