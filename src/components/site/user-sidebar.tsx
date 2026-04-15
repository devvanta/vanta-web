"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Crown,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/carteira", label: "Carteira", icon: Wallet },
  { href: "/mensagens", label: "Mensagens", icon: MessageCircle },
  { href: "/notificacoes", label: "Notificações", icon: Bell },
  { href: "/mais-vanta", label: "Mais Vanta", icon: Crown },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:sticky md:top-24 md:self-start">
      <div className="rounded-2xl bg-card border border-white/5 overflow-hidden">
        {/* Card do usuário (mock) */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-12 w-12 rounded-full border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,211,0,0.35), #080604)",
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Você</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Crown size={10} className="text-gold" />
                <span className="kicker text-[0.55rem]">mais vanta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-2">
          <Link
            href="/perfil"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-200",
              pathname === "/perfil"
                ? "bg-gold/10 text-gold"
                : "text-text-secondary hover-real:bg-elevated hover-real:text-text-primary",
            )}
          >
            <LayoutDashboard size={14} className="shrink-0" />
            <span>Início</span>
          </Link>
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-200",
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-text-secondary hover-real:bg-elevated hover-real:text-text-primary",
                )}
              >
                <Icon size={14} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-white/5">
          <Link
            href="/configuracoes"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover-real:bg-elevated hover-real:text-text-primary transition-colors duration-200"
          >
            <Settings size={14} className="shrink-0" />
            <span>Configurações</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover-real:bg-elevated hover-real:text-error transition-colors duration-200"
          >
            <LogOut size={14} className="shrink-0" />
            <span>Sair</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
