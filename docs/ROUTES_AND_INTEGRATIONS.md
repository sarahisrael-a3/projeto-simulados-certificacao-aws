# Rotas E Integracoes

Atualizado em: 2026-06-25

Este documento descreve o estado real das rotas e integracoes locais.

## Resumo

| Item | Status | Origem |
| --- | --- | --- |
| Frontend SPA/PWA | Implementado | `public/` via `npm run dev` |
| JSON offline | Implementado | `public/data/`, copiado de `data/` |
| API Express | Implementado | `http://127.0.0.1:3001` |
| PGlite | Implementado | `DB_DATA_DIR` |
| Seed | Implementado | `npm run db:seed` |
| Painel de validacao | Integrado tecnicamente | `validation/` e `public/validation/` |
| Diagnostico personalizado | Implementado no frontend | `src/frontend/js/app.js` + `QuizEngine.loadPersonalizedQuestions()` |

## Como Rodar

Frontend:

```bash
npm run dev
```

Banco:

```bash
cp .env.example .env
npm run db:seed
```

Windows/PowerShell:

```powershell
Copy-Item .env.example .env
npm run db:seed
```

API:

```bash
npm run api:start
```

Health:

```text
GET http://127.0.0.1:3001/api/health
```

## Fluxo De Dados

```text
src/frontend + src/services + data + validation
        |
        | npm run build
        v
public/
        |
        | navegador/PWA
        v
API Express -> PGlite
        |
        | fallback quando indisponivel
        v
JSON local + localStorage
```

## Rotas Reais Da API

### Health

```text
GET /api/health
```

### Questoes

```text
GET /api/questions
GET /api/questions?certification=CLF-C02&domain=faturamento&difficulty=easy&limit=10&offset=0
GET /api/questions?search=s3&limit=20
GET /api/questions/pending
GET /api/questions/:id
POST /api/questions
PUT /api/questions/:id
DELETE /api/questions/:id
POST /api/questions/:id/validate
```

Payload minimo para criar:

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

Payload de validacao:

```json
{
  "status": "APPROVED",
  "validator_id": "reviewer-name"
}
```

Rejeicao:

```json
{
  "status": "REJECTED",
  "validator_id": "reviewer-name",
  "feedback": "Explain what must be fixed"
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

Iniciar:

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

O backend calcula `is_correct`; o cliente nao deve ser fonte de verdade para correcao.

### Usuarios

```text
POST /api/users
GET /api/users/:id/stats
GET /api/users/:id/weak-domains?threshold=70
```

Criar usuario:

```json
{
  "anonymous_name": "CloudNinja#1234"
}
```

Se `anonymous_name` nao for enviado, a API gera um nome.

### Leaderboard

```text
GET /api/leaderboard?limit=100
```

## Fetches Do Frontend

- Quiz principal: `apiService.loadQuestions()` com fallback para `data/{certId}.json`.
- Diagnostico: tentativa via API e fallback para `data/nivelamento/diagnostic-{certId}.json`.
- Simulado personalizado do diagnostico: carrega questoes da mesma certificacao, prioriza dominios fracos e completa com questoes gerais quando necessario.
- "O Que Estudar Agora": usa historico/localStorage e, quando disponivel, API para dominios fracos.
- Leaderboard: `GET /api/leaderboard` com fallback local/mock.
- Validacao: `GET /api/questions/pending` e `POST /api/questions/:id/validate`.

## Fluxo Do Diagnostico Personalizado

```text
startDiagnostic()
  -> QuizEngine.loadDiagnostic()
  -> finishQuiz()
  -> renderDiagnosticReport()
  -> identifyWeakDomains(domainScores, domains)
  -> CTA "Praticar dominios fracos"
  -> startPersonalizedDiagnosticQuiz()
  -> QuizEngine.loadPersonalizedQuestions()
  -> fluxo normal da tela de quiz em modo revisao
```

Regras atuais:

- dominio fraco: abaixo de 60% de acerto;
- se nenhum dominio estiver abaixo de 60%, usar o dominio com menor percentual como foco sugerido;
- ignorar dominios sem respostas;
- ordenar do pior para o melhor desempenho;
- priorizar questoes dos dominios fracos;
- se faltarem questoes, completar com questoes gerais da mesma certificacao;
- se nao houver nenhuma questao, mostrar mensagem amigavel e nao iniciar quiz quebrado.

Observacao: `DIAGNOSTIC_DOMAIN_ALIASES` em `src/frontend/js/app.js` mapeia IDs de diagnostico para IDs do banco principal quando eles diferem.

## Rotas Planejadas Que Ainda Nao Existem

- `GET /health`.
- `GET /api/questions/search?q=termo`.
- `POST /api/quiz/:quizId/finish`.
- `GET /api/quiz/history/:userId`.
- `GET /api/users/:id`.
- `GET /api/users/:id/gamification`.
- `PUT /api/users/:id/gamification`.
- `GET /api/validators/me/stats`.
- `GET /api/validations/:id`.

## Documentacao Da API

Veja tambem `docs/API.md` para exemplos de request/response e observacoes de contrato.

## Testes

Verificado em 2026-06-25:

```bash
npm test
npm run build
npm run lint
```

Resultado registrado: 9 suites e 82 testes passaram; build passou; lint passou com 0 erros e 77 warnings de `console`.
