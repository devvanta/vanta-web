import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/site/logo";
import { Instagram, Mail } from "lucide-react";

const cols = [
  {
    title: "Produto",
    links: [
      { label: "Eventos", href: "/eventos" },
      { label: "Mais Vanta", href: "/mais-vanta" },
      { label: "Criar conta", href: "/criar-conta" },
    ],
  },
  {
    title: "Pra quem produz",
    links: [
      { label: "Cadastrar casa", href: "/parceiro" },
      { label: "Painel admin", href: "/admin" },
      { label: "Documentação", href: "/docs" },
    ],
  },
  {
    title: "Vanta",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Contato", href: "mailto:contato@maisvanta.com" },
      { label: "Termos e privacidade", href: "/termos" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-midnight">
      <Container size="lg">
        <div className="py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-text-muted max-w-xs">
              Experiências exclusivas de noite premium.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://instagram.com/maisvanta"
                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-text-secondary hover-real:text-gold hover-real:border-gold/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </Link>
              <Link
                href="mailto:contato@maisvanta.com"
                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-text-secondary hover-real:text-gold hover-real:border-gold/40 transition-colors"
                aria-label="E-mail"
              >
                <Mail size={16} />
              </Link>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="kicker mb-4">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-text-secondary hover-real:text-text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-subtle">
            © {new Date().getFullYear()} VANTA. A noite começa aqui.
          </p>
          <div className="flex items-center gap-5 text-xs text-text-subtle">
            <Link href="/termos" className="hover-real:text-text-secondary">
              Termos
            </Link>
            <Link href="/privacidade" className="hover-real:text-text-secondary">
              Privacidade
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
