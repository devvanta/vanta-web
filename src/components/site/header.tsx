import Link from "next/link";
import { Search, Shield } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { label: "Eventos", href: "/eventos" },
  { label: "Radar", href: "/radar" },
  { label: "Mais Vanta", href: "/mais-vanta" },
  { label: "Parceiro", href: "/parceiro" },
  { label: "Sobre", href: "/sobre" },
];

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.nome ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0];

  const avatarUrl = user?.user_metadata?.avatar_url;

  // Detecta se tem acesso ao Painel Admin (app.maisvanta.com/admin).
  // Mostra botão pra: masteradm OU qualquer cargo RBAC ativo em comunidade.
  //
  // Uso da RPC is_masteradm() (SECURITY DEFINER) em vez de SELECT direto em
  // profiles.role — coluna `role` tem REVOKE SELECT pra authenticated (LGPD
  // 2026-04-20), SELECT direto retornaria 42501 e hasAdminAccess ficaria false
  // pra masteradm (esconderia o menu Admin indevidamente).
  let hasAdminAccess = false;
  if (user) {
    const { data: isMaster } = await supabase.rpc("is_masteradm");
    if (isMaster === true) {
      hasAdminAccess = true;
    } else {
      const { count } = await supabase
        .from("atribuicoes_rbac")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      hasAdminAccess = (count ?? 0) > 0;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-void/80 backdrop-blur-md">
      <Container size="lg">
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Logo />
            <nav className="hidden lg:flex items-center gap-7">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-text-secondary transition-colors duration-200 hover-real:text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/buscar"
              aria-label="Buscar"
              className="hidden sm:inline-flex h-9 w-9 rounded-full border border-white/10 items-center justify-center text-text-secondary hover-real:text-text-primary hover-real:border-white/20 transition-colors duration-200"
            >
              <Search size={14} />
            </Link>
            {user ? (
              <>
                {hasAdminAccess && (
                  <a
                    href="https://app.maisvanta.com/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#FFD300]/30 bg-[#FFD300]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFD300] hover-real:bg-[#FFD300]/10 transition-colors duration-200"
                  >
                    <Shield size={12} />
                    Painel
                  </a>
                )}
                <Link
                  href="/perfil"
                  className="flex items-center gap-2.5 rounded-full border border-white/10 pl-1 pr-3.5 py-1 hover-real:border-white/20 transition-colors duration-200"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-7 w-7 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,211,0,0.35), #080604)",
                      }}
                    />
                  )}
                  <span className="text-sm text-text-secondary hidden sm:inline">
                    {displayName}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/entrar"
                  className="hidden sm:inline text-sm text-text-secondary hover-real:text-text-primary transition-colors duration-200"
                >
                  Entrar
                </Link>
                <Button href="/criar-conta" size="sm">
                  Criar conta
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
