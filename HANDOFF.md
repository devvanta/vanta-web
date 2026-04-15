# VANTA Web — Handoff

Site web-first da VANTA, com paridade funcional do app mobile. Identidade VANTA mantida (ver `src/app/globals.css`), layout desktop-first.

Este doc é o plano de integração: o que está mockado, o que precisa ser substituído por chamadas reais ao Supabase (`finalvanta`, `project_id=daldttuibmxwkpbqtebm`) e como encaixar auth, guards e deploy.

---

## Stack

- **Next.js 16.2** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** (tokens em `src/app/globals.css`)
- **Lucide React** (ícones)
- **Framer Motion** (animações)
- **Leaflet + react-leaflet** (mapa do Radar)

### Como rodar

```bash
npm install
npm run dev       # http://localhost:3002
npm run build
npm start
```

---

## Rotas entregues (14)

### Públicas
| Rota                       | Arquivo                              | O que faz |
|----------------------------|--------------------------------------|-----------|
| `/`                        | `src/app/page.tsx`                   | Home (Hero, Eventos, Vanta Indica, Mais Vanta, Notificações, Parceiro, 5 abas, CTA) |
| `/eventos`                 | `src/app/eventos/page.tsx`           | Lista com filtros (cidade, data, preço, gênero, Mais Vanta) |
| `/evento/[slug]`           | `src/app/evento/[slug]/page.tsx`     | Página do evento com line-up, mapa OSM, FAQ, relacionados |
| `/radar`                   | `src/app/radar/page.tsx`             | Mapa Leaflet com pins, drawer lateral |
| `/buscar`                  | `src/app/buscar/page.tsx`            | Busca textual + autosuggest |
| `/mais-vanta`              | `src/app/mais-vanta/page.tsx`        | Landing do clube + formulário aplicação |
| `/parceiro`                | `src/app/parceiro/page.tsx`          | Landing B2B + formulário cadastro de casa |
| `/sobre`                   | `src/app/sobre/page.tsx`             | Manifesto, valores, time, contato |

### Auth
| Rota                       | Arquivo                              | O que faz |
|----------------------------|--------------------------------------|-----------|
| `/entrar`                  | `src/app/entrar/page.tsx`            | Magic link + OAuth (Google/Apple) |
| `/criar-conta`             | `src/app/criar-conta/page.tsx`       | Registro + OAuth |

### Conta (logadas — route group `(conta)`)
| Rota                       | Arquivo                                       | O que faz |
|----------------------------|-----------------------------------------------|-----------|
| `/perfil`                  | `src/app/(conta)/perfil/page.tsx`             | Perfil, privacidade por campo, indicações |
| `/carteira`                | `src/app/(conta)/carteira/page.tsx`           | Ingressos ativos, histórico, cortesias |
| `/mensagens`               | `src/app/(conta)/mensagens/page.tsx`          | Split layout chat 1:1 + grupo |
| `/notificacoes`            | `src/app/(conta)/notificacoes/page.tsx`       | Central com tabs todas/pendentes |

Todas as rotas de `(conta)` usam `src/components/site/user-sidebar.tsx` (sticky sidebar com avatar + nav).

---

## Onde estão os mocks

Todo dado hoje vem de arquivos locais. Trocar cada um por chamadas Supabase:

| Mock                                         | Uso                                              | Substituir por |
|----------------------------------------------|--------------------------------------------------|----------------|
| `src/lib/mock-events.ts`                     | Grid de eventos, cards, relacionados, Radar      | `supabase.from("eventos").select(...)` |
| `src/lib/cities.ts`                          | Filtro de cidade em /eventos, /radar, /buscar    | `comunidades` distinct por `cidade` |
| `src/lib/genres.ts`                          | Badges e filtros de gênero                       | Tabela/enum de gêneros do backend |
| Variações hard-coded em `evento/[slug]/page.tsx` | Sidebar de ingressos do evento              | `variacoes_ingresso` + `lotes` |
| FAQ hard-coded em `evento/[slug]/page.tsx`   | Disclosure no final                              | Opcional: puxar de CMS/tabela `faq_evento` |
| `active`, `history`, `cortesias` em `carteira/page.tsx` | Tabs da carteira                     | `ingressos` + `cortesias_recebidas` |
| `conversations` em `mensagens/page.tsx`      | Lista + thread do chat                           | `mensagens_conversas` + `mensagens_mensagens` |
| `initialNotifs` em `notificacoes/page.tsx`   | Lista de notificações                            | `notificacoes` |
| `indications` em `perfil/page.tsx`           | Card de Vanta Indica                             | `vanta_indicacoes` |
| `privacyFields` em `perfil/page.tsx`         | Toggle público/privado                           | `profiles.privacy_settings` JSONB |
| `stats` em `perfil/page.tsx`                 | Contadores eventos/amigos/cortesias/indicações   | Aggregate queries ou views |
| Formulário `/mais-vanta` (aplicação)         | `handleSubmit` apenas seta state                 | Insert em `mais_vanta_aplicacoes` |
| Formulário `/parceiro` (cadastro de casa)    | `handleSubmit` apenas seta state                 | Insert em `parceiros_solicitacoes` |

---

## Checklist de integração backend

### 1. Setup Supabase
- [x] Instalar `@supabase/supabase-js` e `@supabase/ssr`
- [x] Criar `src/lib/supabase/client.ts` (browser) e `src/lib/supabase/server.ts` (RSC/route handlers)
- [x] Criar `src/lib/supabase/proxy.ts` pro `proxy.ts` (next 16 = antigo middleware)
- [x] Adicionar `src/proxy.ts` na raiz do src com refresh de session
- [x] Variáveis em `.env.local`

