import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Crown,
  MapPin,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/site/event-card";
import { EventLocationMap } from "@/components/site/event-location-map";
import {
  getEventBySlug,
  getEventIdBySlug,
  getEventLotes,
  getPublicEvents,
  type LoteWithVariacoes,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { genreBySlug } from "@/lib/genres";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbSchema, eventSchema, faqSchema } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Evento não encontrado — VANTA" };
  }

  const title = `${event.name} — ${event.venue}, ${event.city} | VANTA`;
  const description =
    event.description ??
    `${event.name} acontece no ${event.venue}, em ${event.city}. ${event.dateLabel}. Garanta seu ingresso.`;

  return {
    title,
    description,
    // Fix #177 L2 (2026-04-21): canonical dinâmica pra cada evento.
    // Evita duplicate content se a URL viralizar com UTM params.
    alternates: {
      canonical: `https://maisvanta.com/evento/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://maisvanta.com/evento/${slug}`,
      type: "website",
      ...(event.gradient.startsWith("url(") && {
        images: [{ url: event.gradient.replace(/^url\(|\) center\/cover$/g, "") }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const faq = [
  {
    q: "Como funciona o ingresso?",
    a: "Depois da compra, o ingresso entra automaticamente na sua carteira do app. Na entrada, apresente o QR para a portaria.",
  },
  {
    q: "Posso transferir meu ingresso?",
    a: "Sim. Pelo app, aba Carteira, você transfere o ingresso direto para o perfil de um amigo em segundos.",
  },
  {
    q: "Qual a política de reembolso?",
    a: "Em caso de cancelamento do evento, o valor é estornado integralmente em até 7 dias úteis.",
  },
  {
    q: "Meia-entrada?",
    a: "Disponível em variações marcadas. Faça upload do comprovante no app — a aprovação sai em até 24h.",
  },
  {
    q: "E se eu for Mais Vanta?",
    a: "Benefícios aplicados automaticamente no checkout: desconto, cortesia ou prioridade — varia por evento.",
  },
];

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [event, eventoId, supabase] = await Promise.all([
    getEventBySlug(slug),
    getEventIdBySlug(slug),
    createClient(),
  ]);
  if (!event) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const lotes = eventoId ? await getEventLotes(eventoId) : [];
  const loteAtivo = lotes.find((l) => l.ativo) ?? lotes[lotes.length - 1] ?? null;

  const genre = event.genre ? genreBySlug.get(event.genre) : null;

  const sameCityEvents = await getPublicEvents({ limit: 6, city: event.city });
  const related = sameCityEvents
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);

  const description =
    event.description ??
    `${event.name} acontece no ${event.venue}, em ${event.city}. ${event.dateLabel}.`;

  const address = event.address ?? `${event.venue} — ${event.city}`;

  return (
    <>
      <JsonLd
        data={[
          eventSchema(event),
          faqSchema(faq),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Eventos", path: "/eventos" },
            { name: event.name, path: `/evento/${event.slug}` },
          ]),
        ]}
      />
      {/* Hero */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: event.gradient }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-void/60 to-void" />
        <Container size="lg" className="relative py-10 md:py-14">
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-2 text-xs text-text-muted mb-8"
          >
            <Link
              href="/"
              className="hover-real:text-text-primary transition-colors duration-200"
            >
              Início
            </Link>
            <ChevronRight size={12} className="text-text-subtle" />
            <Link
              href="/eventos"
              className="hover-real:text-text-primary transition-colors duration-200"
            >
              Eventos
            </Link>
            <ChevronRight size={12} className="text-text-subtle" />
            <span className="text-text-secondary">{event.name}</span>
          </nav>

          <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {event.maisVanta && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-semibold uppercase tracking-[0.18em] bg-gold text-black">
                    <Crown size={10} strokeWidth={2.5} />
                    Mais Vanta
                  </span>
                )}
                {genre && (
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[0.6rem] font-semibold uppercase tracking-[0.18em]",
                      genre.badgeClass
                    )}
                  >
                    {genre.label}
                  </span>
                )}
                {event.status === "lowStock" && (
                  <span className="px-3 py-1 rounded-full text-[0.6rem] font-semibold uppercase tracking-[0.18em] bg-warning/15 border border-warning/40 text-warning">
                    Últimas vagas
                  </span>
                )}
                {event.status === "endingSoon" && (
                  <span className="px-3 py-1 rounded-full text-[0.6rem] font-semibold uppercase tracking-[0.18em] bg-error/15 border border-error/40 text-error">
                    Acaba em breve
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl leading-[1] mb-7">
                {event.name}
              </h1>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-text-secondary mb-9 max-w-xl">
                <Info icon={Calendar} label={event.dateLabel} />
                <Info icon={MapPin} label={`${event.venue}, ${event.city}`} />
                <Info icon={Clock} label={event.dateISO ? `Abertura ${new Date(event.dateISO).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "numeric", minute: "2-digit" })}` : "Horário a confirmar"} />
                <Info icon={Users} label="Documento original na entrada" />
              </div>

            </div>

            <div
              className="relative aspect-[4/5] rounded-2xl border border-white/10 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              style={{ background: event.gradient }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="kicker text-[0.65rem] mb-1">{event.dateLabel}</p>
                <p className="font-display text-xl">{event.name}</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="lg" className="py-16">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-14">
          <div className="space-y-14">
            {/* Sobre */}
            <section>
              <span className="kicker mb-3 inline-block">sobre o rolê</span>
              <h2 className="text-2xl md:text-3xl mb-5">
                O que você vai achar lá.
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {description}
              </p>
            </section>

            {/* Localização */}
            <section>
              <span className="kicker mb-3 inline-block">localização</span>
              <h2 className="text-2xl md:text-3xl mb-5">Como chegar.</h2>
              <div className="rounded-2xl overflow-hidden border border-white/5 bg-card">
                {event.lat != null && event.lng != null ? (
                  <EventLocationMap
                    lat={event.lat}
                    lng={event.lng}
                    venue={event.venue}
                  />
                ) : (
                  <div
                    className="aspect-[16/9] flex items-center justify-center"
                    style={{ background: event.gradient }}
                  >
                    <MapPin size={32} className="text-gold" />
                  </div>
                )}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">{event.venue}</p>
                    <p className="text-xs text-text-muted">{address}</p>
                  </div>
                  {event.lat != null && event.lng != null && (
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gold hover-real:underline flex items-center gap-1 shrink-0"
                    >
                      Abrir no Maps
                      <ChevronRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </section>

            {/* Regras */}
            <section>
              <span className="kicker mb-3 inline-block">regras da casa</span>
              <ul className="space-y-2">
                {[
                  "Documento original obrigatório na entrada",
                  "Não é permitida a entrada de bebidas de fora",
                  "Ingresso é pessoal e intransferível fora do app VANTA",
                  "Em caso de cancelamento, reembolso em até 7 dias",
                ].map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <Check
                      size={14}
                      className="text-gold mt-1 shrink-0"
                      strokeWidth={2.5}
                    />
                    {r}
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ */}
            <section>
              <span className="kicker mb-3 inline-block">perguntas</span>
              <h2 className="text-2xl md:text-3xl mb-5">
                O que costumam perguntar.
              </h2>
              <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
                {faq.map((item, i) => (
                  <details
                    key={item.q}
                    className={cn(
                      "group",
                      i > 0 && "border-t border-white/5"
                    )}
                  >
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover-real:bg-elevated/50 transition-colors duration-200 list-none">
                      <span className="text-sm font-medium">{item.q}</span>
                      <ChevronRight
                        size={14}
                        className="text-text-muted transition-transform group-open:rotate-90 shrink-0"
                      />
                    </summary>
                    <p className="px-5 pb-5 text-sm text-text-muted leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl bg-card border border-white/5 p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="kicker">ingressos</span>
                  {loteAtivo && lotes.length > 1 && (
                    <span className="text-[0.6rem] text-text-muted uppercase tracking-widest">
                      {loteAtivo.nome}
                    </span>
                  )}
                </div>

                {loteAtivo && loteAtivo.variacoes.length > 0 ? (
                  <div className="space-y-3">
                    {loteAtivo.variacoes.map((v) => {
                      const esgotado = v.vendidos >= v.limite;
                      const disponivel = Math.max(0, v.limite - v.vendidos);
                      const poucos =
                        !esgotado && disponivel <= Math.ceil(v.limite * 0.2);
                      const soldPct =
                        v.limite > 0
                          ? Math.round((v.vendidos / v.limite) * 100)
                          : 0;
                      const areaLabel =
                        v.area === "OUTRO" && v.area_custom
                          ? v.area_custom
                          : v.area;
                      const generoLabel =
                        v.genero === "UNISEX"
                          ? ""
                          : v.genero === "MASCULINO"
                            ? " · Masc"
                            : " · Fem";

                      return (
                        <div
                          key={v.id}
                          className={cn(
                            "rounded-xl border p-4 transition-colors duration-200",
                            esgotado
                              ? "border-white/5 bg-elevated/20 opacity-60"
                              : v.requer_comprovante
                                ? "border-info/30 bg-info/[0.03]"
                                : "border-white/5 bg-elevated/40 hover-real:border-white/15"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold">
                                  {areaLabel}
                                  {generoLabel}
                                </p>
                                {v.requer_comprovante && (
                                  <span className="text-[0.55rem] uppercase tracking-[0.14em] bg-info/15 text-info px-2 py-0.5 rounded-full font-semibold">
                                    Meia
                                  </span>
                                )}
                              </div>
                            </div>
                            <span
                              className={cn(
                                "text-sm font-semibold whitespace-nowrap",
                                esgotado
                                  ? "text-text-muted line-through"
                                  : "text-gold"
                              )}
                            >
                              {v.valor === 0
                                ? "Grátis"
                                : `R$ ${v.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden mr-4">
                              <div
                                className={cn(
                                  "h-full",
                                  esgotado
                                    ? "bg-error"
                                    : poucos
                                      ? "bg-warning"
                                      : "bg-gold/80"
                                )}
                                style={{ width: `${Math.min(soldPct, 100)}%` }}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-[0.65rem] kicker",
                                esgotado
                                  ? "text-error"
                                  : poucos
                                    ? "text-warning"
                                    : "text-text-muted"
                              )}
                            >
                              {esgotado
                                ? "Esgotado"
                                : poucos
                                  ? `Últimos ${disponivel}`
                                  : `${disponivel} restantes`}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Last batch warning */}
                    {lotes.length > 1 &&
                      loteAtivo.ordem === lotes[lotes.length - 1]?.ordem && (
                        <p className="text-[0.65rem] text-warning text-center font-semibold uppercase tracking-widest">
                          Último lote
                        </p>
                      )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-text-muted mb-2">A partir de</p>
                    <p className="text-3xl font-semibold text-gold mb-4">
                      {event.priceLabel}
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-white/5">
                  {isLoggedIn ? (
                    <Button href={`/checkout/${slug}`} className="w-full" size="lg">
                      Garantir ingresso
                    </Button>
                  ) : (
                    <Button href={`/entrar?next=/checkout/${slug}`} className="w-full" size="lg">
                      Entrar pra comprar
                    </Button>
                  )}
                  <p className="text-xs text-text-muted text-center mt-3">
                    Pagamento seguro. Ingresso entra direto na sua carteira.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-card to-midnight p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TicketIcon size={14} className="text-gold" />
                  <span className="kicker">mais vanta</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Membros Mais Vanta têm benefícios automáticos no checkout e
                  prioridade em novos lotes. A casa libera, você aproveita.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 border-t border-white/5 bg-midnight">
          <Container size="lg">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div>
                <span className="kicker mb-3 inline-block">
                  se curtiu esse
                </span>
                <h2 className="text-3xl md:text-4xl leading-tight">
                  Outras noites na sua vibe.
                </h2>
              </div>
              <Link
                href="/eventos"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-text-secondary hover-real:text-gold transition-colors duration-200"
              >
                Ver todos
                <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>

            <div className="mt-12 flex items-center justify-start">
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover-real:text-text-primary transition-colors duration-200"
              >
                <ArrowLeft size={14} />
                Voltar pra lista de eventos
              </Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function Info({
  icon: Icon,
  label,
}: {
  icon: typeof Calendar;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-gold shrink-0" />
      <span>{label}</span>
    </div>
  );
}
