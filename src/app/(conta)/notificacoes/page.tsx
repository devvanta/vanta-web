"use client";

import { useState } from "react";
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
  type: NotifType;
  title: string;
  body: string;
  when: string;
  read: boolean;
  href?: string;
};

const initialNotifs: Notif[] = [
  {
    id: "1",
    type: "event",
    title: "Novo evento na Casa do Samba",
    body: "Noite do Samba · sáb 19 abr · 22h. Confira os lotes abertos.",
    when: "há 5min",
    read: false,
    href: "/evento/noite-do-samba",
  },
  {
    id: "2",
    type: "cortesia",
    title: "Você recebeu uma cortesia",
    body: "Cortesia para Sunset Privilege já está na sua carteira.",
    when: "há 20min",
    read: false,
    href: "/carteira",
  },
  {
    id: "3",
    type: "transfer",
    title: "Ana te transferiu um ingresso",
    body: "Sunset Privilege · domingo. Ingresso já está na sua carteira.",
    when: "há 1h",
    read: false,
    href: "/carteira",
  },
  {
    id: "4",
    type: "reminder",
    title: "Seu evento é amanhã",
    body: "Noite do Samba · 22h. Não esqueça do documento com foto.",
    when: "há 3h",
    read: true,
    href: "/evento/noite-do-samba",
  },
  {
    id: "5",
    type: "maisvanta",
    title: "Novos benefícios desbloqueados",
    body: "Confira o que tem de novo pra você no MAIS VANTA esta semana.",
    when: "ontem",
    read: true,
    href: "/mais-vanta",
  },
  {
    id: "6",
    type: "friend",
    title: "Matheus quer ser seu amigo no VANTA",
    body: "Aceite pra compartilhar eventos, cortesias e chat.",
    when: "ontem",
    read: true,
  },
  {
    id: "7",
    type: "message",
    title: "Rafa te mandou mensagem",
    body: "\"Fechou, só transferir pelo app\"",
    when: "ontem",
    read: true,
    href: "/mensagens",
  },
  {
    id: "8",
    type: "maisvanta",
    title: "Bem-vindo ao MAIS VANTA!",
    body: "Boas notícias! Você foi aprovado e já pode aproveitar vantagens exclusivas.",
    when: "3 dias atrás",
    read: true,
    href: "/mais-vanta",
  },
];

const iconFor: Record<NotifType, typeof Bell> = {
  event: Calendar,
  reminder: Bell,
  cortesia: Gift,
  transfer: Ticket,
  maisvanta: Crown,
  friend: UserPlus,
  message: MessageCircle,
};

type Tab = "todas" | "pendentes";

export default function NotificacoesPage() {
  const [tab, setTab] = useState<Tab>("todas");
  const [notifs, setNotifs] = useState(initialNotifs);

  const filtered = notifs.filter((n) =>
    tab === "pendentes" ? !n.read : true,
  );
  const unreadCount = notifs.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
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
            Eventos novos, cortesias, ingressos transferidos, lembretes.
            Tudo aqui.
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
                : "text-text-muted border-transparent hover-real:text-text-primary",
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

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gold/10 border border-gold/20 mb-5 text-gold">
            <Sparkles size={20} />
          </div>
          <h3 className="text-2xl mb-3 leading-tight">
            Tudo em dia.
          </h3>
          <p className="text-text-muted text-sm max-w-sm mx-auto">
            Não tem notificação pendente. Volte depois ou confira os eventos
            novos da sua cidade.
          </p>
        </div>
      ) : (
        <ul className="rounded-2xl border border-white/5 bg-card overflow-hidden">
          {filtered.map((n, i) => {
            const Icon = iconFor[n.type];
            const Wrapper: React.ElementType = n.href ? Link : "div";
            return (
              <li
                key={n.id}
                className={cn(
                  i > 0 && "border-t border-white/5",
                  !n.read && "bg-gold/[0.025]",
                )}
              >
                <Wrapper
                  {...(n.href ? { href: n.href } : {})}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "flex items-start gap-4 p-5 transition-colors duration-200",
                    n.href &&
                      "cursor-pointer hover-real:bg-elevated/50 block",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                      n.read
                        ? "bg-elevated border border-white/5 text-text-muted"
                        : "bg-gold/15 border border-gold/30 text-gold",
                    )}
                  >
                    <Icon size={14} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p
                        className={cn(
                          "text-sm leading-tight",
                          !n.read && "font-semibold",
                        )}
                      >
                        {n.title}
                      </p>
                      <span className="text-[0.65rem] text-text-muted shrink-0 whitespace-nowrap">
                        {n.when}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-gold shrink-0 mt-2" />
                  )}
                </Wrapper>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
