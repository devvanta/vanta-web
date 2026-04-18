"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
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
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !senha) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (signInError) {
      // Fix M7: mensagem genérica pra evitar email enumeration.
      // Antes mensagens diferentes revelavam se email existia no sistema.
      setError("E-mail ou senha incorretos. Se não confirmou seu e-mail, verifique sua caixa.");
      return;
    }

    // Redirect to ?next param or home. Whitelist estrita pra previnir open redirect:
    // bloqueia //evil.com, /\evil.com, /..//evil, javascript:, data:, etc.
    const next = searchParams.get("next");
    const isSafe = !!next && /^\/[A-Za-z0-9][A-Za-z0-9/_\-?&=.%]*$/.test(next);
    window.location.href = isSafe ? next! : "/";
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
            A noite começa aqui.
          </p>
        </div>

        {authError && (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-4 mb-6 flex items-center gap-3 text-sm text-error">
            <AlertCircle size={16} className="shrink-0" />
            Erro na autenticação. Tente novamente.
          </div>
        )}

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

            <div>
              <label className="ui-label block mb-2">Senha</label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-10 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover-real:text-text-primary cursor-pointer"
                >
                  {showSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-error/30 bg-error/10 p-3 flex items-center gap-2 text-xs text-error">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[0.6rem] uppercase tracking-[0.18em] text-text-subtle">
              ou continue com
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="space-y-2">
            <OAuthButton provider="google" />
            <OAuthButton provider="apple" />
          </div>
        </div>

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
