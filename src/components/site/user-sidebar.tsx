"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Crown,
  LogOut,
  MessageCircle,
  Settings,
  User as UserIcon,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const items = [
  { href: "/perfil", label: "Perfil", icon: UserIcon },
  { href: "/carteira", label: "Carteira", icon: Wallet },
  { href: "/mensagens", label: "Mensagens", icon: MessageCircle },
  { href: "/notificacoes", label: "Notificações", icon: Bell },
  { href: "/mais-vanta", label: "Mais Vanta", icon: Crown },
];

export function UserSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  const displayName =
    user.user_metadata?.nome ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Você";

  const avatarUrl = user.user_metadata?.avatar_url;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="md:sticky md:top-24 md:self-start">
      <div className="rounded-2xl bg-card border border-white/5 overflow-hidden">
        {/* Card do usuário */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-12 w-12 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div
                className="h-12 w-12 rounded-full border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,211,0,0.35), #080604)",
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              <p className="text-xs text-text-muted truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-2">
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
                    : "text-text-secondary hover-real:bg-elevated hover-real:text-text-primary"
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover-real:bg-elevated hover-real:text-error transition-colors duration-200 cursor-pointer"
          >
            <LogOut size={14} className="shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
