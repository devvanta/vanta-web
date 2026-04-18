"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Lock,
  LogOut,
  Settings,
  Shield,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Fix LGPD #E13: limpar storage (avatars + profile-albums) antes da anonimização
      const buckets = ["avatars", "profile-albums"];
      for (const bucket of buckets) {
        try {
          const { data: files } = await supabase.storage.from(bucket).list(user.id);
          if (files && files.length > 0) {
            await supabase.storage
              .from(bucket)
              .remove(files.map((f) => `${user.id}/${f.name}`));
          }
        } catch (e) {
          console.warn(`[configuracoes] storage cleanup ${bucket}:`, e);
        }
      }

      // RPC anonimiza conta LGPD-compliant: limpa friendships, tickets, notifications,
      // analytics_events, consents, etc. Troca apenas excluido=true deixava dados pra trás.
      const { error: rpcError } = await supabase.rpc("anonimizar_conta");

      if (rpcError) {
        setDeleting(false);
        alert("Erro ao excluir conta. Tente novamente ou entre em contato.");
        return;
      }
    }

    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/perfil"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover-real:text-text-primary transition-colors duration-200 mb-4"
        >
          <ArrowLeft size={12} />
          Voltar pro perfil
        </Link>
        <span className="kicker mb-3 inline-block">conta</span>
        <h1 className="text-3xl md:text-4xl leading-tight mb-3">
          Configurações
        </h1>
      </header>

      {/* Account settings */}
      <section className="rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-gold" />
            <h2 className="text-sm font-semibold">Conta</h2>
          </div>
        </div>

        <SettingsItem
          icon={Lock}
          label="Alterar senha"
          description="Enviaremos um link de redefinição pro seu e-mail"
          onClick={async () => {
            const supabase = createClient();
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user?.email) {
              await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/auth/callback`,
              });
              alert("Link de redefinição enviado pro seu e-mail.");
            }
          }}
        />

        <SettingsItem
          icon={Shield}
          label="Privacidade"
          description="Gerencie quais dados são visíveis"
          href="/perfil"
        />

        <SettingsItem
          icon={LogOut}
          label="Sair da conta"
          description="Encerrar sessão neste dispositivo"
          onClick={handleLogout}
          danger
        />
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-error/20 bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-error/10">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-error" />
            <h2 className="text-sm font-semibold text-error">Zona de risco</h2>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <SettingsItem
            icon={Trash2}
            label="Excluir minha conta"
            description="Todos os seus dados serão removidos permanentemente"
            onClick={() => setShowDeleteConfirm(true)}
            danger
          />
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-sm text-error leading-relaxed">
              Tem certeza? Essa ação é irreversível. Seus ingressos, amizades,
              mensagens e dados de perfil serão excluídos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-10 rounded-xl border border-white/10 bg-elevated text-sm text-text-secondary hover-real:text-text-primary transition-colors duration-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 h-10 rounded-xl bg-error text-white text-sm font-semibold hover-real:brightness-110 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Excluindo..." : "Sim, excluir minha conta"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Legal links */}
      <section className="rounded-2xl border border-white/5 bg-card overflow-hidden">
        <SettingsItem
          icon={Shield}
          label="Termos de uso"
          href="/termos"
        />
        <SettingsItem
          icon={Lock}
          label="Política de privacidade"
          href="/privacidade"
        />
      </section>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  description,
  href,
  onClick,
  danger,
}: {
  icon: typeof Settings;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-200 cursor-pointer border-b border-white/5 last:border-0",
          danger ? "hover-real:bg-error/5" : "hover-real:bg-elevated/50"
        )}
      >
        <div
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
            danger
              ? "bg-error/10 border border-error/20 text-error"
              : "bg-elevated border border-white/5 text-text-muted"
          )}
        >
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", danger ? "text-error" : "text-text-primary")}>
            {label}
          </p>
          {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
        </div>
        <ChevronRight size={14} className={cn("shrink-0", danger ? "text-error/40" : "text-text-subtle")} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-200 cursor-pointer border-b border-white/5 last:border-0",
        danger
          ? "hover-real:bg-error/5"
          : "hover-real:bg-elevated/50"
      )}
    >
      <div
        className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
          danger
            ? "bg-error/10 border border-error/20 text-error"
            : "bg-elevated border border-white/5 text-text-muted"
        )}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            danger ? "text-error" : "text-text-primary"
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        )}
      </div>
      <ChevronRight
        size={14}
        className={cn(
          "shrink-0",
          danger ? "text-error/40" : "text-text-subtle"
        )}
      />
    </button>
  );
}
