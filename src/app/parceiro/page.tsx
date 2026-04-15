"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  ScanLine,
  Sparkles,
  TicketCheck,
  UserCog,
  Users,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pains = [
  {
    title: "Perdi o controle da lista no WhatsApp",
    body: "Planilha, print, grupo só pra lista. Na porta ninguém confere direito.",
  },
  {
    title: "Taxa da Sympla come margem",
    body: "~10-12% de taxa, gateway por cima, ainda leva 14 dias pra receber.",
  },
  {
    title: "Reembolso virou pesadelo",
    body: "Cliente chia, produtor banca do bolso, chargeback sem trilha.",
  },
  {
    title: "Não sei quem realmente entrou",
    body: "Porteiro conta no chuto, relatório nunca bate com caixa.",
  },
];

const roles = [
  {
    icon: LayoutDashboard,
    label: "Gerente",
    body: "Acesso total: financeiro, equipe, eventos e comunidade.",
  },
  {
    icon: Building2,
    label: "Sócio",
    body: "Cria e gerencia eventos, vê financeiro dos seus eventos.",
  },
  {
    icon: Users,
    label: "Promoter",
    body: "Gerencia listas e convites, vê relatório de vendas.",
  },
  {
    icon: Banknote,
    label: "Caixa",
    body: "Vende ingressos e registra consumação no evento.",
  },
  {
    icon: ClipboardList,
    label: "Portaria — lista",
    body: "Check-in de convidados da lista na entrada.",
  },
  {
    icon: ScanLine,
    label: "Portaria — antecipado",
    body: "Check-in de ingressos antecipados via QR na entrada.",
  },
];

const flows = [
  {
    title: "Publicação de evento",
    steps: ["Rascunho", "Pendente", "Ativo"],
    note: "Aprovação em 2 etapas. Casa publica, VANTA valida.",
  },
  {
    title: "Reembolso",
    steps: ["Solicitação", "Sócio", "Gerente", "Estorno"],
    note: "Fluxo de 4 etapas com audit log. Stripe refund real no fim.",
  },
  {
    title: "Saque",
    steps: ["Solicitado", "Gerente", "Liberado"],
    note: "Aprovação rápida. Sem travar o fluxo de caixa da casa.",
  },
  {
    title: "Parceria",
    steps: ["Solicitação", "Aprovação"],
    note: "Nova casa entra em 2 etapas com suporte do time VANTA.",
  },
];

const perks = [
  "Taxa mais baixa que Sympla e Ingresse",
  "Splits automáticos entre casa, promoter e artista",
  "Cortesias com cota configurável por evento",
  "Lista no app, sem planilha no WhatsApp",
  "Caixa na porta com PIX e crédito",
  "Eventos recorrentes (semanal, quinzenal, mensal)",
  "Stripe Connect pra receber direto",
  "Relatório real de quem entrou",
  "Chargeback com trilha de auditoria",
];

