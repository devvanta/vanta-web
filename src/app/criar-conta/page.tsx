"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { OAuthButton } from "@/components/site/oauth-button";
import { createClient } from "@/lib/supabase/client";

export default function CriarContaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { nome: name.trim() },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError("Não foi possível criar a conta. Tente novamente.");
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
            Crie sua conta.
          </h1>
          <p className="text-text-secondary">
            Aproveite tudo que a noite tem de melhor. Leva 30 segundos.
          </p>
        </div>

        {sent ? (
          <div className="rounded-3xl border border-gold/30 bg-card p-8 text-center glow-gold">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-success/15 border border-success/40 text-success mb-5">
              <Check size={22} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl mb-3 leading-tight">Quase lá, {name}!</h2>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              A gente enviou um link de confirmação pro seu e-mail. Clique pra
              finalizar a criação da conta.
            </p>
            <p className="text-xs text-text-muted">
              Enviado pra <span className="text-text-primary">{email}</span>
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/5 bg-card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="ui-label block mb-2">Nome</label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como você quer ser chamado"
                    required
                    autoFocus
                    className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
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
                    className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-error">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Criando..." : "Criar conta"}
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
          Já tem conta?{" "}
          <Link href="/entrar" className="text-gold hover-real:underline">
            Entrar
          </Link>
        </p>
      </div>
    </Container>
  );
}
