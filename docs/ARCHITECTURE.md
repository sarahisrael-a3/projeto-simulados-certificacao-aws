# Arquitetura Do Projeto

Atualizado em: 2026-06-18

O Cloud Certification Study Tool usa uma arquitetura local-first. O frontend funciona com JSON/localStorage para preservar PWA/offline e, quando disponivel, conversa com uma API Express local que usa PGlite.

## Visao Geral

```text
Navegador
  |
  | SPA/PWA em public/
  |
  |-- API preferencial: http://127.0.0.1:3001/api
  |       |
  |       |-- backend/api/server.js
  |       |-- backend/api/routes/*
  |       |-- backend/database/db.js
  |       |-- PGlite em DB_DATA_DIR
  |
  |-- fallback offline
          |
          |-- public/data/*.json
          |-- localStorage
          |-- service worker/cache
```

## Camadas

| Camada | Fonte | Artefato/execucao | Responsabilidade |
| --- | --- | --- | --- |
| Frontend | `src/frontend/` | `public/` | UI, quiz, dashboard, flashcards, PWA |
| Cliente API | `src/services/api.js` | `public/services/api.js` | HTTP, timeout e fallback |
| Dados | `data/` | `public/data/` e PGlite seedado | Questoes, diagnosticos, desafios |
| API | `backend/api/` | Node/Express | Rotas REST |
| Banco | `backend/database/` | PGlite | Persistencia local |
| Validacao | `validation/` | `public/validation/` | Revisao interna de questoes |
| Automacao | `src/python/scripts/` | Python local/CI | Geracao, traducao, merge e validacao |

## Frontend

Fonte principal:

- `src/frontend/js/`
- `src/frontend/styles/`
- `src/services/api.js`

Artefato servido:

- `public/js/`
- `public/css/`
- `public/services/`
- `public/data/`

O build copia a fonte para `public/`. Mudancas permanentes devem nascer em `src/`, `data/` ou `validation/`.

## Dados JSON

Os JSONs em `data/` sao fonte versionada e alimentam:

- fallback offline;
- build para GitHub Pages;
- seed para PGlite;
- scripts Python de validacao e manutencao.

Contagem principal em 2026-06-18:

- CLF-C02: 402 PT + 402 EN.
- SAA-C03: 295 PT + 293 EN.
- DVA-C02: 287 PT + 287 EN.
- AIF-C01: 290 PT + 289 EN.

## API Express

Entrada principal: `backend/api/server.js`.

Middlewares atuais:

- Helmet.
- CORS.
- Rate limit em `/api`.
- JSON/urlencoded parser.
- Logger simples.
- Error handler global.

Rotas:

- `backend/api/routes/questions.js`
- `backend/api/routes/quizzes.js`
- `backend/api/routes/users.js`
- `GET /api/leaderboard` no servidor principal.

## Banco PGlite

Arquivos:

- `backend/database/db.js`
- `backend/database/schema.sql`
- `backend/database/normalizers.js`

O banco armazena:

- usuarios anonimos;
- dominios;
- questoes;
- status de validacao;
- historico de quiz;
- respostas;
- gamificacao;
- sessoes de foco.

Fora de testes, configure `DB_DATA_DIR`.

## Validacao De Questoes

Fluxo oficial atual:

```text
validation/valid.html
  -> validation/js/validationAPI.js
  -> GET /api/questions/pending
  -> POST /api/questions/:id/validate
  -> backend/database/db.js
  -> questions.validation_status / rejection_reason / validation_logs
```

O backend FastAPI em `validation/backend/` ainda existe, mas nao e o caminho oficial atual.

## Seed

`scripts/seed-pglite.mjs` importa JSONs principais PT/EN para PGlite:

```bash
npm run db:seed
```

Ele normaliza campos, adiciona tags de origem/idioma e evita duplicidade por `certification + domain + question_text`.

## Testes E Build

Verificado em 2026-06-18:

```bash
npm test -- --runInBand
npm run build
```

Resultado: 9 suites e 77 testes passaram; build concluiu com sucesso.

## Riscos Arquitetonicos

- O frontend ainda mistura API e fallback local por desenho local-first.
- Nem todas as rotas antigas planejadas existem.
- O contrato de resposta da API ainda nao e totalmente uniforme.
- `validation/backend/` precisa de decisao: remover, arquivar ou reintegrar.
- Falta teste e2e real no navegador.
