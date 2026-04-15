"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { OAuthButton } from "@/components/site/oauth-button";
import { createClient } from "@/lib/supabase/client";

function isValidNome(nome: string): boolean {
  const trimmed = nome.trim();
  if (trimmed.split(/\s+/).length < 2) return false;
  if (/\d/.test(trimmed)) return false;
  if (/[^a-zA-ZÀ-ÿ\s'-]/.test(trimmed)) return false;
  return true;
}

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

export default function CriarContaPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [dataNasc, setDataNasc] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidNome(nome)) {
      setError("Informe seu nome completo (nome e sobrenome).");
      return;
    }
    if (senha.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
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
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { nome: nome.trim() },
      },
    });

    if (signUpError) {
      setLoading(false);
      if (signUpError.message.includes("already registered")) {
        setError("Esse e-mail já tem conta. Tente entrar.");
      } else {
        setError("Não foi possível criar a conta. Tente novamente.");
      }
      return;
    }

    // Update profile with DOB (only if session exists — skipped when email confirmation required)
    if (data.session && data.user) {
      await supabase.rpc("user_profile_update", {
        p_fields: {
          data_nascimento: toISO(dataNasc),
          updated_at: new Date().toISOString(),
        },
      });
    }

    setLoading(false);
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
            <h2 className="text-2xl mb-3 leading-tight">
              Quase lá, {nome.split(" ")[0]}!
            </h2>
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
              {/* Nome */}
              <div>
                <label className="ui-label block mb-2">Nome completo</label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Como você se apresenta"
                    required
                    autoFocus
                    className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Senha */}
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
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
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

              {/* Data de nascimento */}
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
                    onChange={(e) => setDataNasc(formatDateInput(e.target.value))}
                    placeholder="DD/MM/AAAA"
                    required
                    maxLength={10}
                    className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-3 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
                  />
                </div>
                <p className="text-[0.65rem] text-text-subtle mt-1.5">
                  Mínimo 16 anos. Usado pra classificação etária dos eventos.
                </p>
              </div>

              {/* LGPD */}
              <label className="flex items-start gap-3 py-2 cursor-pointer">
                <div className="relative shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={lgpd}
                    onChange={(e) => setLgpd(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-5 rounded-md border border-white/10 bg-input peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200 flex items-center justify-center">
                    {lgpd && <Check size={12} className="text-black" strokeWidth={3} />}
                  </div>
                </div>
                <span className="text-xs text-text-muted leading-relaxed">
                  Li e concordo com os{" "}
                  <Link href="/termos" className="text-gold hover-real:underline">
                    termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" className="text-gold hover-real:underline">
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
                {loading ? "Criando..." : "Criar conta"}
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
