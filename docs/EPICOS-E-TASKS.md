# Epicos E Tasks

Atualizado em: 2026-06-18

Este documento substitui o plano antigo como fonte de status real. Ele registra o que esta entregue, o que esta parcial e o que ainda e trabalho pendente.

## Resumo Executivo Dos Epicos

| Epico | Status | Leitura atual |
| --- | --- | --- |
| 1. Base inicial e schema | Concluido | Schema e estrutura base existem |
| 2. Camada PGlite | Concluido | `backend/database/db.js` funcional e testado |
| 3. API Express | Parcial avancado | API real existe e passa testes, mas faltam contrato unico e docs API dedicada |
| 4. Socket/start integrado | Pendente | Scripts antigos existem, mas nao sao fluxo oficial do app completo |
| 5. Validacao de questoes | Concluido tecnicamente | Express + PGlite persistem aprovacao/rejeicao |
| 6. Trilha/gamificacao | Parcial implementado | Produto ja tem trilha, sprint, badges e desafios; faltam criterios finais/e2e |
| 7. Gaps/recomendacoes | Parcial | Backend calcula dominios fracos, UI ainda nao explora plenamente |
| 8. PDF/exportacao | Parcial implementado | Relatorio PDF existe; template profissional ainda pode evoluir |
| 9. Testes com usuarios/staging | Pendente | Falta staging formal e feedback estruturado |

## Epico 1 - Base Inicial E Schema

Status: concluido.

- [x] Definir dados principais em JSON.
- [x] Criar schema PGlite/PostgreSQL.
- [x] Criar tabelas de usuarios, dominios, questoes, historico, respostas e gamificacao.
- [x] Adicionar campos de validacao em `questions`.
- [x] Manter dados JSON como fonte e fallback.

## Epico 2 - Camada PGlite

Status: concluido.

- [x] `initializeDatabase(options)`.
- [x] `closeDatabase()`.
- [x] `getDatabase()`.
- [x] `executeQuery()` e `executeSql()`.
- [x] CRUD de questoes.
- [x] Busca e filtros de questoes.
- [x] Usuarios anonimos.
- [x] Gamificacao.
- [x] Historico de quiz.
- [x] Registro de respostas.
- [x] Calculo de `is_correct` no backend.
- [x] Leaderboard.
- [x] Estatisticas de usuario.
- [x] Dominios fracos.
- [x] Testes em `backend/database/db.test.js`.

Pendencias residuais:

- [ ] Tabela normalizada de auditoria de validacao, se necessario.
- [ ] Migracoes versionadas formais para evolucao de schema.

## Epico 3 - API Express

Status: parcial avancado e utilizavel.

### Task 3.1 - Servidor e Middlewares

- [x] Express instalado.
- [x] `backend/api/server.js`.
- [x] Porta configuravel por `PORT`, default 3001.
- [x] CORS.
- [x] JSON parser.
- [x] Logger simples.
- [x] Helmet.
- [x] Rate limit em `/api`.
- [x] Error handler global.
- [x] Health check em `GET /api/health`.
- [ ] Request ID.
- [ ] Health alternativo em `GET /health`, se virar requisito.
- [ ] Resposta unica em todas as rotas no formato `{ success, data, error }`.

### Task 3.2 - Questoes

- [x] `GET /api/questions`.
- [x] Filtros por `certification`, `domain`, `difficulty`, `limit`, `offset` e `search`.
- [x] `GET /api/questions/:id`.
- [x] `POST /api/questions`.
- [x] `PUT /api/questions/:id`.
- [x] `DELETE /api/questions/:id` com soft delete.
- [x] Busca via `GET /api/questions?search=termo`.
- [ ] Rota separada `GET /api/questions/search?q=termo`, se o contrato antigo for mantido.

### Task 3.3 - Quiz E Historico

- [x] `POST /api/quiz/start`.
- [x] Alias `POST /api/quizzes/start`.
- [x] `POST /api/quiz/:id/answer`.
- [x] Alias `POST /api/quizzes/:id/answer`.
- [x] `GET /api/quiz/:id/results`.
- [x] Alias `GET /api/quizzes/:id/results`.
- [x] `GET /api/quiz/:id`.
- [x] Alias `GET /api/quizzes/:id`.
- [ ] `POST /api/quiz/:quizId/finish`.
- [ ] `GET /api/quiz/history/:userId`.
- [ ] Selecionar/embaralhar questoes com paridade total ao frontend.

### Task 3.4 - Usuarios E Gamificacao

