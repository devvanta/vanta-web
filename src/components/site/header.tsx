import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

const nav = [
  { label: "Eventos", href: "/eventos" },
  { label: "Radar", href: "/radar" },
  { label: "Mais Vanta", href: "/mais-vanta" },
  { label: "Parceiro", href: "/parceiro" },
  { label: "Sobre", href: "/sobre" },
];

export function Header() {
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
            <Link
              href="/entrar"
              className="hidden sm:inline text-sm text-text-secondary hover-real:text-text-primary transition-colors duration-200"
            >
              Entrar
            </Link>
            <Button href="/criar-conta" size="sm">
              Criar conta
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
