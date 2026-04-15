# Como funciona a VANTA

A VANTA é uma plataforma de vida noturna com app mobile (PWA) e site desktop. Paridade funcional entre os dois canais: qualquer coisa que se faz em um, se faz no outro.

## As 5 abas do app

### 1. Início
Feed da sua cidade com eventos curados, recomendações e trending. É onde a noite começa — você vê o que tá rolando antes de procurar algo específico.

### 2. Radar
Mapa interativo com eventos próximos. Filtros por cidade, gênero, data, preço e distância. Dá pra ver o que acontece em tempo real.

### 3. Buscar
Busca textual com autosuggest por nome, casa, gênero ou cidade. Pra quem já sabe o que quer.

### 4. Mensagens
Chat 1:1 com reactions, status online e archive. Amizades integradas. Pra combinar rolê sem sair do app.

### 5. Perfil
Avatar, privacidade por campo (você escolhe o que aparece pros outros), histórico de eventos, carteira de ingressos e status MAIS VANTA.

## Fluxo típico de uso

1. Abre o app → vê o feed/radar na sua cidade.
2. Escolhe um evento → página do evento com line-up, local, variações de ingresso, FAQ.
3. Compra → Stripe, ingresso cai na carteira em segundos.
4. Opcional: transfere pra um amigo em um toque.
5. Dia do evento → QR anti-screenshot na portaria. Check-in em segundos.
6. Pós-evento → histórico, avaliação, benefícios MAIS VANTA desbloqueados.

## Carteira e ingresso

- Ingresso digital com QR anti-screenshot.
- PIN com hash PBKDF2 pra abrir o QR — se alguém pegar seu celular, não acessa.
- Transferência real entre usuários (muda o dono no backend, não é só compartilhamento).
- Cortesias enviadas por casas parceiras aparecem direto na carteira.

## Notificações

Push nativo (Android, iOS em breve) e web via FCM. Lembretes de evento comprado, cortesia recebida, ingresso transferido, mensagem nova, benefícios MAIS VANTA desbloqueados.

## Pra quem produz evento

Painel admin B2B separado, com RBAC de 6 cargos: Gerente, Sócio, Promoter, Caixa, Portaria de Lista, Portaria de Antecipado. Cada um vê só o que precisa. Ver [pra quem produz](/parceiro.md).
