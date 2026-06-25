# Changelog

Todas as mudancas notaveis sao registradas aqui. Este arquivo foi normalizado em 2026-06-18 para refletir a evolucao real do repositorio.

## [Atual] - 2026-06-25

### Adicionado

- `docs/API.md` com contrato principal da API Express.
- Documentacao do fluxo diagnostico -> dominios fracos -> simulado personalizado.
- Documentacao dos aliases de dominio usados para alinhar IDs do diagnostico aos IDs do banco principal.

### Confirmado

- Diagnostico lista dominios fracos e oferece CTA "Praticar dominios fracos".
- Simulado personalizado prioriza dominios fracos, completa com questoes gerais e roda em modo revisao.
- Quiz normal continua usando `startQuiz()` e `QuizEngine.loadQuestions()`.
- `npm test` passou com 9 suites e 82 testes.
- `npm run build` passou.
- `npm run lint` passou com 0 erros e 77 warnings de `console`.

### Pendencias Registradas

- Persistir historico do diagnostico, se entrar no escopo futuro.
- Evoluir simulado focado para plano de estudo completo.
- Criar OpenAPI caso o contrato da API estabilize.

## [2.5.0] - 2026-06-18

### Adicionado

- Documentacao atualizada para refletir API Express, PGlite, validacao colaborativa e estado real dos epicos.
- Checklist executivo com verificacoes atuais.
- Roadmap reorganizado por fases reais.
- Rotas de validacao documentadas: `GET /api/questions/pending` e `POST /api/questions/:id/validate`.

### Confirmado

- `npm test -- --runInBand` passou com 9 suites e 77 testes.
- `npm run build` passou.
- `npm run lint` passou com 0 erros e 72 warnings de `console`.
- `npm run format:check` passou.
- Base principal em `data/` contem 2.545 registros PT/EN.
- API Express atual usa Helmet, CORS, rate limit e error handler.
- PGlite possui campos de validacao em `questions`.

### Pendencias Registradas

- Teste manual completo do app com API + PGlite seedado.
- Reducao ou justificativa dos 77 warnings de `console` reportados pelo lint.
- OpenAPI ou documentacao de API mais completa.
- E2E de navegador.
- Auditoria PT/EN e duplicidades.

## [2.4.0] - 2026-06-18

### Adicionado

- Fluxo tecnico de validacao colaborativa via Express + PGlite.
- Campos `validation_status`, `rejection_reason` e `validation_logs`.
- Funcoes `getPendingQuestions()` e `validateQuestion()`.
- Testes de integracao para listar pendentes, aprovar, rejeitar e payload invalido.

### Modificado

- Painel `validation/` passa a usar API real por padrao.
- Documentacao passa a tratar Express + PGlite como fluxo oficial de validacao.

## [2.3.0] - 2026-06-16

### Adicionado

- API Express local com rotas de questoes, quiz, usuarios e leaderboard.
- Seed dos JSONs principais para PGlite.
- Documentacao de rotas e setup PGlite.

### Modificado

- Frontend passa a tentar API e preservar fallback offline.
- Build copia services, dados e painel de validacao para `public/`.

## [2.2.0] - 2026-06-07

### Adicionado

- Camada PGlite consolidada em `backend/database/db.js`.
- CRUD de questoes.
- Historico de quiz e respostas.
- Usuarios, gamificacao, leaderboard e estatisticas.
- Testes da camada de banco.

## [2.0.0] - 2026-03-22

### Adicionado

- Suporte a questoes de multipla resposta.
- Modo flashcards.
- Escala de pontuacao AWS 100-1000.
- Relatorios e melhorias de feedback visual.
- Scripts Python para geracao, validacao, traducao e duplicidade.

## [1.x] - Marco Historico

### Adicionado

- Simulador inicial de certificacoes AWS.
- PWA/offline.
- Dark mode.
- Internacionalizacao PT/EN.
- Motor de quiz.
- Storage local.
- Primeira gamificacao.

## Proximas Mudancas Esperadas

- `docs/API.md` ou OpenAPI.
- E2E de navegador.
- Auditoria de conteudo PT/EN.
- Ambiente de staging.
- Decisao sobre `validation/backend/`.
