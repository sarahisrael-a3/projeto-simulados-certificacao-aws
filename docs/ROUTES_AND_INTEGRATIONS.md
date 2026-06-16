# Rotas e Integracoes

Atualizado em: 2026-06-16

Este documento descreve o estado real das rotas, fontes de dados e integracoes locais do projeto.

## Resumo

| Item | Status | Porta/Origem | Observacao |
| --- | --- | --- | --- |
| Frontend SPA/PWA | Implementado | `public/` via `npm run dev` | Usa `src/frontend/` como fonte e `public/` como build |
| JSON local/offline | Implementado | `public/data/` | Copiado de `data/` por `npm run build` |
| API Express | Implementado | `http://127.0.0.1:3001` | Rotas em `backend/api/` |
| PGlite | Implementado | `DB_DATA_DIR` | Schema em `backend/database/schema.sql` |
| Seed JSON -> PGlite | Implementado | `npm run db:seed` | Importa JSONs principais PT/EN |
| Painel de validacao | Demo/mock | `validation/` e `public/validation/` | Nao persiste aprovacoes/rejeicoes |

## Como Rodar Localmente

### Frontend offline/fallback

```bash
npm run dev
```

Esse comando executa build e serve `public/`. Os dados sao carregados de `public/data/`.

### Banco local com dados dos JSONs

Configure `.env`:

```ini
NODE_ENV=development
DB_DATA_DIR=.pglite-data
PORT=3001
```

Crie o arquivo local a partir do exemplo:

```bash
cp .env.example .env
```

No Windows/PowerShell:

```powershell
Copy-Item .env.example .env
```

`DB_DATA_DIR` e obrigatorio fora de `NODE_ENV=test`; ele define onde o PGlite grava os dados locais. O arquivo `.env` nao deve ser commitado.

Rode o seed:

```bash
npm run db:seed
```

### API Express

```bash
npm run api:start
```

Health check:

```text
GET http://127.0.0.1:3001/api/health
```

### App completo

Use terminais separados:

```bash
npm run db:seed
npm run api:start
npm run dev
```

O frontend tenta usar a API quando ela esta disponivel e mantem fallback para JSON/localStorage quando ela nao esta.

## Fluxo de Dados

```text
src/frontend/ + src/services/ + data/
        |
        | npm run build
        v
public/js + public/services + public/data
        |
        | navegador/PWA
        v
API Express opcional -> PGlite persistente
        |
        | fallback quando indisponivel
        v
JSON local + localStorage
```

## Fetches Do Frontend

### Quiz principal

Origem:

- API preferencial: `src/frontend/js/quizEngine.js` chama `apiService.loadQuestions()`.
- Fallback: `fetch("data/{certId}.json")` ou `fetch("data/{certId}-en.json")`.

Arquivos:

- `data/clf-c02.json`
- `data/clf-c02-en.json`
- `data/saa-c03.json`
- `data/saa-c03-en.json`
- `data/dva-c02.json`
- `data/dva-c02-en.json`
- `data/aif-c01.json`
- `data/aif-c01-en.json`

### Diagnostico

Origem:

- API tentada por `apiService.loadQuestions({ search: "diagnostic" })`.
- Fallback principal: `data/nivelamento/diagnostic-{certId}.json`.
- Fallback de idioma: se EN nao existir, tenta PT.

### Gamificacao interativa

Origem:

- `data/gamificacao/interactive-challenges.json`.

### Leaderboard

Origem:

- API: `GET /api/leaderboard`.
- Fallback: dados locais/mock combinados no frontend.

## API Express Real

Arquivo principal: `backend/api/server.js`.

### Health

```text
GET /api/health
```

Resposta:

```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2026-06-16T00:00:00.000Z"
}
```

### Questoes

```text
GET /api/questions
GET /api/questions?certification=CLF-C02&domain=faturamento&difficulty=easy&limit=10&offset=0
GET /api/questions?search=s3&limit=20
GET /api/questions/:id
POST /api/questions
PUT /api/questions/:id
DELETE /api/questions/:id
```

Payload minimo para `POST /api/questions`:

```json
{
  "certification": "CLF-C02",
  "domain": "faturamento",
  "difficulty": "easy",
  "question_text": "Question text with at least ten characters",
  "options": ["A", "B", "C", "D"],
  "correct_answer": [0],
  "explanation": "Why the answer is correct"
}
```

### Quiz

```text
POST /api/quiz/start
POST /api/quizzes/start
POST /api/quiz/:id/answer
POST /api/quizzes/:id/answer
GET /api/quiz/:id/results
GET /api/quizzes/:id/results
GET /api/quiz/:id
GET /api/quizzes/:id
```

Iniciar quiz:

```json
{
  "user_id": "uuid-do-usuario",
  "certification": "CLF-C02",
  "num_questions": 10
}
```

Responder:

```json
{
  "question_id": "uuid-da-questao",
  "user_answer": 0,
  "time_secs": 12
}
```

O backend calcula `is_correct` com base em `questions.correct_answer`; ele nao confia no `is_correct` enviado pelo cliente.

### Usuarios

```text
POST /api/users
GET /api/users/:id/stats
GET /api/users/:id/weak-domains?threshold=70
```

Criar usuario anonimo:

```json
{
  "anonymous_name": "CloudNinja#1234"
}
```

Se `anonymous_name` nao for enviado, a API gera um nome anonimo.

### Leaderboard

```text
GET /api/leaderboard?limit=100
```

## PGlite

Arquivos principais:

- `backend/database/db.js`
- `backend/database/schema.sql`
- `backend/database/normalizers.js`
- `backend/database/db.test.js`

O banco exige `DB_DATA_DIR` fora de `NODE_ENV=test`. Em testes, usa `memory://`.

## Seed Dos JSONs

Comando:

```bash
npm run db:seed
```

Ou:

```bash
npm run db:seed -- --data-dir .pglite-data
```

Alternativa temporaria no Windows/PowerShell:

```powershell
$env:DB_DATA_DIR=".pglite-data"
npm run db:seed
```

O seed importa:

- `data/clf-c02.json`
- `data/clf-c02-en.json`
- `data/saa-c03.json`
- `data/saa-c03-en.json`
- `data/dva-c02.json`
- `data/dva-c02-en.json`
- `data/aif-c01.json`
- `data/aif-c01-en.json`

Caracteristicas:

- normaliza certificacao, campos de pergunta, alternativas, resposta correta, referencia e tags;
- adiciona tags `language:{pt|en}` e `source:{arquivo}`;
- evita duplicidade por `certification + domain + question_text`;
- falha explicitamente em JSON invalido ou questao sem campos obrigatorios;
- registra importados, ignorados e lidos por certificacao/idioma.

Erro conhecido:

```text
DB_DATA_DIR is required outside the test environment.
```

Causa: `DB_DATA_DIR` nao foi configurado. Solucao: crie `.env` com `DB_DATA_DIR=.pglite-data` ou passe `-- --data-dir .pglite-data`.

## Build

Comando:

```bash
npm run build
```

O build:

- copia `src/frontend/js/` para `public/js/`;
- copia `src/frontend/styles/` para `public/css/`;
- copia `src/services/` para `public/services/`;
- copia arquivos selecionados de `data/` para `public/data/`;
- copia `validation/` para `public/validation/`;
- preserva arquivos necessarios para GitHub Pages.

## Painel De Validacao

Arquivos:

- `validation/valid.html`
- `validation/js/validationAPI.js`
- `validation/js/validationUI.js`
- `validation/js/validationStorage.js`

Status atual: demo/mock local.

Ele nao persiste aprovacoes, rejeicoes, validador, data ou motivo no PGlite. Os contratos planejados estao documentados em `window.VALIDATION_API_CONTRACT`, mas os endpoints reais abaixo ainda nao existem:

```text
GET /api/questions/pending
POST /api/questions/:id/validate
```

## Testes

```bash
npm test -- --runInBand
npm test -- __tests__/api.integration.test.js --runInBand
```

Cobertura atual relevante:

- banco PGlite e queries principais;
- API service/fallback;
- quiz engine;
- storage manager;
- sprint manager;
- endpoints Express criticos via teste de integracao.
