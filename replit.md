# Discord Staff Application Bot

Bot do Discord que serve como formulário de candidatura à staff, com modal em 3 etapas e envio por email.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — inicia o servidor e o bot do Discord (porta 5000)
- `pnpm run typecheck` — typecheck completo
- `pnpm run build` — typecheck + build

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Discord: discord.js v14
- Email: nodemailer (Gmail SMTP)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/bot/` — todo o código do bot Discord
  - `client.ts` — inicialização do cliente Discord e roteamento de interações
  - `modals.ts` — definição dos 3 modais do formulário + IDs de botões
  - `handlers.ts` — lógica de handler para botões e submissão de modais
  - `embeds.ts` — embeds visuais para cada etapa e estado
  - `session.ts` — sessões em memória por usuário (TTL: 15 min)
  - `mailer.ts` — envio de email HTML via nodemailer
  - `deploy-commands.ts` — registro de slash commands na API do Discord

## Architecture decisions

- Formulário dividido em 3 modais (máximo 5 campos por modal no Discord)
- Sessões em memória com TTL de 15 minutos — suficiente sem precisar de banco
- Bot inicializado junto com o servidor Express no mesmo processo
- `nodemailer` removido da lista de externos do esbuild para ser bundlado corretamente
- Slash command `/staff-form` envia o painel com botão — staff controla o canal

## Product

- Membros usam `/staff-form` no canal para abrir o painel de candidatura
- Formulário com 3 etapas em modal: dados pessoais, experiência/motivação, cenário
- Ao finalizar, candidatura é enviada por email HTML formatado para a staff
- Todas as respostas são efêmeras (só o candidato vê)

## User preferences

- Idioma: Português Brasileiro
- Bot registrado como: Form Bot#1326

## Gotchas

- Gmail requer "Senha de app" (não a senha normal) em EMAIL_PASS quando 2FA está ativo
- O slash command `/staff-form` deve ser usado apenas em canais onde a staff quer receber candidaturas
- Sessões expiram em 15 min — candidato precisa reiniciar se demorar demais

## Env vars necessários

- `DISCORD_TOKEN` — token do bot
- `DISCORD_CLIENT_ID` — ID da aplicação Discord
- `EMAIL_USER` — email remetente (Gmail)
- `EMAIL_PASS` — senha de app do Gmail
- `EMAIL_TO` — email da staff que recebe as candidaturas
