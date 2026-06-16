# Arquitetura do Projeto

Atualizado em: 2026-06-16

O Cloud Certification Study Tool usa uma arquitetura local-first: o frontend continua funcionando com JSON/localStorage para preservar o modo PWA/offline, mas tambem pode usar uma API Express com PGlite quando disponivel.

## Visao Geral

```text
Navegador
  |
  | Frontend SPA/PWA em public/
  |
  |-- tenta API Express em http://127.0.0.1:3001
  |       |
  |       |-- backend/api/*
  |       |-- backend/database/db.js
  |       |-- PGlite em DB_DATA_DIR
  |
  |-- fallback offline
          |
          |-- public/data/*.json
          |-- localStorage
          |-- service worker/cache
```

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

O build copia os arquivos de fonte para `public/`. Evite editar `public/js` e `public/css` manualmente quando a mudanca deve nascer em `src/`.

## Dados JSON

Os arquivos em `data/` sao a fonte versionada das questoes e diagnosticos. Eles tambem alimentam:

- o fallback offline do frontend;
- o build para GitHub Pages;
- o seed para PGlite via `npm run db:seed`.

## API Express

Entrada principal:

- `backend/api/server.js`

Rotas:

- `backend/api/routes/questions.js`
- `backend/api/routes/quizzes.js`
- `backend/api/routes/users.js`

Responsabilidades:

- listar/criar/atualizar/remover questoes;
- criar usuarios anonimos;
- iniciar quiz;
- registrar respostas;
- calcular resultado e dominios fracos;
- expor leaderboard.

## Banco PGlite

Arquivos:

- `backend/database/db.js`
- `backend/database/schema.sql`
- `backend/database/normalizers.js`

O banco armazena:

- usuarios anonimos;
- questoes;
- historico de quiz;
- respostas;
- gamificacao;
- sessoes de foco;
- dominios;
- views de leaderboard e estatisticas.

Fora de testes, configure `DB_DATA_DIR`.

## Seed

O script `scripts/seed-pglite.mjs` importa os JSONs principais PT/EN para PGlite.

```bash
npm run db:seed
```

Ele e idempotente para reexecucoes comuns: se uma questao com mesma certificacao, dominio e texto ja existir, ela e ignorada.

## Automacoes Python

Os scripts em `src/python/scripts/` cuidam de tarefas de contribuicao e qualidade de dados:

- validacao de contribuicoes;
- deteccao de duplicidades;
- geracao/traducao de questoes;
- merge de contribuicoes aprovadas.

## GitHub Actions

Workflows principais:

- `test-javascript.yml`: testes Jest para frontend/backend/scripts relevantes.
- `test-python-scripts.yml`: validacoes Python.
- `validate-contributions.yml`: valida arquivos em `data/contributions/`.
- `deploy-pages.yml`: build e deploy do frontend em GitHub Pages.

## Painel De Validacao

O diretorio `validation/` contem uma interface demo/mock para revisao de questoes. No estado atual, aprovacoes e rejeicoes nao sao persistidas no PGlite.

Endpoints planejados, ainda nao implementados:

- `GET /api/questions/pending`
- `POST /api/questions/:id/validate`

## Direcao De Evolucao

Prioridades antes de novas features grandes:

1. Consolidar API + PGlite como caminho local oficial.
2. Manter fallback offline por JSON/localStorage.
3. Integrar painel de validacao a endpoints reais quando a arquitetura for decidida.
4. Melhorar auditoria de qualidade dos dados PT/EN.
