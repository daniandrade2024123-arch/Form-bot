# Discord Staff Application Bot

Bot do Discord multi-servidor com formulário de candidatura à staff em 3 etapas, avaliação por canal e onboarding personalizado.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — inicia o servidor e o bot (porta 8080)
- `pnpm run typecheck` — typecheck completo
- `pnpm run build` — typecheck + build

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Discord: discord.js v14
- Build: esbuild (ESM bundle)

## Where things live

- `artifacts/api-server/src/bot/`
  - `client.ts` — cliente Discord, roteamento de interações, handlers de slash commands
  - `client-singleton.ts` — singleton do client (evita dependência circular)
  - `modals.ts` — 3 modais do formulário + modais de aprovar/recusar + IDs de botões
  - `handlers.ts` — lógica de botões e modais (formulário + avaliação)
  - `embeds.ts` — todos os painéis Components V2
  - `session.ts` — sessões em memória por usuário (TTL: 15 min)
  - `applications.ts` — candidaturas pendentes aguardando avaliação (em memória)
  - `guild-config.ts` — config por servidor (canal de candidaturas), persistido em `guild-configs.json`
  - `deploy-commands.ts` — registro de slash commands na API do Discord

## Architecture decisions

- Formulário dividido em 3 modais (máximo 5 campos por modal no Discord)
- Sessões em memória com TTL de 15 minutos — suficiente sem banco
- Bot inicializado junto com o servidor Express no mesmo processo
- Config por servidor salva em `guild-configs.json` no disco (persiste entre reinicios no Replit; no Railway, montar volume em `/app`)
- Singleton do client separado em `client-singleton.ts` para evitar dependência circular com `handlers.ts`

## Product — Fluxo completo

**Configuração (admin, uma vez por servidor):**
1. Admin usa `/staff-setup canal:#candidaturas` — define onde as candidaturas aparecem
   - Requer permissão `Gerenciar Servidor`
   - Configuração salva em disco, sobrevive a reinicios

**Candidatura (membro):**
1. Admin usa `/staff-form` no canal público para postar o painel de candidatura
2. Membro clica "Iniciar Candidatura" → preenche 3 etapas de modal
3. Clica "Enviar" → card Components V2 aparece no canal configurado pelo admin
4. Membro recebe confirmação efêmera: "aguarde avaliação por DM"

**Avaliação (admin, no card do canal):**
- **✅ Aprovar** → modal com: mensagem de boas-vindas, cargo, próximos passos
  → DM enviada ao candidato + card editado para "✅ APROVADO"
- **❌ Recusar** → modal com: motivo + feedback opcional
  → DM enviada ao candidato + card editado para "❌ RECUSADO"

## User preferences

- Idioma: Português Brasileiro
- Bot registrado como: Form Bot#1326

## Gotchas

- Sessões expiram em 15 min — candidato precisa reiniciar se demorar
- DMs podem falhar se o candidato tiver DMs desativadas — o bot loga um aviso mas não falha
- No Railway: montar volume em `/app` para `guild-configs.json` sobreviver a redeploys
- `/staff-setup` requer permissão "Gerenciar Servidor" para ser usado

## Env vars necessários

- `DISCORD_TOKEN` — token do bot
- `DISCORD_CLIENT_ID` — ID da aplicação Discord
