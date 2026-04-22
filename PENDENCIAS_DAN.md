# Pendências — decisões do Dan (vanta-web)

Itens descobertos durante fix #177 que precisam de decisão.

---

## 2026-04-21 — ISR em `/evento/[slug]` — RESOLVIDO

**Status:** ✅ Resolvido em 2026-04-22 (opção 1 aplicada).

**Fix:** Extraído `<CheckoutCtaButton slug={slug} />` em Client Component (`src/components/site/checkout-cta-button.tsx`). Server Component não chama mais `supabase.auth.getUser()`. Adicionado `export const revalidate = 60`. Landing agora 100% ISR.

**Verificado:** tsc 0 erros. Botão usa `onAuthStateChange` pra reagir a login/logout em tempo real sem reload.

---
