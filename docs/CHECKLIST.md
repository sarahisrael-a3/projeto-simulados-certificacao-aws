# Checklist Do Projeto

Atualizado em: 2026-06-18

Este checklist reflete a leitura real do repositorio em 2026-06-18. Evidencias usadas: `package.json`, `src/frontend/`, `src/services/api.js`, `backend/api/`, `backend/database/`, `scripts/`, `validation/`, `data/`, `__tests__/` e execucao de testes/build.

## Status Executivo

- [x] Frontend SPA/PWA funcional.
- [x] Build sincroniza `src/frontend/`, `src/services/`, `data/` e `validation/` para `public/`.
- [x] Base JSON principal com 2.545 registros PT/EN.
- [x] API Express local implementada.
- [x] PGlite integrado com schema, seed, queries e testes.
- [x] Frontend usa API quando disponivel e mantem fallback offline.
- [x] Painel de validacao conectado a endpoints Express reais.
- [x] Validacao persiste status, validador, data, motivo de rejeicao e logs JSONB.
- [x] Seguranca basica aplicada na API: Helmet, CORS, rate limit e error handler.
- [x] `npm test -- --runInBand` passou em 2026-06-18: 9 suites, 77 testes.
- [x] `npm run build` passou em 2026-06-18.
- [x] `npm run db:seed` passou em 2026-06-18: 2.545 registros lidos e ja presentes no PGlite.
- [x] API local com PGlite seedado respondeu `GET /api/health` e `GET /api/questions/pending?limit=2` com HTTP 200.
- [ ] Validacao manual completa em navegador com API + PGlite seedado.
- [x] `npm run lint` passou em 2026-06-18 com 0 erros e 72 warnings antigos de `console`.
- [x] `npm run format:check` passou em 2026-06-18.
- [x] `npm audit --omit=dev` passou em 2026-06-18 com 0 vulnerabilidades de producao.

## Frontend E Produto

- [x] SPA em HTML, CSS e JavaScript vanilla.
- [x] PWA com manifest e service worker.
- [x] Simulados por certificacao.
- [x] Testes diagnosticos por certificacao.
- [x] Flashcards.
- [x] Pomodoro.
- [x] Relatorio PDF.
- [x] Dashboard, graficos e insights.
- [x] Tema claro/escuro.
- [x] Internacionalizacao PT/EN.
- [x] Historico, progresso e erros via `localStorage`.
- [x] Gamificacao local: badges, streak, leaderboard e trilha.
- [x] Sprint de estudo de 14 dias.
- [x] Desafios interativos em `data/gamificacao/interactive-challenges.json`.
- [ ] Testes e2e dos fluxos principais no navegador.
- [ ] Auditoria completa de acessibilidade.
- [ ] Revisao mobile em dispositivos reais.

## Dados E Conteudo

- [x] CLF-C02 PT/EN: 402 + 402 registros.
- [x] SAA-C03 PT/EN: 295 + 293 registros.
- [x] DVA-C02 PT/EN: 287 + 287 registros.
- [x] AIF-C01 PT/EN: 290 + 289 registros.
- [x] Diagnosticos PT/EN para as quatro certificacoes.
- [x] Templates de contribuicao em `data/contributions/`.
- [x] Scripts Python para geracao, traducao, validacao, merge e duplicidade.
- [x] Seed reprodutivel dos JSONs principais para PGlite.
- [ ] Auditoria pedagogica completa das questoes.
- [ ] Auditoria dos arquivos `*-en.json` para trechos em portugues.
- [ ] Normalizacao das pequenas diferencas de contagem PT/EN em SAA-C03 e AIF-C01.
- [ ] Relatorio de duplicidade/semelhanca por certificacao.

## Backend, API E Banco

