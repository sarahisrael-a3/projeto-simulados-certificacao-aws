# Cloud Certification Study Tool

Atualizado em: 2026-06-18

Simulador colaborativo para estudos de certificacoes AWS, criado pela Guilda dos Estagiarios da A3Data. O projeto combina uma SPA/PWA em HTML, CSS e JavaScript vanilla, dados JSON versionados, API Express, PGlite, automacoes em Python e testes Jest.

## Status Real

- Frontend SPA/PWA funcional, servido a partir de `public/` e gerado por `npm run build`.
- Fonte do frontend em `src/frontend/` e cliente HTTP em `src/services/api.js`.
- Base principal com 2.545 registros JSON em `data/` para CLF-C02, SAA-C03, DVA-C02 e AIF-C01, em PT e EN.
- Diagnosticos por certificacao em `data/nivelamento/`.
- API Express local em `backend/api/server.js`.
- PGlite persistente em `backend/database/`, com schema, normalizadores, seed e testes.
- Painel de validacao em `validation/`, integrado aos endpoints Express de pendencias e aprovacao/rejeicao.
- Suite automatizada verificada em 2026-06-18: `npm test -- --runInBand` passou com 9 suites e 77 testes.
- Build verificado em 2026-06-18: `npm run build` passou.

## O Que Ja Funciona

- Simulados por certificacao.
- Testes diagnosticos.
- Flashcards.
- Pomodoro.
- Historico e progresso local via `localStorage`.
- Dashboard, graficos, insights e relatorio PDF.
- Tema claro/escuro.
- Troca de idioma PT/EN.
- PWA com `public/manifest.json` e `public/sw.js`.
- Fallback offline por JSON/localStorage quando a API nao esta disponivel.
- API para questoes, quiz, usuarios, estatisticas, dominios fracos e leaderboard.
- Seed dos JSONs principais para PGlite.
- Validacao de questoes com status `PENDING`, `APPROVED` e `REJECTED`.

## Requisitos

- Node.js 18+.
- npm.
- Git.
- Python 3.12+ apenas para automacoes em `src/python/scripts/`.

## Instalar

```bash
npm install
```

Copie `.env.example` para `.env` se ainda nao existir:

```bash
cp .env.example .env
```

No Windows/PowerShell:

```powershell
Copy-Item .env.example .env
```

Para rodar API/PGlite local, configure:

```ini
NODE_ENV=development
DB_DATA_DIR=.pglite-data
PORT=3001
```

Fora de `NODE_ENV=test`, `DB_DATA_DIR` e obrigatorio. O arquivo `.env` e local e nao deve ser commitado.

## Rodar Apenas O Frontend

```bash
npm run dev
```

O comando executa `npm run build` e serve `public/`. Abra a URL exibida pelo terminal, normalmente:

```text
http://127.0.0.1:8080
```

## Preparar PGlite Com Seed

```bash
npm run db:seed
```

Opcionalmente:

```bash
npm run db:seed -- --data-dir .pglite-data
```

## Rodar A API Express

```bash
npm run api:start
```

Health check:

```text
http://127.0.0.1:3001/api/health
```

## Rodar App Completo Local

Use tres terminais:

```bash
npm install
npm run db:seed
```

```bash
npm run api:start
```

```bash
npm run dev
```

## Comandos Oficiais

```bash
npm test                 # Executa Jest
npm test -- --runInBand  # Executa Jest em serie
npm run lint             # Verifica JS do frontend
npm run format           # Formata frontend/public HTML
npm run format:check     # Verifica formatacao
npm run build            # Copia src/ e data/ para public/
npm run dev              # Build + live-server public/
npm run db:seed          # Popula PGlite com JSONs principais
npm run db:start         # Inicializa camada demonstrativa antiga
npm run api:start        # Inicia API Express oficial atual
```

## Estrutura Real

```text
backend/api/            API Express e rotas REST
backend/database/       PGlite, schema, normalizadores e testes
data/                   Fonte dos JSONs de questoes e diagnosticos
docs/                   Documentacao tecnica e planejamento
public/                 Artefato servido pelo frontend/PWA
scripts/                Build e seed
src/frontend/           Fonte principal do frontend
src/services/           Cliente HTTP da API
src/python/scripts/     Automacoes de validacao, traducao e geracao
validation/             Painel interno de validacao
__tests__/              Testes Jest
```

Trate `src/`, `data/` e `validation/` como fontes. O diretorio `public/` e sincronizado por `npm run build`.

## Documentacao

- [Checklist](docs/CHECKLIST.md)
- [Roadmap](docs/ROADMAP.md)
- [Epicos e tasks](docs/EPICOS-E-TASKS.md)
- [Rotas e integracoes](docs/ROUTES_AND_INTEGRATIONS.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [PGlite setup](docs/PGLITE_SETUP.md)
- [Guia de contribuicao](docs/CONTRIBUTING.md)

## Verificacao Recomendada Antes De Apresentar

```bash
npm test -- --runInBand
npm run build
```

Depois rode `npm run api:start` e `npm run dev` em terminais separados para demonstrar o app completo.
