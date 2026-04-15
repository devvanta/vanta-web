"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  Check,
  Crown,
  Gift,
  MessageCircle,
  Settings,
  Sparkles,
  Ticket,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type NotifType =
  | "event"
  | "reminder"
  | "cortesia"
  | "transfer"
  | "maisvanta"
  | "friend"
  | "message";

type Notif = {
  id: string;
  tipo: NotifType;
  titulo: string;
  mensagem: string;
  lida: boolean;
  link: string | null;
  created_at: string;
};

const iconFor: Record<string, typeof Bell> = {
  event: Calendar,
  reminder: Bell,
  cortesia: Gift,
  transfer: Ticket,
  maisvanta: Crown,
  friend: UserPlus,
  message: MessageCircle,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days}d`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

type Tab = "todas" | "pendentes";

export default function NotificacoesPage() {
  const [tab, setTab] = useState<Tab>("todas");
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("notifications")
        .select("id, tipo, titulo, mensagem, lida, link, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) {
        setNotifs(
          data.map((n) => ({
            id: n.id,
            tipo: (n.tipo as NotifType) || "event",
            titulo: n.titulo,
            mensagem: n.mensagem,
            lida: n.lida ?? false,
            link: n.link,
            created_at: n.created_at ?? "",
          }))
        );
      }
      setLoading(false);
    }

    load();
  }, []);

  // Realtime: listen for new notifications
  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const n = payload.new as {
            id: string;
            tipo: string;
            titulo: string;
            mensagem: string;
            lida: boolean;
            link: string | null;
            created_at: string;
          };
          setNotifs((prev) => [
            {
              id: n.id,
              tipo: (n.tipo as NotifType) || "event",
              titulo: n.titulo,
              mensagem: n.mensagem,
              lida: n.lida ?? false,
              link: n.link,
              created_at: n.created_at ?? "",
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const filtered = notifs.filter((n) =>
    tab === "pendentes" ? !n.lida : true
  );
  const unreadCount = notifs.filter((n) => !n.lida).length;

  async function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, lida: true })));

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("notifications")
      .update({ lida: true })
      .eq("user_id", user.id)
      .eq("lida", false);
  }

  async function markRead(id: string) {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );

    const supabase = createClient();
    await supabase.from("notifications").update({ lida: true }).eq("id", id);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="kicker mb-3 inline-block">notificações</span>
          <h1 className="text-3xl md:text-4xl leading-tight mb-3">
            Saiba em <span className="text-gold">primeira mão</span>.
          </h1>
          <p className="text-text-secondary">
            Eventos novos, cortesias, ingressos transferidos, lembretes. Tudo
            aqui.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="h-9 px-4 rounded-xl border border-white/10 bg-elevated text-sm text-text-secondary hover-real:text-text-primary hover-real:border-white/20 transition-colors duration-200 cursor-pointer flex items-center gap-2"
            >
              <Check size={12} />
              Marcar tudo como lido
            </button>
          )}
          <Link
            href="/configuracoes"
            className="h-9 w-9 rounded-xl border border-white/10 bg-elevated flex items-center justify-center text-text-secondary hover-real:text-text-primary hover-real:border-white/20 transition-colors duration-200"
          >
            <Settings size={14} />
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5">
        {(["todas", "pendentes"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-3 text-sm font-medium cursor-pointer border-b-2 -mb-[2px] transition-colors duration-200 flex items-center gap-2",
              tab === t
                ? "text-gold border-gold"
                : "text-text-muted border-transparent hover-real:text-text-primary"
            )}
          >
            {t === "todas" ? "Todas" : "Pendentes"}
            {t === "pendentes" && unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-gold text-black text-[0.6rem] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">
          Carregando notificações...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
          <Bell size={24} className="text-gold mx-auto mb-4" />
          <h3 className="text-lg mb-2">Tudo lido</h3>
          <p className="text-text-muted text-sm">
            {tab === "pendentes"
              ? "Nenhuma notificação pendente."
              : "Nenhuma notificação ainda."}
          </p>
        </div>
      ) : (
        <ul className="rounded-2xl border border-white/5 bg-card overflow-hidden">
          {filtered.map((n, i) => {
            const Icon = iconFor[n.tipo] || Bell;
            return (
              <li
                key={n.id}
                className={cn(i > 0 && "border-t border-white/5")}
              >
                <div
                  onClick={() => {
                    if (!n.lida) markRead(n.id);
                    if (n.link) window.location.href = n.link;
                  }}
                  className={cn(
                    "flex items-start gap-4 p-5 transition-colors duration-200 cursor-pointer",
                    !n.lida
                      ? "bg-gold/[0.03] hover-real:bg-gold/[0.06]"
                      : "hover-real:bg-elevated/50"
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                      !n.lida
                        ? "bg-gold/15 border border-gold/30 text-gold"
                        : "bg-elevated border border-white/5 text-text-muted"
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p
                        className={cn(
                          "text-sm font-semibold truncate",
                          !n.lida ? "text-text-primary" : "text-text-secondary"
                        )}
                      >
                        {n.titulo}
                      </p>
                      <span className="text-[0.65rem] text-text-subtle shrink-0">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {n.mensagem}
                    </p>
                  </div>
                  {!n.lida && (
                    <div className="mt-2 h-2 w-2 rounded-full bg-gold shrink-0" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