- [x] API Express em `backend/api/server.js`.
- [x] Rotas de questoes em `backend/api/routes/questions.js`.
- [x] Rotas de quiz em `backend/api/routes/quizzes.js`.
- [x] Rotas de usuarios em `backend/api/routes/users.js`.
- [x] Leaderboard em `GET /api/leaderboard`.
- [x] Health check em `GET /api/health`.
- [x] PGlite inicializado por `backend/database/db.js`.
- [x] Schema com users, domains, questions, quiz_history, answers, gamification e focus_sessions.
- [x] Views `leaderboard` e `user_stats`.
- [x] CRUD de questoes.
- [x] Usuarios anonimos.
- [x] Historico de quiz e respostas.
- [x] `recordAnswer()` calcula `is_correct` no backend.
- [x] Estatisticas e dominios fracos no backend.
- [x] Validacao de questoes: `GET /api/questions/pending`.
- [x] Validacao de questoes: `POST /api/questions/:id/validate`.
- [ ] Request ID para rastreamento.
- [ ] Contrato unico de resposta `{ success, data, error }` em todas as rotas.
- [ ] OpenAPI/Swagger ou `docs/API.md` dedicado.
- [ ] Tabela normalizada de auditoria de validacao, caso `validation_logs` JSONB deixe de ser suficiente.

## Integracao Frontend + API

- [x] `apiService` centralizado com timeout, normalizacao e fallback.
- [x] Quiz tenta API e usa JSON local como fallback.
- [x] Usuario, quiz e leaderboard usam API quando disponivel.
- [x] Modo offline preservado.
- [x] Painel de validacao usa API real por padrao.
- [ ] Fluxos principais ainda precisam de validacao manual integrada.
- [ ] Algumas telas seguem dependentes de JSON/localStorage por desenho local-first.
- [ ] Recomendacoes de estudo ainda nao consomem plenamente dominios fracos da API.

## Epicos E Roadmap

- [x] Epico 1 - Schema/base inicial: concluido.
- [x] Epico 2 - Camada PGlite: concluido.
- [x] Epico 3 - API Express: funcional e testada, com pendencias de contrato e completude.
- [ ] Epico 4 - Socket server/start integrado: pendente.
- [x] Epico 5 - Validacao colaborativa: concluido tecnicamente via Express + PGlite.
- [x] Epico 6 - Trilha visual/gamificacao: implementado parcialmente no produto atual.
- [x] Epico 8 - Exportacao PDF: implementado como relatorio atual.
- [ ] Epico 7 - Recomendacoes/gaps via backend: parcial.
- [ ] Epico 9 - Testes com usuarios/staging: pendente.

## Verificacoes Desta Revisao

- [x] Leitura dos documentos `.md`.
- [x] Inspecao de `backend/api/server.js`.
- [x] Inspecao de `backend/database/schema.sql` e `db.js`.
- [x] Inspecao dos arquivos de validacao.
- [x] Contagem dos JSONs principais em `data/`.
- [x] `npm test -- --runInBand`: passou, 9 suites, 77 testes.
- [x] `npm run build`: passou.
- [x] `npm run lint`: passou com 0 erros e 72 warnings de `console`.
- [x] `npm run format:check`: passou.
- [x] `npm run db:seed`: passou, 2.545 registros lidos e ja presentes no PGlite.
- [x] `npm audit --omit=dev`: passou, 0 vulnerabilidades de producao.
- [x] API local com PGlite persistente seedado: `GET /api/health` e `GET /api/questions/pending?limit=2` retornaram HTTP 200.
- [ ] Teste manual do navegador: pendente.
- [ ] Teste manual completo do painel de validacao no navegador: pendente.

## Proximos Passos Praticos

- [ ] Rodar validacao manual completa com API + PGlite + frontend.
- [ ] Reduzir ou justificar os 72 warnings de `console` reportados pelo lint.
- [ ] Documentar exemplos de request/response da API em arquivo dedicado.
- [ ] Criar suite e2e para fluxos: iniciar simulado, responder, finalizar, validar questao.
- [ ] Auditar conteudo PT/EN e divergencias de contagem.
- [ ] Decidir se o backend FastAPI em `validation/backend/` sera removido, arquivado ou reintegrado.
