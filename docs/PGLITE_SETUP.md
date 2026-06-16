# PGlite Setup

PGlite e a camada de banco local usada pela API Express. Ela permite demonstrar persistencia sem depender de um PostgreSQL externo.

## Arquivos

```text
backend/database/db.js          camada publica de acesso ao banco
backend/database/schema.sql     schema principal
backend/database/normalizers.js normalizadores compartilhados
backend/database/db.test.js     testes da camada de banco
scripts/seed-pglite.mjs         seed dos JSONs principais
```

## Variaveis

Configure `.env` ou variaveis de ambiente:

```ini
NODE_ENV=development
DB_DATA_DIR=.pglite-data
PORT=3001
```

Regras:

- fora de `NODE_ENV=test`, `DB_DATA_DIR` e obrigatorio;
- em testes, o banco usa `memory://`;
- `memory://` nao e permitido em desenvolvimento/producao.
- `.env` e local e nao deve ser commitado; versionamos apenas `.env.example`.

Para criar o `.env`:

```bash
cp .env.example .env
```

No Windows/PowerShell:

```powershell
Copy-Item .env.example .env
```

Alternativa temporaria no PowerShell:

```powershell
$env:DB_DATA_DIR=".pglite-data"
npm run db:seed
```

## Criar Banco E Popular Dados

```bash
npm run db:seed
```

Com diretorio explicito:

```bash
npm run db:seed -- --data-dir .pglite-data
```

O seed le os JSONs principais PT/EN em `data/`, normaliza campos minimos e evita duplicar registros ja importados.

## Rodar API Com PGlite

```bash
npm run api:start
```

Health check:

```text
http://127.0.0.1:3001/api/health
```

## Rodar Testes

```bash
npm test -- backend/database/db.test.js --runInBand
npm test -- __tests__/api.integration.test.js --runInBand
```

## Funcoes Principais

- `initializeDatabase(options)`
- `closeDatabase()`
- `executeQuery(sql, params)`
- `executeSql(sql)`
- `getQuestions(filters)`
- `insertQuestion(question)`
- `createUser(name)`
- `createQuizHistory(data)`
- `recordAnswer(data)`
- `getLeaderboard(limit)`
- `getWeakDomains(userId, threshold)`

## Observacoes

- O schema completo ja existe e e aplicado por `initializeDatabase()`.
- A API Express usa essa camada diretamente.
- O frontend continua com fallback para JSON/localStorage para preservar o modo offline.
- O painel de validacao ainda esta em modo demo/mock e nao grava status de aprovacao no banco.

## Troubleshooting

### `DB_DATA_DIR is required outside the test environment.`

Causa: `DB_DATA_DIR` nao foi configurado e o processo nao esta rodando com `NODE_ENV=test`.

Solucao:

```env
DB_DATA_DIR=.pglite-data
```

Depois:

```bash
npm run db:seed
```

Em testes automatizados, `memory://` e permitido:

```powershell
$env:NODE_ENV="test"
$env:DB_DATA_DIR="memory://"
npm run db:seed
```
