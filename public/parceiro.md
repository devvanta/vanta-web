# VANTA pra quem produz

A VANTA tem um painel B2B completo pra casas noturnas, produtores e promoters. Não é dashboard genérico — é operação real da noite com RBAC, audit log e Stripe Connect.

## 6 cargos RBAC

| Cargo | Escopo | O que pode fazer |
|---|---|---|
| Gerente | Comunidade (casa) | Tudo: financeiro, equipe, eventos, configurações |
| Sócio | Evento | Cockpit completo do evento: vendas, listas, equipe, financeiro |
| Promoter | Evento | Venda com cotas e comissão, gerenciar lista própria, relatório de vendas |
| Caixa | Evento | Venda na porta com PIX/crédito, registro de consumação |
| Portaria de Lista | Evento | Check-in de convidados da lista |
| Portaria de Antecipado | Evento | Check-in por QR code |

Cargo na comunidade cascateia automaticamente pros eventos filhos — não precisa atribuir um por um.

## Fluxos com audit log

- **Publicação**: Rascunho → Pendente → Ativo (VANTA valida).
- **Reembolso**: Solicitação → Sócio → Gerente → Estorno (Stripe refund real).
- **Saque**: Solicitado → Gerente → Liberado.
- **Parceria**: Solicitação → Aprovação.

Quem aprovou, quando e por quê — sempre rastreável.

## Features do painel

- Criação/edição de eventos com variações, lotes, recorrência (semanal/quinzenal/mensal).
- Listas com regras, cotas por promoter, Efeito Abóbora (hora de corte).
- Check-in em tempo real (QR + nome na lista).
- Caixa na porta com PIX e crédito.
- Financeiro com splits automáticos e gateway fee mode (absorver ou repassar).
- Stripe Connect pra receber direto no CNPJ.
- Cortesias com cota configurável por evento.
- Chargeback com trilha de auditoria.

## Comparado a Sympla / Ingresse

- Taxa mais baixa.
- Lista nativa (sem planilha no WhatsApp).
- Relatório real de quem entrou (não estimativa do porteiro).
- Saque rápido (não 14 dias travados).
- Reembolso em fluxo auditável.

## Como entrar

Preencha o formulário em www.maisvanta.com/parceiro. Retorno do time VANTA em até 2 dias úteis.