export default function ParceiroPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    casa: "",
    cnpj: "",
    responsavel: "",
    email: "",
    whatsapp: "",
    cidade: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("parceiros_solicitacoes")
        .insert({
          nome_casa: form.casa,
          cnpj: form.cnpj,
          responsavel: form.responsavel,
          email: form.email,
          whatsapp: form.whatsapp,
          cidade: form.cidade,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
      }
      setSubmitted(true);
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, rgba(255,211,0,0.14), transparent 60%)",
          }}
        />
        <Container size="lg" className="relative py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 text-gold">
                <Building2 size={18} />
              </span>
              <span className="kicker">pra quem produz</span>
            </div>
            <h1 className="text-5xl md:text-7xl leading-[0.95] mb-6">
              A casa cheia. <span className="text-gold">Sem a dor</span>.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
              Painel multi-tenant com RBAC real. Cada função vê só o que precisa
              ver. Você controla tudo — da portaria ao financeiro — num só
              lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="#cadastrar" size="lg">
                Cadastrar minha casa
                <ArrowRight size={16} />
              </Button>
              <Button href="#cargos" variant="ghost" size="lg">
                Ver os cargos
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Dores */}
      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="max-w-2xl mb-14">
            <span className="kicker mb-3 inline-block">por que trocar</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-4">
              Você já viveu <span className="text-gold">isso</span>.
            </h2>
            <p className="text-text-secondary text-lg">
              As dores que toda produção de rolê carioca conhece. A VANTA nasceu
              pra cortar cada uma.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {pains.map((p) => (
              <div
                key={p.title}
                className="p-7 rounded-2xl bg-card border border-white/5"
              >
                <h3 className="text-lg mb-3 leading-tight">{p.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Cargos */}
      <section
        id="cargos"
        className="py-20 md:py-28 bg-midnight border-y border-white/5"
      >
        <Container size="lg">
          <div className="max-w-2xl mb-14">
            <span className="kicker mb-3 inline-block">rbac por cargo</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-4">
              6 funções, <span className="text-gold">1 painel</span>.
            </h2>
            <p className="text-text-secondary text-lg">
              Cada pessoa vê só o que cabe a ela. Cascata automática da
              comunidade pros eventos filhos.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => (
              <div
                key={r.label}
                className="p-6 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                    <r.icon size={18} />
                  </div>
                  <span className="kicker">{r.label}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fluxos */}
      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="max-w-2xl mb-14">
            <span className="kicker mb-3 inline-block">fluxos</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-4">
              Cada decisão tem <span className="text-gold">trilha</span>.
            </h2>
            <p className="text-text-secondary text-lg">
              Aprovação em etapas, audit log em tudo. Quem aprovou, quando e por
              quê — sempre rastreável.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {flows.map((f) => (
              <div
                key={f.title}
                className="p-7 rounded-2xl bg-card border border-white/5"
              >
                <h3 className="text-lg mb-5 leading-tight">{f.title}</h3>
                <ol className="flex items-center gap-2 mb-4 flex-wrap">
                  {f.steps.map((s, i) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-xs text-text-secondary"
                    >
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-full font-semibold uppercase tracking-[0.14em]",
                          i === f.steps.length - 1
                            ? "bg-gold text-black"
                            : "bg-elevated border border-white/5",
                        )}
                      >
                        {s}
                      </span>
                      {i < f.steps.length - 1 && (
                        <ChevronRight
                          size={12}
                          className="text-text-muted shrink-0"
                        />
                      )}
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-text-muted leading-relaxed">
                  {f.note}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Perks */}
      <section className="py-20 md:py-28 bg-midnight border-y border-white/5">
        <Container size="lg">
          <div className="grid md:grid-cols-[1fr_1.3fr] gap-14 items-center">
            <div>
              <span className="kicker mb-3 inline-block">
                o que muda na prática
              </span>
              <h2 className="text-3xl md:text-5xl leading-tight mb-5">
                Casa mais cheia, <span className="text-gold">margem mais alta</span>.
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-7">
                Taxa cascata configurável, splits automáticos, gateway mode
                (absorver ou repassar), Stripe Connect direto no nome do CNPJ.
              </p>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <Sparkles size={14} className="text-gold" />
                <span>Sem setup técnico — a gente onboarda sua casa</span>
              </div>
            </div>

            <ul className="grid sm:grid-cols-2 gap-3">
              {perks.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-white/5"
                >
                  <Zap
                    size={14}
                    className="text-gold shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span className="text-sm text-text-secondary leading-relaxed">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Formulário */}
      <section id="cadastrar" className="py-20 md:py-28">
        <Container size="sm">
          <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-card to-midnight p-10 md:p-14 glow-gold">
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, rgba(255,211,0,0.2), transparent 55%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <TicketCheck size={18} className="text-gold" />
                <span className="kicker">cadastro de casa</span>
              </div>
              <h2 className="text-3xl md:text-4xl leading-tight mb-4">
                Vamos conversar.
              </h2>
              <p className="text-text-secondary text-base mb-8 max-w-lg">
                Preencha os dados e o time VANTA retorna em até 2 dias úteis pra
                onboarding da sua casa.
              </p>

              {submitted ? (
                <div className="rounded-2xl border border-success/30 bg-success/10 p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-success/20 border border-success/40 flex items-center justify-center text-success shrink-0">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Cadastro recebido!</p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      O time VANTA entra em contato em até 2 dias úteis pra
                      alinhar onboarding.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field
                    label="Nome da casa / produtora"
                    value={form.casa}
                    onChange={(v) => setForm({ ...form, casa: v })}
                    placeholder="Bosque Bar"
                    required
                  />
                  <Field
                    label="CNPJ"
                    value={form.cnpj}
                    onChange={(v) => setForm({ ...form, cnpj: v })}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field
                      label="Responsável"
                      value={form.responsavel}
                      onChange={(v) => setForm({ ...form, responsavel: v })}
                      placeholder="Quem assina"
                      required
                    />
                    <Field
                      label="Cidade"
                      value={form.cidade}
                      onChange={(v) => setForm({ ...form, cidade: v })}
                      placeholder="Rio de Janeiro"
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field
                      label="E-mail"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      placeholder="contato@suacasa.com"
                      required
                    />
                    <Field
                      label="WhatsApp"
                      value={form.whatsapp}
                      onChange={(v) => setForm({ ...form, whatsapp: v })}
                      placeholder="(21) 9xxxx-xxxx"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" size="lg">
                      Solicitar onboarding
                      <ArrowRight size={16} />
                    </Button>
                    <p className="text-xs text-text-muted">
                      Retorno em 2 dias úteis
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="mt-10 flex items-start gap-3 text-sm text-text-muted">
            <UserCog size={14} className="text-gold shrink-0 mt-0.5" />
            <p>
              Já é parceiro? Acesse diretamente pelo{" "}
              <Link
                href="/admin"
                className="text-gold hover-real:underline"
              >
                painel admin
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: "text" | "email";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="ui-label block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-input border border-white/5 rounded-xl px-4 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
      />
    </div>
  );
}