### 2. Auth
- [x] `/entrar`: `supabase.auth.signInWithOtp({ email })` no submit do magic link
- [x] Botões OAuth: `supabase.auth.signInWithOAuth({ provider: 'google' | 'apple' })`
- [x] `/criar-conta`: mesmo fluxo + nome via `user_metadata`
- [x] Callback route: `src/app/auth/callback/route.ts` pra trocar o code por sessão
- [x] Logout: `supabase.auth.signOut()` (botão "Sair" em `user-sidebar.tsx`)

### 3. Guards
- [x] `src/app/(conta)/layout.tsx` server-side que verifica sessão com `supabase.auth.getUser()` — se null, `redirect('/entrar')`
- [x] Header: mostrar avatar/nome quando autenticado, "Entrar / Criar conta" quando não

### 4. Data fetching
- [x] Home (/) — RSC com `getPublicEvents()` do Supabase
- [x] /evento/[slug] — RSC com `getEventBySlug()` do Supabase
- [x] /eventos — client-side com `useEvents()` hook
- [x] /buscar — client-side com `useEvents()` hook
- [x] /radar — client-side com `useEvents()` hook
- [x] /perfil — client-side com queries em `profiles`, `ingressos`, `friendships`
- [ ] /carteira — ainda com mocks (precisa join ingressos + variacoes + eventos)
- [ ] /mensagens — ainda com mocks (precisa realtime)
- [ ] /notificacoes — ainda com mocks (precisa realtime)

### 5. Tipos
- [x] Gerar tipos do Supabase: `database.types.ts` (211k chars, 106 tabelas)
- [x] Mapper `toEventCard()` em `src/lib/supabase/queries.ts` e `use-events.ts`

### 6. Realtime (fase 2)
- [ ] Mensagens: subscribe em `mensagens_mensagens` por `conversa_id`
- [ ] Notificações: subscribe em `notificacoes` por `user_id`
- [ ] Radar: marcadores "acontecendo agora" com realtime

### 7. Deploy
- [ ] Vercel (mesmo projeto Vercel do app, ou separado `maisvanta-web`)
- [ ] Domínios sugeridos:
  - Produção: `www.maisvanta.com` (marca; app PWA migra pra subdomínio)
  - Staging: `web-staging.maisvanta.com`
- [ ] Variáveis Vercel: mesmos valores de Supabase do app

---

## Pontos de atenção

- **Identidade visual**: única fonte de verdade é `src/app/globals.css`. Tokens VANTA (6 camadas preto quente, `#FFD300` único, Playfair Display 700 uppercase, Poppins). Não trocar.
- **PT-BR neutro**: textos usam "você", não "cê". Carioca só em campanha regional.
- **Mais Vanta tiers invisíveis**: o usuário NUNCA vê nome de tier. Só "é membro / não é". Benefícios aparecem sem explicar porquê.
- **Ícones**: Lucide React. Nunca emoji em botão/tela.
- **Hover**: `transition-colors`, nunca `scale` em hover. `active:scale-95` em botões.
- **Busca (filtros client-side)**: `/eventos` e `/buscar` filtram `mockEvents` em memória. Com dataset real grande, passar pra query server-side com params na URL.
- **Radar (Leaflet)**: dynamic import com `ssr: false` porque depende de `window`. Ver `src/app/radar/page.tsx`.
- **Pseudo-QR na carteira**: função `QRPlaceholder` gera um padrão visual determinístico a partir do código. Substituir por QR real (ex: `qrcode.react`) quando o backend gerar tokens anti-screenshot.

---

## Estrutura de pastas

```
vanta-web-v2/
├── src/
│   ├── app/
│   │   ├── (conta)/              # route group com sidebar
│   │   │   ├── layout.tsx
│   │   │   ├── perfil/page.tsx
│   │   │   ├── carteira/page.tsx
│   │   │   ├── mensagens/page.tsx
│   │   │   └── notificacoes/page.tsx
│   │   ├── evento/[slug]/page.tsx
│   │   ├── eventos/page.tsx
│   │   ├── radar/page.tsx
│   │   ├── buscar/page.tsx
│   │   ├── mais-vanta/page.tsx
│   │   ├── parceiro/page.tsx
│   │   ├── sobre/page.tsx
│   │   ├── entrar/page.tsx
│   │   ├── criar-conta/page.tsx
│   │   ├── globals.css           # tokens VANTA
│   │   ├── layout.tsx            # root (fonts, header, footer)
│   │   └── page.tsx              # home
│   ├── components/
│   │   ├── site/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── logo.tsx
│   │   │   ├── user-sidebar.tsx
│   │   │   ├── event-card.tsx
│   │   │   ├── oauth-button.tsx
│   │   │   └── radar-map.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── container.tsx
│   └── lib/
│       ├── cities.ts             # mock
│       ├── genres.ts             # constante
│       ├── mock-events.ts        # mock
│       └── utils.ts              # cn()
├── public/
├── HANDOFF.md                    # este arquivo
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Escopo desta entrega

Somente **frontend**. Nenhuma chamada de rede, nenhuma persistência real.
- Todos os forms usam `useState` e simulam sucesso local.
- Auth é UI-only (magic link e OAuth não disparam nada).
- Filtros, busca, chat, notificações rodam 100% em memória com mocks.

A paridade funcional está **desenhada**: cada rota existe com a UX esperada. Falta **apenas** a camada de dados.
