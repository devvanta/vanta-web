import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Crown,
  Gift,
  Home as HomeIcon,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Radio,
  Search,
  Ticket,
  User,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EventCard, type EventCardData } from "@/components/site/event-card";
import { getPublicEvents } from "@/lib/supabase/queries";
import { VantaIndicaSection } from "@/components/site/vanta-indica-section";

// Fix #177 H1 (2026-04-21): ISR — home pública regenera a cada 60s.
// Reduz TTFB e economiza reads no Supabase. Visitantes anônimos pegam
// sempre a versão em cache (stale-while-revalidate).
export const revalidate = 60;

export default async function Home() {
  const events = await getPublicEvents({ limit: 16 });

  return (
    <>
      <Hero events={events} />
      <EventsShowcase events={events} />
      <VantaIndicaSection />
      <MaisVantaSection />
      <Notifications />
      <ForProducers />
      <AppTabs />
      <FinalCTA />
    </>
  );
}

function Hero({ events }: { events: EventCardData[] }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,211,0,0.18), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,211,0,0.10), transparent 70%)",
          }}
        />
      </div>

      <Container size="lg" className="relative py-24 md:py-36">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div>
            <span className="kicker mb-5 inline-block">
              a noite começa aqui
            </span>
            <h1 className="text-5xl md:text-7xl leading-[0.95] mb-6">
              Viva a noite <span className="text-gold">de verdade</span>.
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed">
              Descubra todas as possibilidades e viva a noite, tudo num só
              lugar. Radar de eventos, amigos e benefícios, na palma da sua mão.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/criar-conta" size="lg">
                Criar conta
                <ArrowRight size={16} />
              </Button>
              <Button href="/eventos" variant="ghost" size="lg">
                Ver eventos
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <MapIcon size={14} className="text-gold" />
                <span>Radar de eventos por perto</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket size={14} className="text-gold" />
                <span>Ingresso direto na carteira</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <HeroMockup events={events} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroMockup({ events }: { events: EventCardData[] }) {
  const preview = events.slice(0, 3);
  const count = events.length;

  return (
    <div className="relative mx-auto w-full max-w-sm aspect-[9/16] rounded-[2.5rem] border border-white/10 bg-card overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 10%, rgba(255,211,0,0.15), transparent 60%), linear-gradient(180deg, #140f08, #080604)",
        }}
      />
      <div className="relative h-full p-5 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-8 rounded-full bg-gold" />
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <div className="h-2 w-2 rounded-full bg-gold" />
          </div>
        </div>
        <p className="kicker text-[0.6rem] mb-3">novos eventos na sua cidade</p>
        <h3 className="text-2xl mb-5 leading-tight">
          {count > 0 ? (
            <>
              Tem <span className="text-gold">{count} eventos</span> pra você.
            </>
          ) : (
            <>
              A noite <span className="text-gold">começa aqui</span>.
            </>
          )}
        </h3>
        <div className="space-y-3">
          {preview.map((e) => (
            <div
              key={e.slug}
              className="flex items-center gap-3 p-3 rounded-xl bg-elevated/70 border border-white/5"
            >
              <div
                className="h-12 w-12 rounded-lg"
                style={{ background: e.gradient }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.name}</p>
                <p className="text-[0.7rem] text-text-muted">{e.dateLabel}</p>
              </div>
              <span className="text-xs font-semibold text-gold">
                {e.priceLabel}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <div className="rounded-xl bg-gold text-black text-center py-3 font-bold uppercase tracking-[0.2em] text-xs">
            Garantir ingresso
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsShowcase({ events }: { events: EventCardData[] }) {
  return (
    <section className="py-20 md:py-28">
      <Container size="lg">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <span className="kicker mb-3 inline-block">esta semana</span>
            <h2 className="text-3xl md:text-5xl leading-tight">
              Novos eventos na sua cidade.
            </h2>
          </div>
          <Link
            href="/eventos"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-text-secondary hover-real:text-gold transition-colors duration-200"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {events.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
            <p className="text-text-muted">
              Nenhum evento publicado ainda. Em breve!
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}

function AppTabs() {
  const tabs = [
    {
      icon: HomeIcon,
      label: "Início",
      title: "Feed da sua cidade",
      body: "Eventos curados, recomendações e trending. A noite começa no scroll.",
      href: "/",
    },
    {
      icon: Radio,
      label: "Radar",
      title: "Mapa interativo",
      body: "Veja o que tá rolando perto de você em tempo real, com filtros por gênero, data e preço.",
      href: "/radar",
    },
    {
      icon: Search,
      label: "Buscar",
      title: "Ache o rolê certo",
      body: "Filtros por gênero musical, data, cidade, preço e distância. Em poucos segundos.",
      href: "/buscar",
    },
    {
      icon: MessageCircle,
      label: "Mensagens",
      title: "Chat com a galera",
      body: "Amizades, chat 1:1 com reactions, status online e archive. Combine o rolê sem sair do app.",
      href: "/mensagens",
    },
    {
      icon: User,
      label: "Perfil",
      title: "Sua carteira, seus amigos",
      body: "Ingressos, histórico, Mais Vanta, privacidade por campo e convites. Tudo no seu nome.",
      href: "/perfil",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-midnight border-y border-white/5">
      <Container size="lg">
        <div className="max-w-2xl mb-14">
          <span className="kicker mb-3 inline-block">o app por dentro</span>
          <h2 className="text-3xl md:text-5xl leading-tight mb-4">
            5 abas, <span className="text-gold">um só lugar</span>.
          </h2>
          <p className="text-text-secondary text-lg">
            Descoberta, compra, carteira, social e benefícios conectados desde o
            primeiro acesso. Clique em qualquer aba pra entrar.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {tabs.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="group relative p-5 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200 flex flex-col cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <t.icon size={18} />
                </div>
                <ArrowRight
                  size={14}
                  className="text-text-muted group-hover:text-gold transition-colors duration-200 mt-1.5"
                />
              </div>
              <span className="kicker mb-2">{t.label}</span>
              <h3 className="text-base mb-2 leading-tight">{t.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {t.body}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function MaisVantaSection() {
  const perks = [
    {
      icon: Gift,
      title: "Cortesias exclusivas",
      body: "Receba ingressos de cortesia para você e seus convidados em eventos selecionados.",
    },
    {
      icon: Ticket,
      title: "Entrada gratuita",
      body: "Entre sem pagar em eventos selecionados da sua cidade.",
    },
    {
      icon: Users,
      title: "Fila exclusiva",
      body: "Entre antecipado no evento. Sem fila, sem espera.",
    },
    {
      icon: MapPin,
      title: "Passaporte regional",
      body: "Explore eventos em outras cidades com os mesmos benefícios.",
    },
  ];
  return (
    <section className="py-20">
      <Container size="lg">
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-card to-midnight p-10 md:p-16 glow-gold">
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, rgba(255,211,0,0.25), transparent 55%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gold/15 border border-gold/40"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(255,211,0,0.4))",
                }}
              >
                <Crown size={18} className="text-gold" strokeWidth={2.5} />
              </span>
              <span className="kicker">bem-vindo ao mais vanta</span>
            </div>

            <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-start">
              <div>
                <h2 className="text-3xl md:text-5xl leading-tight mb-5">
                  Descontos e benefícios <br />
                  <span className="text-gold">exclusivos</span>.
                </h2>
                <p className="text-text-secondary text-lg mb-7 max-w-xl leading-relaxed">
                  Entre para o MAIS VANTA e ganhe descontos e benefícios em
                  casas parceiras. Cortesias, prioridade e passaporte entre
                  cidades — tudo aparece direto no seu app.
                </p>
                <Button href="/mais-vanta" size="md">
                  Quero fazer parte
                  <ArrowRight size={16} />
                </Button>
              </div>

              <ul className="space-y-3">
                {perks.map((p) => (
                  <li
                    key={p.title}
                    className="flex items-start gap-3 p-4 rounded-xl bg-elevated/60 border border-white/5"
                  >
                    <div className="h-9 w-9 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shrink-0">
                      <p.icon size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">{p.title}</p>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Notifications() {
  const pushes = [
    {
      title: "Novo evento na sua cidade",
      body: "Confira os eventos desta semana.",
      when: "agora",
    },
    {
      title: "Você recebeu uma cortesia",
      body: "Cortesia disponível na carteira.",
      when: "há 5min",
    },
    {
      title: "Ingresso transferido",
      body: "Já tá na sua carteira.",
      when: "há 1h",
    },
    {
      title: "Seu evento é amanhã",
      body: "Ingresso na carteira, é só apresentar.",
      when: "há 3h",
    },
    {
      title: "Novos benefícios desbloqueados",
      body: "Confira o que tem de novo pra você no MAIS VANTA.",
      when: "ontem",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-midnight border-y border-white/5">
      <Container size="lg">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-14 items-center">
          <div>
            <span className="kicker mb-3 inline-block">notificações</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-5">
              Saiba <span className="text-gold">em primeira mão</span>.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-7">
              Eventos novos na sua cidade, cortesias que chegaram, ingressos
              transferidos, lembretes do dia — direto no seu celular, no tempo
              certo.
            </p>
            <div className="space-y-2 text-sm text-text-muted">
              <p className="flex items-center gap-2">
                <Bell size={14} className="text-gold shrink-0" />
                Push nativo (Android, iOS em breve) e web
              </p>
              <p className="flex items-center gap-2">
                <Zap size={14} className="text-gold shrink-0" />
                Deep links diretos para evento, perfil ou convite
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-6 rounded-3xl blur-2xl opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,211,0,0.15), transparent 70%)",
              }}
            />
            <ul className="relative space-y-3">
              {pushes.map((p, i) => (
                <li
                  key={p.title}
                  className="glass-premium rounded-2xl p-4 flex items-start gap-3"
                  style={{
                    transform: `translateX(${i % 2 === 0 ? "0" : "1.25rem"})`,
                  }}
                >
                  <div className="h-9 w-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                    <Bell size={14} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold truncate">
                        {p.title}
                      </p>
                      <span className="text-[0.65rem] text-text-subtle shrink-0">
                        {p.when}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ForProducers() {
  const roles = [
    {
      label: "Gerente",
      body: "Acesso total: financeiro, equipe, eventos e comunidade.",
    },
    {
      label: "Sócio",
      body: "Cria e gerencia eventos, vê financeiro dos seus eventos.",
    },
    {
      label: "Promoter",
      body: "Gerencia listas e convites, vê relatório de vendas.",
    },
    {
      label: "Caixa",
      body: "Vende ingressos e registra consumação no evento.",
    },
    {
      label: "Portaria — lista",
      body: "Check-in de convidados da lista na entrada.",
    },
    {
      label: "Portaria — antecipado",
      body: "Check-in de ingressos antecipados na entrada.",
    },
  ];
  return (
    <section className="py-20 md:py-28">
      <Container size="lg">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="kicker mb-3 inline-block">pra quem produz</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-5">
              Atraia criadores <br />
              <span className="text-gold">verificados</span> pros seus eventos.
            </h2>
            <p className="text-text-secondary text-lg mb-7 leading-relaxed">
              Painel multi-tenant com RBAC por cargo. Cada função enxerga
              exatamente o que precisa — do financeiro à portaria, da lista ao
              caixa.
            </p>
            <Button href="/parceiro" variant="outline" size="lg">
              Cadastrar casa
              <ArrowRight size={16} />
            </Button>
          </div>

          <ul className="grid sm:grid-cols-2 gap-3">
            {roles.map((r) => (
              <li
                key={r.label}
                className="p-4 rounded-xl bg-card border border-white/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap
                    size={12}
                    className="text-gold shrink-0"
                    strokeWidth={2.5}
                  />
                  <span className="kicker">{r.label}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {r.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24">
      <Container size="sm">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl leading-tight mb-5">
            Sua noite nunca mais{" "}
            <span className="text-gold">vai ser a mesma</span>.
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Crie sua conta e aproveite tudo que a noite tem de melhor.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/criar-conta" size="lg">
              Criar conta
              <ArrowRight size={16} />
            </Button>
            <Button href="/eventos" variant="ghost" size="lg">
              Ver eventos
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
