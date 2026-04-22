# Pendências — decisões do Dan (vanta-web)

Itens descobertos durante fix #177 que precisam de decisão.

---

## 2026-04-21 — ISR em `/evento/[slug]`

**Contexto (Fix #177 H1):** `/eventos` e `/` ganharam `export const revalidate = 60` pra cachear via ISR. Mas `/evento/[slug]` tem `supabase.auth.getUser()` dentro do Server Component pra mudar CTA (Comprar vs Entrar pra comprar), o que força dynamic rendering e ignora ISR.

**Opções:**

1. **Refactor:** mover o check de auth pra Client Component pequeno. Landing principal fica 100% ISR (cache 60s), botão de CTA hidrata dinamicamente baseado em cookie.
2. **Dual rendering:** Next.js 16 permite `generateStaticParams` + `revalidate` + `dynamicParams=true`. Páginas de eventos populares pré-geradas no build, resto ISR on-demand.
3. **Aceitar dynamic:** deixa como tá — cada request refaz fetch. Performance pior mas simples.

**Recomendação Claude:** opção 1 é o certo pra SEO (landing de evento é a URL compartilhada mais comum). Custo: ~2h de refactor.

**Aguardando decisão Dan.**

---
