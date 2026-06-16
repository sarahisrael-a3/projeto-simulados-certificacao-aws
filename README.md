# Cloud Certification Study Tool

Simulador colaborativo para estudos de certificacoes AWS, criado pela Guilda dos Estagiarios da A3Data. O projeto combina uma SPA/PWA em HTML, CSS e JavaScript vanilla, dados JSON versionados, API Express com PGlite, automacoes em Python e testes Jest.

## O Que Ja Funciona

- Simulados para CLF-C02, SAA-C03, DVA-C02 e AIF-C01.
- Base de questoes PT/EN em `data/`, copiada para `public/data/` no build.
- Modo diagnostico, flashcards, Pomodoro, historico local, dashboard e relatorio PDF.
- PWA com `public/manifest.json` e `public/sw.js`.
- API Express local em `http://127.0.0.1:3001`.
- PGlite persistente para questoes, usuarios, historico, respostas, estatisticas e leaderboard.
- Seed reprodutivel dos JSONs principais para PGlite.
- Workflows GitHub Actions para testes, deploy e validacao de contribuicoes.

## Requisitos

- Node.js 18+.
- npm.
- Git.

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

Edite o `.env` local. Para API/PGlite local, o ponto essencial e:

```ini
NODE_ENV=development
DB_DATA_DIR=.pglite-data
PORT=3001
```

`DB_DATA_DIR` define onde o PGlite salva os dados locais. Fora de `NODE_ENV=test`, o seed e a API exigem um diretorio persistente. Em testes, pode ser usado `memory://`. O arquivo `.env` e local, nao deve ser commitado; versionamos apenas `.env.example`.

## Rodar Apenas o Frontend

O frontend usa os JSONs locais como fallback offline. Este modo e suficiente para demonstrar simulados, flashcards, dashboard e PWA sem API.

```bash
npm run dev
```

O comando executa `npm run build` e serve `public/` com `live-server`.

Abra:

```text
http://127.0.0.1:8080
```

O `live-server` pode escolher outra porta se a 8080 estiver ocupada; use a URL mostrada no terminal.

## Preparar PGlite Com Seed Dos JSONs

O seed le os arquivos principais em `data/`, normaliza os campos minimos e evita duplicar questoes ja importadas pela combinacao `certification + domain + question_text`.

Com `.env` configurado:

```bash
npm run db:seed
```

Opcionalmente informe o diretorio no proprio comando:

```bash
npm run db:seed -- --data-dir .pglite-data
```

Alternativa temporaria no Windows/PowerShell, sem editar `.env`:

```powershell
$env:DB_DATA_DIR=".pglite-data"
npm run db:seed
```

O script falha explicitamente em JSON invalido ou questao sem campos obrigatorios.

## Rodar a API Express

Em outro terminal, depois de configurar `DB_DATA_DIR` e, idealmente, rodar o seed:

```bash
npm run api:start
```

Health check:

```text
http://127.0.0.1:3001/api/health
```

Endpoints principais:

- `GET /api/health`
- `GET /api/questions`
- `GET /api/questions/:id`
- `POST /api/questions`
- `PUT /api/questions/:id`
- `DELETE /api/questions/:id`
- `POST /api/quiz/start`
- `POST /api/quiz/:id/answer`
- `GET /api/quiz/:id/results`
- `POST /api/users`
- `GET /api/users/:id/stats`
- `GET /api/users/:id/weak-domains`
- `GET /api/leaderboard`

## Rodar App Completo Local

Use tres terminais:

```bash
# Terminal 1: instalar/preparar dados uma vez
npm install
cp .env.example .env
npm run db:seed
```

No Windows/PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run db:seed
```

```bash
# Terminal 2: API + PGlite
npm run api:start
```

```bash
# Terminal 3: frontend
npm run dev
```

Quando a API esta disponivel, o frontend tenta usar endpoints REST para questoes, quiz, usuario e leaderboard. Se a API cair ou estiver vazia, o app mantem fallback para JSON/localStorage para preservar o modo offline/PWA.

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
npm run db:start         # Inicializa camada de banco demonstrativa
npm run api:start        # Inicia API Express
```

## Estrutura Real

```text
backend/api/            API Express e rotas REST
backend/database/       PGlite, schema, normalizadores e testes de banco
data/                   Fonte dos JSONs de questoes e diagnosticos
docs/                   Documentacao tecnica e planejamento
public/                 Artefato servido pelo frontend/PWA
scripts/                Build e seed
src/frontend/           Fonte principal do frontend
src/services/           Cliente HTTP da API usado pelo frontend
src/python/scripts/     Automacoes de validacao, traducao e geracao
validation/             Painel interno em modo demo/mock
__tests__/              Testes Jest
```

Trate `src/` e `data/` como fontes. O diretorio `public/` e sincronizado por `npm run build`.

## Painel de Validacao

O painel em `validation/` esta em modo demo/mock local. Ele serve para demonstrar o fluxo visual de aprovacao/reprovacao, mas nao persiste status no banco e nao deve ser apresentado como validacao real.

## Documentacao

- [Roadmap](docs/ROADMAP.md)
- [Checklist](docs/CHECKLIST.md)
- [Rotas e integracoes](docs/ROUTES_AND_INTEGRATIONS.md)
- [PGlite setup](docs/PGLITE_SETUP.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Guia de contribuicao](docs/CONTRIBUTING.md)

## Verificacao Recomendada Antes Da Apresentacao

```bash
npm test -- --runInBand
npm run build
```

Depois, rode `npm run api:start` e `npm run dev` em terminais separados para demonstrar o app completo.

## Troubleshooting

### `DB_DATA_DIR is required outside the test environment.`

Causa: a variavel `DB_DATA_DIR` nao foi configurada fora do ambiente de teste.

Solucao: crie ou edite `.env` com:

```env
DB_DATA_DIR=.pglite-data
```

Depois rode novamente:

```bash
npm run db:seed
```

No Windows/PowerShell, voce tambem pode configurar temporariamente:

```powershell
$env:DB_DATA_DIR=".pglite-data"
npm run db:seed
```
