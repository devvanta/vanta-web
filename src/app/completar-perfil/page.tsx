"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Check, Shield } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { createClient } from "@/lib/supabase/client";

function isValidDate(val: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return false;
  const [d, m, y] = val.split("/").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

function isAdult(val: string, minAge = 16): boolean {
  const [d, m, y] = val.split("/").map(Number);
  const birth = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= minAge;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function toISO(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split("/");
  return `${y}-${m}-${d}`;
}

export default function CompletarPerfilPage() {
  const [dataNasc, setDataNasc] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidDate(dataNasc)) {
      setError("Data de nascimento inválida. Use DD/MM/AAAA.");
      return;
    }
    if (!isAdult(dataNasc)) {
      setError("Você precisa ter pelo menos 16 anos.");
      return;
    }
    if (!lgpd) {
      setError("Aceite os termos pra continuar.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error: rpcError } = await supabase.rpc("user_profile_update", {
      p_fields: {
        data_nascimento: toISO(dataNasc),
        updated_at: new Date().toISOString(),
      },
    });

    if (rpcError) {
      setError("Erro ao salvar. Tente novamente.");
      setLoading(false);
      return;
    }

    // Redirect to onboarding
    window.location.href = "/onboarding";
  }

  return (
    <Container size="sm" className="py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h1 className="text-3xl md:text-4xl leading-tight mb-3">
            Quase lá!
          </h1>
          <p className="text-text-secondary">
            Precisamos de mais uma informação pra completar sua conta.
          </p>
        </div>

        <div className="rounded-3xl border border-white/5 bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="ui-label block mb-2">
                Data de nascimento
              </label>
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={dataNasc}
                  onChange={(e) =>
                    setDataNasc(formatDateInput(e.target.value))
                  }
                  placeholder="DD/MM/AAAA"
                  required
                  autoFocus
                  maxLength={10}
                  className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
                />
              </div>
              <p className="text-[0.65rem] text-text-subtle mt-1.5">
                Mínimo 16 anos. Usado pra classificação etária dos eventos.
              </p>
            </div>

            <label className="flex items-start gap-3 py-2 cursor-pointer">
              <div className="relative shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={lgpd}
                  onChange={(e) => setLgpd(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-5 rounded-md border border-white/10 bg-input peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200 flex items-center justify-center">
                  {lgpd && (
                    <Check size={12} className="text-black" strokeWidth={3} />
                  )}
                </div>
              </div>
              <span className="text-xs text-text-muted leading-relaxed">
                Li e concordo com os{" "}
                <Link
                  href="/termos"
                  className="text-gold hover-real:underline"
                >
                  termos de uso
                </Link>{" "}
                e a{" "}
                <Link
                  href="/privacidade"
                  className="text-gold hover-real:underline"
                >
                  política de privacidade
                </Link>
                .
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-error/30 bg-error/10 p-3 flex items-center gap-2 text-xs text-error">
                <Shield size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Continuar"}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
