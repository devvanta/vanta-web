"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
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
import { createClient } from "@/lib/supabase/client";

type Tab = "ativos" | "historico" | "cortesias";

type RealTicket = {
  id: string;
  eventoNome: string;
  eventoLocal: string;
  eventoFoto: string | null;
  eventoDataInicio: string;
  variacaoLabel: string;
  valor: number;
  status: string;
  emitidoEm: string;
  usadoEm: string | null;
  codigoQR: string | null;
  origem: string | null;
};

export default function CarteiraPage() {
  const [tab, setTab] = useState<Tab>("ativos");
  const [tickets, setTickets] = useState<RealTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadTickets() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("tickets_caixa")
        .select(
          `
          id, evento_id, variacao_id, valor, status, criado_em, usado_em, codigo_qr, origem,
          eventos_admin ( nome, data_inicio, data_fim, local, foto ),
          variacoes_ingresso ( area, area_custom, genero )
        `
        )
        .eq("owner_id", user.id)
        .order("criado_em", { ascending: false })
        .limit(200);

      if (error || !data) {
        setLoading(false);
        return;
      }

      setTickets(
        data.map((row) => {
          const ev = row.eventos_admin as {
            nome?: string;
            data_inicio?: string;
            local?: string;
            foto?: string;
          } | null;
          const vi = row.variacoes_ingresso as {
            area?: string;
            area_custom?: string;
            genero?: string;
          } | null;
          const area = vi
            ? vi.area === "OUTRO"
              ? (vi.area_custom ?? "Outro")
              : (vi.area ?? "")
            : "";
          const genero = vi
            ? vi.genero === "MASCULINO"
              ? "Masc."
              : vi.genero === "FEMININO"
                ? "Fem."
                : ""
            : "";
          return {
            id: row.id,
            eventoNome: ev?.nome ?? "Evento",
            eventoLocal: ev?.local ?? "",
            eventoFoto: ev?.foto ?? null,
            eventoDataInicio: ev?.data_inicio ?? row.criado_em,
            variacaoLabel: [area, genero].filter(Boolean).join(" · "),
            valor: Number(row.valor ?? 0),
            status: row.status as string,
            emitidoEm: row.criado_em,
            usadoEm: row.usado_em ?? null,
            codigoQR: (row.codigo_qr as string) ?? null,
            origem: (row.origem as string) ?? null,
          };
        })
      );
      setLoading(false);
    }

    loadTickets();
  }, []);

  const cortesias = tickets.filter((t) => t.origem === "CORTESIA");
  const nonCortesia = tickets.filter((t) => t.origem !== "CORTESIA");
  const active = nonCortesia.filter(
    (t) => t.status === "DISPONIVEL" || t.status === "ATIVO"
  );
  const history = nonCortesia.filter(
    (t) => t.status === "USADO" || t.status === "TRANSFERIDO" || t.status === "CANCELADO"
  );

  function formatDate(iso: string) {
    const d = new Date(iso);
    const parts = d.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const hora = d.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "numeric",
    });
    return `${parts} · ${hora}`;
  }

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
                : "text-text-muted border-transparent hover-real:text-text-primary"
            )}
          >
            {t === "ativos" && `Ativos · ${active.length}`}
            {t === "historico" && `Histórico · ${history.length}`}
            {t === "cortesias" && `Cortesias · ${cortesias.length}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">
          Carregando ingressos...
        </div>
      ) : (
        <>
          {/* Ativos */}
          {tab === "ativos" && (
            active.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
                <Ticket size={24} className="text-gold mx-auto mb-4" />
                <h3 className="text-lg mb-2">Nenhum ingresso ativo</h3>
                <p className="text-text-muted text-sm mb-4">
                  Quando você comprar um ingresso, ele aparece aqui.
                </p>
                <Link
                  href="/eventos"
                  className="text-sm text-gold hover-real:underline"
                >
                  Ver eventos
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {active.map((t) => (
                  <TicketCard key={t.id} t={t} formatDate={formatDate} />
                ))}
              </div>
            )
          )}

          {/* Histórico */}
          {tab === "historico" && (
            history.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
                <p className="text-text-muted text-sm">Nenhum histórico ainda.</p>
              </div>
            ) : (
              <ul className="rounded-2xl border border-white/5 bg-card overflow-hidden">
                {history.map((h, i) => (
                  <li
                    key={h.id}
                    className={cn(
                      "p-5 flex items-center gap-4",
                      i > 0 && "border-t border-white/5"
                    )}
                  >
                    <div
                      className="h-10 w-10 rounded-xl shrink-0 overflow-hidden"
                      style={{
                        background: h.eventoFoto
                          ? `url(${h.eventoFoto}) center/cover`
                          : "linear-gradient(135deg, rgba(255,211,0,0.15), #080604)",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {h.eventoNome}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {h.eventoLocal} · {formatDate(h.eventoDataInicio)}
                      </p>
                    </div>
                    {h.status === "USADO" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <Check size={12} />
                        Check-in
                      </span>
                    ) : h.status === "TRANSFERIDO" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-info">
                        <Send size={12} />
                        Transferido
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">
                        {h.status}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )
          )}

          {/* Cortesias */}
          {tab === "cortesias" && (
            cortesias.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
                <Gift size={24} className="text-gold mx-auto mb-4" />
                <h3 className="text-lg mb-2">Nenhuma cortesia</h3>
                <p className="text-text-muted text-sm">
                  Cortesias recebidas de casas parceiras e do Mais Vanta aparecem aqui.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {cortesias.map((t) => (
                  <TicketCard key={t.id} t={t} formatDate={formatDate} />
                ))}
              </div>
            )
          )}
        </>
      )}

      {/* Security tip */}
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

function TicketCard({
  t,
  formatDate,
}: {
  t: RealTicket;
  formatDate: (iso: string) => string;
}) {
  const gradient = t.eventoFoto
    ? `url(${t.eventoFoto}) center/cover`
    : "radial-gradient(circle at 30% 20%, rgba(255,211,0,0.32), transparent 55%), linear-gradient(140deg, #2a1d0a, #080604)";

  return (
    <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
      <div className="relative h-40" style={{ background: gradient }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <p className="kicker text-[0.6rem] mb-1">
            {formatDate(t.eventoDataInicio)}
          </p>
          <p className="font-display text-base leading-tight">
            {t.eventoNome}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-text-muted mb-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-gold" />
            {t.eventoLocal}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-gold" />
            {formatDate(t.eventoDataInicio)}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <p className="kicker text-[0.55rem] mb-1">ingresso</p>
            <p className="text-sm font-semibold mb-1 truncate">
              {t.variacaoLabel || "Geral"}
            </p>
            <p className="text-xs text-text-muted">
              {t.valor === 0
                ? "Cortesia"
                : `R$ ${t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            </p>
          </div>
        </div>

        <p className="text-xs text-text-muted text-center pt-2">
          QR e transferência disponíveis no app
        </p>
      </div>
    </div>
  );
}
