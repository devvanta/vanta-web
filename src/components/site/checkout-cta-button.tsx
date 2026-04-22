"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

/**
 * CTA de compra de ingresso no landing do evento.
 *
 * Por que Client Component? Durante SSR não sabemos se o user tá logado, e
 * precisar disso força a página pai a ser dinâmica — perdemos ISR.
 *
 * Render inicial (SSR): "Garantir ingresso" → /checkout/[slug]. Segue o
 * comportamento do /checkout em si, que valida auth e redireciona pra
 * /entrar?next=... se precisar. Botão funciona tanto deslogado quanto
 * logado — só muda o label no hidrate pra refletir o estado real.
 *
 * Fix #177 H1 (2026-04-21): permite ISR em /evento/[slug].
 */
export function CheckoutCtaButton({ slug }: { slug: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setIsLoggedIn(!!user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setIsLoggedIn(!!session?.user);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Fallback SSR e loading: label neutro. Clicar leva a /checkout que
  // trata auth corretamente (redireciona pra /entrar?next=... se precisa).
  if (isLoggedIn === null) {
    return (
      <Button href={`/checkout/${slug}`} className="w-full" size="lg">
        Garantir ingresso
      </Button>
    );
  }

  return isLoggedIn ? (
    <Button href={`/checkout/${slug}`} className="w-full" size="lg">
      Garantir ingresso
    </Button>
  ) : (
    <Button href={`/entrar?next=/checkout/${slug}`} className="w-full" size="lg">
      Entrar pra comprar
    </Button>
  );
}
