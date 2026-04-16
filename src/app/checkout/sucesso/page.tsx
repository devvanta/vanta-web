"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Check,
  Clock,
  Loader2,
  Ticket,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutSucessoPage() {
  return (
    <Suspense>
      <SucessoContent />
    </Suspense>
  );
}

type Status = "polling" | "confirmed" | "failed" | "timeout" | "free" | "missing";

function SucessoContent() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get("pedido_id");
  const isFree = searchParams.get("free") === "true";

  const [status, setStatus] = useState<Status>(
    isFree ? "free" : pedidoId ? "polling" : "missing"
  );
  const [eventName, setEventName] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const attemptsRef = useRef(0);

  const poll = useCallback(async () => {
    if (!pedidoId) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("pedidos_checkout")
      .select("status, evento_id, dados_compra")
      .eq("id", pedidoId)
      .maybeSingle();

    if (error || !data) {
      console.warn("[checkout/sucesso] poll error:", error?.message || "no data");
    }

    if (data?.status === "PAGO") {
      // Fetch event name
      if (data.evento_id) {
        const { data: ev } = await supabase
          .from("eventos_admin")
          .select("nome")
          .eq("id", data.evento_id)
          .maybeSingle();
        if (ev) setEventName(ev.nome);
      }

      // Count tickets
      const compra = data.dados_compra as {
        itens?: { quantidade: number }[];
      } | null;
      if (compra?.itens) {
        setTicketCount(
          compra.itens.reduce((s, i) => s + (i.quantidade || 0), 0)
        );
      }

      setStatus("confirmed");
      return;
    }

    if (data?.status === "CANCELADO" || data?.status === "EXPIRADO") {
      setStatus("failed");
      return;
    }

    // Still pending — increment attempts
    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
    if (attemptsRef.current >= 30) {
      setStatus("timeout");
    }
  }, [pedidoId]);

  useEffect(() => {
    if (status !== "polling" || !pedidoId) return;

    const timer = setInterval(poll, 2000);
    poll(); // first immediately

    return () => clearInterval(timer);
  }, [status, pedidoId, poll]);

  return (
    <Container size="sm" className="py-24">
      <div className="max-w-md mx-auto text-center">
        {/* Free checkout success */}
        {status === "free" && (
          <>
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-success/15 border border-success/40 text-success mb-8">
              <Check size={36} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl md:text-4xl leading-tight mb-4">
              Ingresso confirmado!
            </h1>
            <p className="text-text-secondary text-lg mb-10">
              Seu ingresso já está na sua carteira. Apresente o QR na entrada.
            </p>
            <div className="flex flex-col gap-3">
              <Button href="/carteira" size="lg" className="w-full">
                <Ticket size={16} />
                Ver meu ingresso
              </Button>
              <Link
                href="/eventos"
                className="text-sm text-text-muted hover-real:text-gold transition-colors"
              >
                Voltar pros eventos
              </Link>
            </div>
          </>
        )}

        {/* Polling */}
        {status === "polling" && (
          <>
            <Loader2
              size={48}
              className="text-gold animate-spin mx-auto mb-8"
            />
            <h1 className="text-3xl leading-tight mb-4">
              Confirmando pagamento...
            </h1>
            <p className="text-text-secondary mb-2">
              Aguardando confirmação do Stripe.
            </p>
            <p className="text-xs text-text-muted">
              Tentativa {attempts}/30 · Não feche esta página
            </p>
          </>
        )}

        {/* Confirmed */}
        {status === "confirmed" && (
          <>
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-success/15 border border-success/40 text-success mb-8">
              <Check size={36} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl md:text-4xl leading-tight mb-4">
              Pagamento confirmado!
            </h1>
            {eventName && (
              <p className="text-gold text-lg font-semibold mb-2">
                {eventName}
              </p>
            )}
            <p className="text-text-secondary mb-10">
              {ticketCount > 0
                ? `${ticketCount} ${ticketCount === 1 ? "ingresso" : "ingressos"} na sua carteira.`
                : "Ingresso na sua carteira."}{" "}
              Apresente o QR na entrada.
            </p>
            <div className="flex flex-col gap-3">
              <Button href="/carteira" size="lg" className="w-full">
                <Ticket size={16} />
                Ver meu ingresso
              </Button>
              <Link
                href="/eventos"
                className="text-sm text-text-muted hover-real:text-gold transition-colors"
              >
                Voltar pros eventos
              </Link>
            </div>
          </>
        )}

        {/* Failed */}
        {status === "failed" && (
          <>
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-error/15 border border-error/40 text-error mb-8">
              <AlertCircle size={36} />
            </div>
            <h1 className="text-3xl leading-tight mb-4">
              Pagamento não confirmado
            </h1>
            <p className="text-text-secondary mb-10">
              O pagamento foi cancelado ou expirou. Nenhum valor foi cobrado.
            </p>
            <Button href="/eventos" size="lg" className="w-full">
              Voltar pros eventos
            </Button>
          </>
        )}

        {/* Missing pedido_id */}
        {status === "missing" && (
          <>
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-error/15 border border-error/40 text-error mb-8">
              <AlertCircle size={36} />
            </div>
            <h1 className="text-3xl leading-tight mb-4">
              Pagamento não encontrado
            </h1>
            <p className="text-text-secondary mb-10">
              Não foi possível identificar o pedido. Verifique sua carteira no app.
            </p>
            <div className="flex flex-col gap-3">
              <Button href="/carteira" size="lg" className="w-full">
                <Ticket size={16} />
                Verificar carteira
              </Button>
              <Link
                href="/eventos"
                className="text-sm text-text-muted hover-real:text-gold transition-colors"
              >
                Voltar pros eventos
              </Link>
            </div>
          </>
        )}

        {/* Timeout */}
        {status === "timeout" && (
          <>
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-warning/15 border border-warning/40 text-warning mb-8">
              <Clock size={36} />
            </div>
            <h1 className="text-3xl leading-tight mb-4">
              Processamento demorado
            </h1>
            <p className="text-text-secondary mb-10">
              O pagamento pode ter sido processado mas ainda não confirmou.
              Verifique sua carteira em alguns minutos. Se o ingresso não
              aparecer, entre em contato.
            </p>
            <div className="flex flex-col gap-3">
              <Button href="/carteira" size="lg" className="w-full">
                <Ticket size={16} />
                Verificar carteira
              </Button>
              <a
                href="mailto:contato@maisvanta.com"
                className="text-sm text-text-muted hover-real:text-gold transition-colors"
              >
                Preciso de ajuda
              </a>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
