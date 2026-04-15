"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Crown,
  Gift,
  Heart,
  MapPin,
  Sparkles,
  Star,
  Ticket,
  Users,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const perks = [
  {
    icon: Gift,
    title: "Cortesias exclusivas",
    body: "Ingressos de cortesia liberados por casas parceiras. Você recebe no app e usa sem papo.",
  },
  {
    icon: Ticket,
    title: "Entrada gratuita",
    body: "Acesso sem pagar em eventos selecionados da sua cidade. Aparece direto no seu feed.",
  },
  {
    icon: Users,
    title: "Fila exclusiva",
    body: "Entrada antecipada nos eventos. Sem fila, sem espera, sem pressão.",
  },
  {
    icon: MapPin,
    title: "Passaporte regional",
    body: "Benefícios válidos em várias capitais. Mesmo perfil, rede em expansão.",
  },
  {
    icon: Heart,
    title: "Acompanhantes com benefício",
    body: "Slots extras pra levar seu grupo. Quem vai com você também entra no combo.",
  },
  {
    icon: Star,
    title: "Prioridade em lotes novos",
    body: "Quando uma casa abre um lote, membros veem primeiro. Você escolhe antes da fila geral.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Aplicação ou convite",
    body: "Preencha o formulário ou peça indicação pra um membro. A casa ou o time VANTA aprova conforme o perfil.",
  },
  {
    step: "02",
    title: "Perfil conectado",
    body: "Sua conta ganha selo Mais Vanta. Benefícios aparecem automaticamente em eventos compatíveis.",
  },
  {
    step: "03",
    title: "Use no rolê",
    body: "Chegou na casa parceira? Abra o app. Cortesia aplicada, fila expressa, benefícios no checkout.",
  },
];

const faq = [
  {
    q: "Preciso pagar pra ser Mais Vanta?",
    a: "Não. A entrada no clube é por aplicação ou convite. O programa é gratuito; as casas parceiras bancam os benefícios.",
  },
  {
    q: "Os benefícios aparecem em todo evento?",
    a: "Não. Cada casa decide quais benefícios oferece em quais eventos. Aparece no app quando se aplica.",
  },
  {
    q: "Por que o programa tem infrações?",
    a: "Pra quem recebe cortesia mas não comparece, ou quem combinou de postar e não postou, aplicamos restrições temporárias. É o que mantém o clube funcionando pras casas que confiam.",
  },
  {
    q: "Dá pra levar acompanhante?",
    a: "Sim. Slots extras dependem do evento. A casa define quantos acompanhantes entram com você nos benefícios.",
  },
  {
    q: "Como funciona em outras cidades?",
    a: "O passaporte regional estende seus benefícios pras capitais onde a VANTA tem casas parceiras. Mesma conta, mesma identidade.",
  },
];

