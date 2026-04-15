"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Tag,
  Ticket,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Variacao = {
  id: string;
  area: string;
  area_custom: string | null;
  genero: string;
  valor: number;
  limite: number;
  vendidos: number;
  requer_comprovante: boolean;
};

type Evento = {
  id: string;
  nome: string;
  data_inicio: string;
  local: string;
  foto: string | null;
  classificacao_etaria: string;
};

type Lote = {
  id: string;
  nome: string;
  ativo: boolean;
  ordem: number;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${dias[d.getDay()]} · ${d.getDate()} ${meses[d.getMonth()]} · ${d.getHours()}h`;
}

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [lote, setLote] = useState<Lote | null>(null);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [quantidades, setQuantidades] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [needsCpf, setNeedsCpf] = useState(false);
  const [needsTelefone, setNeedsTelefone] = useState(false);

  // CPF/Phone inline collection
  const [cpf, setCpf] = useState("");
  const [ddd, setDdd] = useState("");
  const [telefone, setTelefone] = useState("");

  // Cupom
  const [showCupom, setShowCupom] = useState(false);
  const [cupomCodigo, setCupomCodigo] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState<{
    codigo: string;
    desconto: number;
    tipo: string;
  } | null>(null);
  const [cupomLoading, setCupomLoading] = useState(false);
  const [cupomErro, setCupomErro] = useState<string | null>(null);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);

  // Cancelled return
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("cancelado") === "true") setCancelled(true);
    }
  }, []);

  // Load event data + auth
  useEffect(() => {
    const supabase = createClient();

    async function load() {
      // Auth check
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email ?? null);

        const { data: profile } = await supabase
          .from("profiles")
          .select("cpf, telefone_ddd, telefone_numero")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setNeedsCpf(!profile.cpf);
          setNeedsTelefone(!profile.telefone_ddd || !profile.telefone_numero);
        }
      }

      // Find event by slug or ID
      let query = supabase
        .from("eventos_admin")
        .select("id, nome, data_inicio, local, foto, classificacao_etaria")
        .eq("publicado", true);

      // Try slug first, then ID
      const { data: bySlug } = await query.eq("slug", slug).maybeSingle();
      const ev = bySlug
        ? bySlug
        : (await supabase
            .from("eventos_admin")
            .select("id, nome, data_inicio, local, foto, classificacao_etaria")
            .eq("publicado", true)
            .eq("id", slug)
            .maybeSingle()
          ).data;

      if (!ev) {
        setError("Evento não encontrado.");
        setLoading(false);
        return;
      }

      setEvento(ev);

      // Fetch active lote
      const { data: lotes } = await supabase
        .from("lotes")
        .select("id, nome, ativo, ordem")
        .eq("evento_id", ev.id)
        .eq("ativo", true)
        .order("ordem", { ascending: true })
        .limit(1);

      const activeLote = lotes?.[0] ?? null;
      setLote(activeLote);

      if (activeLote) {
        const { data: vars } = await supabase
          .from("variacoes_ingresso")
          .select(
            "id, area, area_custom, genero, valor, limite, vendidos, requer_comprovante"
          )
          .eq("lote_id", activeLote.id);

        if (vars) {
          setVariacoes(
            vars.map((v) => ({
              ...v,
              valor: Number(v.valor ?? 0),
              limite: Number(v.limite ?? 0),
              vendidos: Number(v.vendidos ?? 0),
            }))
          );
        }
      }

      setLoading(false);
    }

    load();
  }, [slug]);

  // Quantity helpers
  const setQty = useCallback(
    (variacaoId: string, delta: number) => {
      setQuantidades((prev) => {
        const variacao = variacoes.find((v) => v.id === variacaoId);
        if (!variacao) return prev;
        const current = prev[variacaoId] || 0;
        const next = Math.max(0, Math.min(10, current + delta));
        const disponivel = variacao.limite - variacao.vendidos;
        const capped = Math.min(next, disponivel);
        return { ...prev, [variacaoId]: capped };
      });
    },
    [variacoes]
  );

  const totalItems = useMemo(
    () => Object.values(quantidades).reduce((s, n) => s + n, 0),
    [quantidades]
  );

  const subtotal = useMemo(() => {
    let total = 0;
    for (const v of variacoes) {
      total += (quantidades[v.id] || 0) * v.valor;
    }
    return total;
  }, [variacoes, quantidades]);

  const desconto = useMemo(() => {
    if (!cupomAplicado) return 0;
    if (cupomAplicado.tipo === "PERCENTUAL") {
      return Math.round(subtotal * (cupomAplicado.desconto / 100));
    }
    return Math.min(cupomAplicado.desconto, subtotal);
  }, [subtotal, cupomAplicado]);

  const total = Math.max(0, subtotal - desconto);

  // Validate cupom
  const validarCupom = useCallback(async () => {
    if (!cupomCodigo.trim() || !evento) return;
    setCupomLoading(true);
    setCupomErro(null);

    const supabase = createClient();
    const { data, error: fnError } = await supabase.functions.invoke(
      "validate-cupom",
      { body: { codigo: cupomCodigo.trim(), evento_id: evento.id } }
    );

    setCupomLoading(false);

    if (fnError || !data?.valido) {
      setCupomErro(data?.erro || "Cupom inválido.");
      return;
    }

    setCupomAplicado({
      codigo: data.codigo,
      desconto: data.desconto,
      tipo: data.tipo,
    });
  }, [cupomCodigo, evento]);

  // Save CPF
  const saveCpf = useCallback(async () => {
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) return;

    const supabase = createClient();
    await supabase.rpc("user_profile_update", {
      p_fields: { cpf: digits },
    });
    setNeedsCpf(false);
  }, [cpf]);

  // Save telefone
  const saveTelefone = useCallback(async () => {
    if (!ddd.trim() || !telefone.trim()) return;

    const supabase = createClient();
    await supabase.rpc("user_profile_update", {
      p_fields: {
        telefone_ddd: ddd.replace(/\D/g, ""),
        telefone_numero: telefone.replace(/\D/g, ""),
      },
    });
    setNeedsTelefone(false);
  }, [ddd, telefone]);

  // Submit checkout
  const handleSubmit = useCallback(async () => {
    if (submitLock.current || totalItems === 0 || !evento || !lote) return;
    submitLock.current = true;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();

    // Build items
    const itens = variacoes
      .filter((v) => (quantidades[v.id] || 0) > 0)
      .map((v) => ({
        variacao_id: v.id,
        quantidade: quantidades[v.id],
      }));

    if (total === 0) {
      // Free checkout — call RPC directly
      for (const item of itens) {
        const variacao = variacoes.find((v) => v.id === item.variacao_id)!;
        const { data, error: rpcError } = await supabase.rpc(
          "processar_compra_checkout",
          {
            p_evento_id: evento.id,
            p_lote_id: lote.id,
            p_variacao_id: item.variacao_id,
            p_email: userEmail || "",
            p_valor_unit: variacao.valor,
            p_quantidade: item.quantidade,
            p_comprador_id: userId || "",
            p_ref_code: "",
          }
        );

        const result = data as { ok?: boolean; erro?: string } | null;
        if (rpcError || (result && !result.ok)) {
          setError(result?.erro || "Erro ao processar. Tente novamente.");
          setSubmitting(false);
          submitLock.current = false;
          return;
        }
      }

      // Success — redirect to success page
      window.location.href = "/checkout/sucesso?free=true";
      return;
    }

    // Paid checkout — call edge function
    const { data, error: fnError } = await supabase.functions.invoke(
      "create-ticket-checkout",
      {
        body: {
          evento_id: evento.id,
          lote_id: lote.id,
          itens,
          cupom_codigo: cupomAplicado?.codigo || null,
          mesa_id: null,
          acompanhantes: null,
          ref_code: null,
        },
      }
    );

    if (fnError || !data || data?.error) {
      const msg =
        data?.error ||
        fnError?.message ||
        "Erro ao criar checkout. Tente novamente.";
      console.error("[checkout]", fnError, data);
      setError(msg);
      setSubmitting(false);
      submitLock.current = false;
      return;
    }

    // Redirect to Stripe
    if (data?.url) {
      window.location.href = data.url;
    }
  }, [
    evento,
    lote,
    variacoes,
    quantidades,
    totalItems,
    total,
    userId,
    userEmail,
    cupomAplicado,
  ]);

  if (loading) {
    return (
      <Container size="sm" className="py-24 text-center">
        <Loader2 size={24} className="text-gold animate-spin mx-auto mb-4" />
        <p className="text-text-muted text-sm">Carregando checkout...</p>
      </Container>
    );
  }

  if (error && !evento) {
    return (
      <Container size="sm" className="py-24 text-center">
        <AlertCircle size={24} className="text-error mx-auto mb-4" />
        <h2 className="text-xl mb-2">{error}</h2>
        <Link href="/eventos" className="text-sm text-gold hover-real:underline">
          Ver eventos
        </Link>
      </Container>
    );
  }

  if (!evento) return null;

  const gradient = evento.foto
    ? `url(${evento.foto}) center/cover`
    : "radial-gradient(circle at 30% 20%, rgba(255,211,0,0.32), transparent 55%), linear-gradient(140deg, #2a1d0a, #080604)";

  return (
    <Container size="sm" className="py-10 md:py-16">
      {/* Cancelled banner */}
      {cancelled && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 flex items-center gap-3 text-sm text-warning mb-6">
          <AlertCircle size={16} className="shrink-0" />
          Pagamento cancelado. Você pode tentar novamente.
        </div>
      )}

      {/* Event header */}
      <div className="rounded-2xl overflow-hidden border border-white/5 bg-card mb-8">
        <div className="relative h-48" style={{ background: gradient }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <Link
            href={`/evento/${slug}`}
            className="absolute top-4 left-4 h-9 w-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-text-secondary hover-real:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="absolute bottom-4 left-5 right-5">
            <p className="kicker text-[0.6rem] mb-1">{formatDate(evento.data_inicio)}</p>
            <h1 className="font-display text-xl leading-tight">{evento.nome}</h1>
          </div>
        </div>
        <div className="px-5 py-3 flex items-center gap-3 text-xs text-text-muted border-t border-white/5">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-gold" />
            {formatDate(evento.data_inicio)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-gold" />
            {evento.local}
          </span>
        </div>
      </div>

      {/* Lote info */}
      {lote && (
        <div className="flex items-center justify-between mb-5">
          <span className="kicker">ingressos</span>
          <span className="text-[0.65rem] text-text-muted uppercase tracking-widest">
            {lote.nome}
          </span>
        </div>
      )}

      {/* Variations */}
      {variacoes.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card p-12 text-center mb-8">
          <Ticket size={24} className="text-gold mx-auto mb-4" />
          <h3 className="text-lg mb-2">Sem ingressos disponíveis</h3>
          <p className="text-text-muted text-sm">
            Nenhum lote ativo pra esse evento no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {variacoes.map((v) => {
            const qty = quantidades[v.id] || 0;
            const disponivel = v.limite - v.vendidos;
            const esgotado = disponivel <= 0;
            const areaLabel =
              v.area === "OUTRO" && v.area_custom ? v.area_custom : v.area;
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
                  "rounded-xl border p-5 transition-colors duration-200",
                  esgotado
                    ? "border-white/5 bg-elevated/20 opacity-50"
                    : qty > 0
                      ? "border-gold/40 bg-gold/[0.04]"
                      : "border-white/5 bg-card hover-real:border-white/15"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
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
                    <p className="text-xs text-text-muted">
                      {esgotado
                        ? "Esgotado"
                        : `${disponivel} restantes`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "text-sm font-semibold whitespace-nowrap",
                        esgotado ? "text-text-muted line-through" : "text-gold"
                      )}
                    >
                      {v.valor === 0
                        ? "Grátis"
                        : `R$ ${v.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    </span>

                    {!esgotado && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQty(v.id, -1)}
                          disabled={qty === 0}
                          className="h-8 w-8 rounded-lg border border-white/10 bg-elevated flex items-center justify-center text-text-secondary hover-real:text-text-primary disabled:opacity-30 cursor-pointer transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(v.id, 1)}
                          disabled={qty >= Math.min(10, disponivel)}
                          className="h-8 w-8 rounded-lg border border-gold/40 bg-gold/10 flex items-center justify-center text-gold hover-real:bg-gold/20 disabled:opacity-30 cursor-pointer transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cupom */}
      {totalItems > 0 && (
        <div className="mb-8">
          {cupomAplicado ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-success/30 bg-success/10">
              <Tag size={14} className="text-success shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-success">
                  {cupomAplicado.codigo}
                </p>
                <p className="text-xs text-success/70">
                  {cupomAplicado.tipo === "PERCENTUAL"
                    ? `${cupomAplicado.desconto}% de desconto`
                    : `R$ ${cupomAplicado.desconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} de desconto`}
                </p>
              </div>
              <button
                onClick={() => {
                  setCupomAplicado(null);
                  setCupomCodigo("");
                }}
                className="text-success/50 hover-real:text-success cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ) : showCupom ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={cupomCodigo}
                  onChange={(e) => setCupomCodigo(e.target.value.toUpperCase())}
                  placeholder="Código do cupom"
                  className="flex-1 bg-input border border-white/5 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && validarCupom()}
                />
                <button
                  onClick={validarCupom}
                  disabled={cupomLoading || !cupomCodigo.trim()}
                  className="px-5 rounded-xl bg-gold text-black text-sm font-bold uppercase tracking-widest hover-real:brightness-110 transition-all cursor-pointer disabled:opacity-40"
                >
                  {cupomLoading ? "..." : "Aplicar"}
                </button>
              </div>
              {cupomErro && (
                <p className="text-xs text-error">{cupomErro}</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowCupom(true)}
              className="text-sm text-text-muted hover-real:text-gold transition-colors cursor-pointer flex items-center gap-2"
            >
              <Tag size={14} />
              Tem um código?
            </button>
          )}
        </div>
      )}

      {/* Auth gate / Profile completion */}
      {totalItems > 0 && !userId && (
        <div className="rounded-2xl border border-gold/20 bg-card p-6 mb-8">
          <p className="text-sm text-text-secondary mb-4">
            Faça login pra continuar com a compra.
          </p>
          <Button href={`/entrar?next=/checkout/${slug}`} className="w-full" size="lg">
            Entrar
          </Button>
        </div>
      )}

      {totalItems > 0 && userId && needsCpf && (
        <div className="rounded-2xl border border-white/5 bg-card p-6 mb-8">
          <p className="text-sm font-semibold mb-1">CPF necessário</p>
          <p className="text-xs text-text-muted mb-4">
            Obrigatório pra emissão do ingresso.
          </p>
          <div className="flex gap-2">
            <input
              value={cpf}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                const formatted =
                  digits.length <= 3
                    ? digits
                    : digits.length <= 6
                      ? `${digits.slice(0, 3)}.${digits.slice(3)}`
                      : digits.length <= 9
                        ? `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
                        : `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
                setCpf(formatted);
              }}
              placeholder="000.000.000-00"
              inputMode="numeric"
              maxLength={14}
              className="flex-1 bg-input border border-white/5 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none"
            />
            <button
              onClick={saveCpf}
              disabled={cpf.replace(/\D/g, "").length !== 11}
              className="px-5 rounded-xl bg-gold text-black text-sm font-bold uppercase tracking-widest hover-real:brightness-110 transition-all cursor-pointer disabled:opacity-40"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {totalItems > 0 && userId && !needsCpf && needsTelefone && (
        <div className="rounded-2xl border border-white/5 bg-card p-6 mb-8">
          <p className="text-sm font-semibold mb-1">Telefone necessário</p>
          <p className="text-xs text-text-muted mb-4">
            Pra contato em caso de alteração no evento.
          </p>
          <div className="flex gap-2">
            <input
              value={ddd}
              onChange={(e) => setDdd(e.target.value.replace(/\D/g, "").slice(0, 2))}
              placeholder="DDD"
              inputMode="numeric"
              maxLength={2}
              className="w-16 bg-input border border-white/5 rounded-xl px-3 py-2.5 text-sm text-center placeholder:text-text-subtle focus:border-gold/30 focus:outline-none"
            />
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder="9 0000-0000"
              inputMode="numeric"
              maxLength={9}
              className="flex-1 bg-input border border-white/5 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none"
            />
            <button
              onClick={saveTelefone}
              disabled={!ddd.trim() || !telefone.trim()}
              className="px-5 rounded-xl bg-gold text-black text-sm font-bold uppercase tracking-widest hover-real:brightness-110 transition-all cursor-pointer disabled:opacity-40"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 flex items-center gap-3 text-sm text-error mb-6">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Footer / Total */}
      {totalItems > 0 && (
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                {totalItems} {totalItems === 1 ? "ingresso" : "ingressos"}
              </span>
              <span className={cn(desconto > 0 && "line-through text-text-muted")}>
                R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            {desconto > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-success">Desconto</span>
                <span className="text-success">
                  − R$ {desconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-semibold text-gold">
                {total === 0
                  ? "Grátis"
                  : `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              </span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={
              submitting ||
              !userId ||
              needsCpf ||
              needsTelefone
            }
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processando...
              </>
            ) : total === 0 ? (
              "Confirmar ingresso"
            ) : (
              "Pagar"
            )}
          </Button>

          <p className="text-xs text-text-muted text-center mt-3">
            {total > 0
              ? "Pagamento seguro via Stripe. Aceita cartão e PIX."
              : "Ingresso entra direto na sua carteira."}
          </p>
        </div>
      )}
    </Container>
  );
}
