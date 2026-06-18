# Documentacao Fluida

Atualizado em: 2026-06-18

Este documento explica o projeto em linguagem continua, para leitura de contexto.

## 1. Visao Geral

O Cloud Certification Study Tool e uma plataforma de estudo para certificacoes AWS. Ele nasceu como simulador local/offline e evoluiu para uma aplicacao local-first com API e banco opcional.

Na pratica, isso significa:

- se a API nao estiver rodando, o app usa JSON e localStorage;
- se a API estiver rodando, o app pode buscar dados e persistir progresso no PGlite;
- o build copia fontes para `public/`, que e o diretorio servido ao navegador.

## 2. Frontend

O frontend fica em `src/frontend/`.

Arquivos importantes:

- `app.js`: orquestra a interface.
- `quizEngine.js`: regras do simulado.
- `quizManager.js`: fluxo de quiz.
- `storageManager.js`: persistencia local.
- `flashcards.js`: modo flashcards.
- `pomodoroManager.js`: modo Pomodoro.
- `chartManager.js`: graficos.
- `pdfReport.js`: relatorio PDF.
- `gamificacao/*`: trilha, badges, sprint, leaderboard e desafios.
- `i18n/*`: traducoes PT/EN.

`public/` e artefato. Quando mudar fonte, rode:

```bash
npm run build
```

## 3. Backend

O backend oficial atual e Express:

```text
backend/api/server.js
backend/api/routes/questions.js
backend/api/routes/quizzes.js
backend/api/routes/users.js
```

Ele usa PGlite por meio de:

```text
backend/database/db.js
backend/database/schema.sql
backend/database/normalizers.js
```

O backend FastAPI em `validation/backend/` existe, mas nao e o fluxo oficial atual.

## 4. Validacao De Questoes

O painel de validacao fica em `validation/` e e publicado em `public/validation/` pelo build.

Fluxo atual:

```text
Painel
  -> GET /api/questions/pending
  -> revisor aprova/rejeita
  -> POST /api/questions/:id/validate
  -> PGlite atualiza questions
```

Campos persistidos:

- `validation_status`
- `rejection_reason`
- `validation_logs`
- `validated_by`
- `validated_at`

Regras atuais:

- status aceitos: `PENDING`, `APPROVED`, `REJECTED`;
- rejeicao exige motivo;
- logs sao guardados como JSONB em `validation_logs`.

## 5. Dados

Fonte dos simulados:

```text
data/clf-c02.json
data/clf-c02-en.json
data/saa-c03.json
data/saa-c03-en.json
data/dva-c02.json
data/dva-c02-en.json
data/aif-c01.json
data/aif-c01-en.json
```

Outros dados:

- `data/nivelamento/`: diagnosticos.
- `data/gamificacao/`: desafios.
- `data/contributions/`: novas questoes propostas.

O seed para banco:

```bash
npm run db:seed
```

## 6. Manutencao

Comandos principais:

```bash
npm install
npm run dev
npm run build
npm test -- --runInBand
npm run api:start
npm run db:seed
```

Checklist antes de apresentar:

- [ ] `npm test -- --runInBand`.
- [ ] `npm run build`.
- [ ] API respondendo em `/api/health`.
- [ ] Frontend abrindo.
- [ ] Fluxo de simulado manual.
- [ ] Fluxo de validacao manual, se for demonstrar painel.

Verificacao de 2026-06-18:

- [x] Testes: 9 suites, 77 testes.
- [x] Build: sucesso.
- [ ] Teste manual completo: pendente.