export default function MaisVantaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    instagram: "",
    cidade: "",
    motivo: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(255,211,0,0.18), transparent 60%)",
          }}
        />
        <Container size="lg" className="relative py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gold/15 border border-gold/40"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,211,0,0.4))" }}
              >
                <Crown size={18} className="text-gold" strokeWidth={2.5} />
              </span>
              <span className="kicker">o clube mais vanta</span>
            </div>
            <h1 className="text-5xl md:text-7xl leading-[0.95] mb-6">
              Benefícios reais <span className="text-gold">em rolês reais</span>.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
              MAIS VANTA é o clube de quem sai com frequência. Membros recebem
              cortesias, prioridade e acesso exclusivo em casas parceiras — tudo
              automático, tudo no app.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="#aplicar" size="lg">
                Quero fazer parte
                <ArrowRight size={16} />
              </Button>
              <Button href="#como-funciona" variant="ghost" size="lg">
                Como funciona
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Perks */}
      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="max-w-2xl mb-14">
            <span className="kicker mb-3 inline-block">o que você ganha</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-4">
              6 benefícios <span className="text-gold">automáticos</span>.
            </h2>
            <p className="text-text-secondary text-lg">
              Você não precisa ativar nada. Entrou no clube, os benefícios
              aparecem direto nos eventos compatíveis.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map((p) => (
              <div
                key={p.title}
                className="p-7 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200"
              >
                <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-5">
                  <p.icon size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg mb-3 leading-tight">{p.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Como funciona */}
      <section
        id="como-funciona"
        className="py-20 md:py-28 bg-midnight border-y border-white/5"
      >
        <Container size="lg">
          <div className="max-w-2xl mb-14">
            <span className="kicker mb-3 inline-block">como entra</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-4">
              3 passos. <span className="text-gold">Sem mistério</span>.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {howItWorks.map((s) => (
              <div
                key={s.step}
                className="relative p-8 rounded-2xl bg-card border border-white/5"
              >
                <span className="kicker mb-5 inline-block">{s.step}</span>
                <h3 className="text-xl mb-3 leading-tight">{s.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <Container size="sm">
          <div className="mb-10">
            <span className="kicker mb-3 inline-block">perguntas</span>
            <h2 className="text-3xl md:text-5xl leading-tight">
              O que mais <span className="text-gold">perguntam</span>.
            </h2>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
            {faq.map((item, i) => (
              <details
                key={item.q}
                className={cn("group", i > 0 && "border-t border-white/5")}
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer hover-real:bg-elevated/50 transition-colors duration-200 list-none">
                  <span className="text-sm font-medium">{item.q}</span>
                  <ChevronRight
                    size={14}
                    className="text-text-muted transition-transform group-open:rotate-90 shrink-0"
                  />
                </summary>
                <p className="px-6 pb-6 text-sm text-text-muted leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Formulário */}
      <section id="aplicar" className="py-20 md:py-28">
        <Container size="sm">
          <div
            className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-card to-midnight p-10 md:p-14 glow-gold"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, rgba(255,211,0,0.2), transparent 55%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles size={18} className="text-gold" />
                <span className="kicker">aplicação</span>
              </div>
              <h2 className="text-3xl md:text-4xl leading-tight mb-4">
                Quero fazer parte.
              </h2>
              <p className="text-text-secondary text-base mb-8 max-w-lg">
                Preenche os dados abaixo. O time VANTA (ou uma casa parceira)
                analisa em até 72 horas.
              </p>

              {submitted ? (
                <div className="rounded-2xl border border-success/30 bg-success/10 p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-success/20 border border-success/40 flex items-center justify-center text-success shrink-0">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Aplicação enviada!</p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Você receberá um e-mail em até 72h. Enquanto isso, já
                      pode explorar os eventos da sua cidade.
                    </p>
                    <Link
                      href="/eventos"
                      className="inline-flex items-center gap-1 text-sm text-gold hover-real:underline mt-3"
                    >
                      Ver eventos
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field
                    label="Nome completo"
                    type="text"
                    required
                    value={form.nome}
                    onChange={(v) => setForm({ ...form, nome: v })}
                    placeholder="Como você se apresenta"
                  />
                  <Field
                    label="E-mail"
                    type="email"
                    required
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="seu@email.com"
                  />
                  <Field
                    label="Instagram (pra verificação)"
                    type="text"
                    required
                    value={form.instagram}
                    onChange={(v) => setForm({ ...form, instagram: v })}
                    placeholder="@seuusuario"
                  />
                  <Field
                    label="Cidade"
                    type="text"
                    required
                    value={form.cidade}
                    onChange={(v) => setForm({ ...form, cidade: v })}
                    placeholder="Rio de Janeiro"
                  />
                  <div>
                    <label className="ui-label block mb-2">
                      Por que você quer entrar?
                    </label>
                    <textarea
                      value={form.motivo}
                      onChange={(e) =>
                        setForm({ ...form, motivo: e.target.value })
                      }
                      rows={4}
                      placeholder="Conte o que te conecta com a cena e por que o clube faz sentido pra você."
                      className="w-full bg-input border border-white/5 rounded-xl px-4 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200 resize-none"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" size="lg">
                      Enviar aplicação
                      <ArrowRight size={16} />
                    </Button>
                    <p className="text-xs text-text-muted">
                      Aprovação em até 72h
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="mt-10 flex items-start gap-3 text-sm text-text-muted">
            <Zap size={14} className="text-gold shrink-0 mt-0.5" />
            <p>
              Já tem convite de um membro? Abra o link que você recebeu no app —
              a aplicação fica pré-aprovada e sai na hora.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type: "text" | "email";
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