- [x] `POST /api/users`.
- [x] Geracao de nome anonimo quando ausente.
- [x] `GET /api/users/:id/stats`.
- [x] `GET /api/users/:id/weak-domains`.
- [x] `GET /api/leaderboard`.
- [ ] `GET /api/users/:id`.
- [ ] `GET /api/users/:id/gamification`.
- [ ] `PUT /api/users/:id/gamification`.

### Task 3.5 - Seguranca E Validacao

- [x] Validacoes na camada de banco.
- [x] Rate limit.
- [x] Helmet.
- [x] Error handler global.
- [ ] Middleware dedicado de sanitizacao/validacao.
- [ ] Testes especificos de seguranca.

### Task 3.6 - Testes

- [x] Testes de integracao em `__tests__/api.integration.test.js`.
- [x] Testes de validacao em `__tests__/api.validation.test.js`.
- [x] Suite completa passou em 2026-06-18: 9 suites, 77 testes.
- [ ] Coverage formal definido e publicado.
- [ ] E2E de navegador.

### Task 3.7 - Documentacao Da API

- [x] Rotas reais documentadas em `docs/ROUTES_AND_INTEGRATIONS.md`.
- [ ] Criar `docs/API.md` ou OpenAPI.
- [ ] Exemplos completos de erro e sucesso por endpoint.

## Epico 4 - Socket Server E Start Integrado

Status: pendente.

- [ ] Revisar `scripts/pglite.js`.
- [ ] Revisar `backend/database/socketServer.js`.
- [ ] Decidir se socket server continua no produto.
- [ ] Criar comando unico para app completo, se fizer sentido.
- [ ] Graceful shutdown integrado.

## Epico 5 - Validacao De Questoes

Status: concluido tecnicamente; validacao manual pendente.

- [x] Campo `validation_status`.
- [x] Campo `rejection_reason`.
- [x] Campo `validation_logs`.
- [x] Campos `validated_by` e `validated_at`.
- [x] Constraint para `PENDING`, `APPROVED` e `REJECTED`.
- [x] Indice `idx_questions_validation_status`.
- [x] `getPendingQuestions()`.
- [x] `validateQuestion()`.
- [x] `GET /api/questions/pending`.
- [x] `POST /api/questions/:id/validate`.
- [x] Rejeicao com motivo obrigatorio.
- [x] Painel usa API real por padrao.
- [x] Testes de listar, aprovar, rejeitar e payload invalido.
- [ ] Teste manual completo do painel.
- [ ] Decidir destino do FastAPI em `validation/backend/`.

## Epico 6 - Trilha Visual E Gamificacao

Status: parcial implementado.

- [x] `trailManager.js`.
- [x] `sprintManager.js`.
- [x] `badges.js`.
- [x] `leaderboard.js`.
- [x] `interactiveEngine.js`.
- [x] Dados de desafios interativos.
- [x] Testes de sprint.
- [ ] Especificacao visual final da trilha.
- [ ] Animacoes e estados revisados por UX/acessibilidade.
- [ ] E2E de gamificacao.

## Epico 7 - Gaps E Recomendacoes

Status: parcial.

- [x] `getWeakDomains(userId, threshold)` no banco.
- [x] Endpoint `GET /api/users/:id/weak-domains`.
- [x] Insights locais no frontend.
- [ ] Conectar recomendacoes principais aos dominios fracos da API.
- [ ] Card "o que estudar agora" baseado em backend.
- [ ] Links oficiais AWS por dominio.

## Epico 8 - PDF E Relatorios

Status: parcial implementado.

- [x] `pdfReport.js`.
- [x] Exportacao de relatorio de desempenho.
- [x] Dependencias `jspdf` e `html2canvas`.
- [ ] Template profissional final.
- [ ] Filtro "apenas erros".
- [ ] Validacao visual do PDF em navegadores reais.

## Epico 9 - Testes Com Usuarios E Staging

Status: pendente.

- [ ] Ambiente de staging.
- [ ] Plano de teste com usuarios.
- [ ] Formulario de feedback.
- [ ] Analise dos feedbacks.
- [ ] Priorizacao de bugs criticos.
- [ ] Preparacao de demo/apresentacao.

## Proxima Sprint Recomendada

1. Rodar app completo com API + PGlite seedado.
2. Testar manualmente simulados, validacao, leaderboard e PDF.
3. Reduzir ou justificar warnings de `console` reportados pelo lint.
4. Criar `docs/API.md` ou OpenAPI.
5. Criar e2e minimo de navegador.
6. Auditar qualidade PT/EN.
