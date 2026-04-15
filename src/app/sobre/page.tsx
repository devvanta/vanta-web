import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Crown,
  Heart,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Target,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Compass,
    title: "Discovery primeiro",
    body: "Descobrir o que rolar vem antes de comprar ingresso. Por isso o app começa no Radar, não no checkout.",
  },
  {
    icon: Heart,
    title: "Relacional, não transacional",
    body: "Marketplace genérico trata você como CPF. A gente te trata como alguém que sai, indica e volta.",
  },
  {
    icon: Target,
    title: "Dor de cliente real",
    body: "Planilha que sumiu, lista que não valeu, fila de 1h. Cada feature do app corta uma dessas histórias.",
  },
  {
    icon: Crown,
    title: "Benefício real, não status",
    body: "MAIS VANTA não é selo de vaidade. Dá cortesia, corta fila, abre deal. Benefício vira resultado.",
  },
];

const team = [
  {
    name: "Dan Loures",
    role: "Fundador",
    bio: "Carioca, passou por promoter, produção e casa noturna. VANTA nasceu das dores que ele viveu dos dois lados.",
    gradient:
      "linear-gradient(135deg, rgba(255,211,0,0.25), rgba(28,22,16,0.95))",
  },
  {
    name: "Time de Produto",
    role: "Engenharia",
    bio: "Squad distribuído trabalhando em ciclos curtos. App, painel RBAC e cockpit interno rodando em monorepo.",
    gradient: "linear-gradient(135deg, #211c14, #080604)",
  },
  {
    name: "Casas Parceiras",
    role: "Rede",
    bio: "Casas que entraram cedo e ajudaram a moldar o painel admin pela operação real da noite.",
    gradient:
      "linear-gradient(135deg, rgba(255,140,20,0.20), rgba(26,22,16,0.95))",
  },
];

export default function SobrePage() {
  return (
    <>
      {/* Hero / Manifesto */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(255,211,0,0.16), transparent 60%)",
          }}
        />
        <Container size="sm" className="relative py-20 md:py-28">
          <span className="kicker mb-5 inline-block">manifesto</span>
          <h1 className="text-5xl md:text-7xl leading-[0.95] mb-10">
            A noite começa <span className="text-gold">aqui</span>.
          </h1>
          <div className="space-y-5 text-lg text-text-secondary leading-relaxed">
            <p>
              A gente cansou de pagar caro pra entrar numa festa ruim. Cansou
              de chegar e ter que pagar lista na porta. Cansou de promoter
              sumido quando precisa.
            </p>
            <p>
              A VANTA é o amigo que não some. Tá no seu bolso, 24 horas por
              dia, e sempre sabe o que vale a pena no fim de semana. Não é
              marketplace de ingresso — é uma plataforma completa de vida
              noturna que conecta quem sai, quem produz e quem bota o som.
            </p>
            <p>
              Começou no Rio, tá escalando pras capitais brasileiras. Depois
              internacional. A identidade muda com a cidade; a missão, não.
            </p>
            <p className="text-gold font-semibold">
              Vanta não vende ingresso. Vanta te coloca no rolê certo.
            </p>
          </div>
        </Container>
      </section>

      {/* Valores */}
      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="max-w-2xl mb-14">
            <span className="kicker mb-3 inline-block">o que guia</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-4">
              4 princípios <span className="text-gold">inegociáveis</span>.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-7 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200"
              >
                <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-5">
                  <v.icon size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg mb-3 leading-tight">{v.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Time */}
      <section className="py-20 md:py-28 bg-midnight border-y border-white/5">
        <Container size="lg">
          <div className="max-w-2xl mb-14">
            <span className="kicker mb-3 inline-block">quem faz</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-4">
              Time enxuto, <span className="text-gold">operação ampla</span>.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {team.map((m) => (
              <div
                key={m.name}
                className="p-7 rounded-2xl bg-card border border-white/5"
              >
                <div
                  className="h-16 w-16 rounded-2xl mb-5"
                  style={{ background: m.gradient }}
                />
                <p className="kicker mb-2">{m.role}</p>
                <h3 className="text-lg mb-3 leading-tight">{m.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Presença */}
      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="grid md:grid-cols-[1fr_1.3fr] gap-14 items-center">
            <div>
              <span className="kicker mb-3 inline-block">onde a gente tá</span>
              <h2 className="text-3xl md:text-5xl leading-tight mb-5">
                Comecei no Rio. <br />
                <span className="text-gold">Hoje roda em 8 capitais</span>.
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                Expansão guiada por parcerias de casa real, não anúncio. Entra
                uma casa forte, o clube MAIS VANTA abre na cidade, e a rede
                regional começa a fazer sentido.
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-3">
              {[
                "Rio de Janeiro",
                "São Paulo",
                "Belo Horizonte",
                "Florianópolis",
                "Curitiba",
                "Porto Alegre",
                "Salvador",
                "Recife",
              ].map((c) => (
                <li
                  key={c}
                  className="p-4 rounded-xl bg-card border border-white/5 flex items-center gap-3"
                >
                  <MapPin size={14} className="text-gold shrink-0" />
                  <span className="text-sm font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Contato */}
      <section className="py-20 md:py-28 bg-midnight border-y border-white/5">
        <Container size="sm">
          <div className="text-center mb-10">
            <span className="kicker mb-3 inline-block">contato</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-4">
              Fala com a <span className="text-gold">gente</span>.
            </h2>
            <p className="text-text-secondary text-lg max-w-lg mx-auto">
              Imprensa, parcerias, sugestões ou reclamação honesta — a caixa tá
              aberta.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <ContactCard
              icon={Mail}
              label="E-mail"
              value="contato@maisvanta.com"
              href="mailto:contato@maisvanta.com"
            />
            <ContactCard
              icon={Instagram}
              label="Instagram"
              value="@maisvanta"
              href="https://instagram.com/maisvanta"
            />
            <ContactCard
              icon={MessageCircle}
              label="Suporte"
              value="Chat no app"
              href="/suporte"
            />
          </div>

          <div className="mt-10 text-center">
            <Button href="/parceiro" variant="outline" size="lg">
              Sua casa quer entrar?
              <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="p-6 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200 text-center"
    >
      <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 text-gold mb-4">
        <Icon size={18} />
      </div>
      <p className="kicker text-[0.6rem] mb-1">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </Link>
  );
}
