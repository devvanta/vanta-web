"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Mail, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { OAuthButton } from "@/components/site/oauth-button";
import { createClient } from "@/lib/supabase/client";

export default function EntrarPage() {
  return (
    <Suspense>
      <EntrarContent />
    </Suspense>
  );
}

function EntrarContent() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (otpError) {
      setError("Não foi possível enviar o link. Tente novamente.");
      return;
    }

    setSent(true);
  }

  return (
    <Container size="sm" className="py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h1 className="text-3xl md:text-4xl leading-tight mb-3">
            Entre na VANTA.
          </h1>
          <p className="text-text-secondary">
            A noite começa aqui. A gente envia um link seguro pro seu e-mail.
          </p>
        </div>

        {authError && (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-4 mb-6 flex items-center gap-3 text-sm text-error">
            <AlertCircle size={16} className="shrink-0" />
            Erro na autenticação. Tente novamente.
          </div>
        )}

        {sent ? (
          <div className="rounded-3xl border border-gold/30 bg-card p-8 text-center glow-gold">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-success/15 border border-success/40 text-success mb-5">
              <Check size={22} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl mb-3 leading-tight">Link enviado!</h2>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              Abra seu e-mail e clique no link mágico pra entrar. O link vale
              por 15 minutos.
            </p>
            <p className="text-xs text-text-muted">
              Enviado pra <span className="text-text-primary">{email}</span>
            </p>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="mt-6 text-xs text-gold hover-real:underline cursor-pointer"
            >
              Usar outro e-mail
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/5 bg-card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="ui-label block mb-2">E-mail</label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    autoFocus
                    className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
              {error && (
                <p className="text-xs text-error">{error}</p>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link mágico"}
                {!loading && <ArrowRight size={16} />}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[0.6rem] uppercase tracking-[0.24em] text-text-subtle">
                ou continue com
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="space-y-2">
              <OAuthButton provider="google" />
              <OAuthButton provider="apple" />
            </div>
          </div>
        )}

        <p className="text-xs text-text-muted text-center mt-6 leading-relaxed">
          Não tem conta?{" "}
          <Link href="/criar-conta" className="text-gold hover-real:underline">
            Criar conta
          </Link>
        </p>

        <p className="text-[0.65rem] text-text-subtle text-center mt-8 leading-relaxed">
          Entrando você aceita nossos{" "}
          <Link href="/termos" className="hover-real:text-text-muted underline">
            termos de uso
          </Link>{" "}
          e a{" "}
          <Link
            href="/privacidade"
            className="hover-real:text-text-muted underline"
          >
            política de privacidade
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
