# Epicos e Tasks

Atualizado em: 2026-06-18

Este documento substitui o plano antigo como fonte de status real do projeto.
Ele registra o que esta entregue, o que esta funcional no MVP, o que ainda esta parcial e o que permanece como decisao ou backlog tecnico.

---

## Legenda de Status

| Status | Significado |
| --- | --- |
| Concluido | Entregue no escopo atual e validado tecnicamente |
| MVP funcional | Ja funciona no fluxo principal, mas ainda precisa de padronizacao, documentacao ou acabamento |
| MVP tecnico concluido | Implementacao tecnica entregue, com pendencias operacionais ou validacao manual |
| MVP implementado | Funcionalidade existe e e utilizavel, mas ainda precisa de UX, E2E ou refinamento |
| Parcial | Parte da funcionalidade existe, mas o fluxo ainda nao esta completo |
| Decisao pendente | Existe codigo ou proposta antiga, mas falta decidir se continua no produto |
| Pendente | Ainda nao implementado no escopo atual |
| Backlog | Melhoria futura, nao bloqueia o MVP |

---

## Resumo Executivo dos Epicos

| Epico | Status | Leitura atual |
| --- | --- | --- |
| 1. Base inicial e schema | Concluido | Schema e estrutura base existem |
| 2. Camada PGlite | Concluido | Banco local funcional, testado, seedado e integrado |
| 3. API Express | MVP funcional | API real existe, passa testes e respondeu com PGlite seedado; faltam contrato final e documentacao dedicada |
| 4. Socket/start integrado | Decisao pendente | Scripts antigos existem, mas nao sao fluxo oficial do app completo |
| 5. Validacao de questoes | MVP tecnico concluido | Express + PGlite persistem aprovacao/rejeicao; endpoint foi verificado, falta teste manual no navegador |
| 6. Trilha/gamificacao | MVP implementado | Trilha, sprint, badges e desafios existem; falta validacao UX/E2E |
| 7. Gaps/recomendacoes | Parcial | Backend calcula dominios fracos; UI ainda precisa explorar melhor |
| 8. PDF/exportacao | MVP implementado | Relatorio PDF existe; template final pode evoluir |
| 9. Testes com usuarios/staging | Pendente | Falta staging formal e feedback estruturado |

---

## Estado Atual de Qualidade

Ultima verificacao registrada em 2026-06-18:

* `npm run format:check`: passou.
* `npm run lint`: 0 erros e 72 warnings de `console`.
* `npm test -- --runInBand`: 9 suites e 77 testes passando.
* `npm run build`: concluido com sucesso.
* `npm run db:seed`: 2.545 registros lidos e ja presentes no PGlite persistente.
* API local com PGlite seedado: `GET /api/health` e `GET /api/questions/pending?limit=2` retornaram HTTP 200.
* `npm audit --omit=dev`: 0 vulnerabilidades em dependencias de producao.

Observacao: o teste manual completo em navegador ainda nao foi executado nesta revisao.

---

# Epico 1 - Base Inicial e Schema

Status: concluido.

## Entregue

* [x] Definir dados principais em JSON.
* [x] Criar schema PGlite/PostgreSQL.
* [x] Criar tabelas de usuarios, dominios, questoes, historico, respostas e gamificacao.
* [x] Adicionar campos de validacao em `questions`.
* [x] Manter dados JSON como fonte e fallback.

## Observacao

O JSON permanece como fonte versionada e tambem como fallback offline para o frontend.

---

# Epico 2 - Camada PGlite

Status: concluido.

## Entregue

* [x] `initializeDatabase(options)`.
* [x] `closeDatabase()`.
* [x] `getDatabase()`.
* [x] `executeQuery()`.
* [x] `executeSql()`.
* [x] CRUD de questoes.
* [x] Busca e filtros de questoes.
* [x] Usuarios anonimos.
* [x] Gamificacao.
* [x] Historico de quiz.
* [x] Registro de respostas.
* [x] Calculo de `is_correct` no backend.
* [x] Leaderboard.
* [x] Estatisticas de usuario.
* [x] Dominios fracos.
* [x] Seed reprodutivel a partir dos JSONs.
* [x] Testes em `backend/database/db.test.js`.

## Backlog tecnico

Estas melhorias nao bloqueiam o MVP atual:

* [ ] Avaliar necessidade de tabela normalizada de auditoria de validacao.
* [ ] Criar migracoes versionadas formais para evolucao de schema.

---

# Epico 3 - API Express

Status: MVP funcional.

A API Express ja existe, passa testes, atende o fluxo principal do app e foi verificada com PGlite persistente seedado.
O que falta e padronizacao final de contrato, documentacao dedicada e alguns endpoints complementares.

---

## Task 3.1 - Servidor e Middlewares

Status: MVP funcional.

### Entregue

* [x] Express instalado.
* [x] `backend/api/server.js`.
* [x] Porta configuravel por `PORT`, default `3001`.
* [x] CORS.
* [x] JSON parser.
* [x] Logger simples.
* [x] Helmet.
* [x] Rate limit em `/api`.
* [x] Error handler global.
* [x] Health check em `GET /api/health`.
* [x] Health check verificado por HTTP 200 em 2026-06-18.

### Pendencias do MVP API

* [ ] Definir resposta unica em todas as rotas no formato `{ success, data, error }`.
* [ ] Adicionar Request ID.

### Backlog / decisao futura

* [ ] Avaliar necessidade de health alternativo em `GET /health`.

---

## Task 3.2 - Questoes

Status: MVP funcional.

### Entregue

* [x] `GET /api/questions`.
* [x] Filtros por `certification`, `domain`, `difficulty`, `limit`, `offset` e `search`.
* [x] `GET /api/questions/:id`.
* [x] `POST /api/questions`.
* [x] `PUT /api/questions/:id`.
* [x] `DELETE /api/questions/:id` com soft delete.
* [x] Busca via `GET /api/questions?search=termo`.
* [x] `GET /api/questions/pending?limit=2` verificado por HTTP 200 em 2026-06-18.

### Backlog / decisao futura

* [ ] Avaliar necessidade de rota separada `GET /api/questions/search?q=termo`.

---

## Task 3.3 - Quiz e Historico

Status: MVP funcional com pendencias.

### Entregue

* [x] `POST /api/quiz/start`.
* [x] Alias `POST /api/quizzes/start`.
* [x] `POST /api/quiz/:id/answer`.
* [x] Alias `POST /api/quizzes/:id/answer`.
* [x] `GET /api/quiz/:id/results`.
* [x] Alias `GET /api/quizzes/:id/results`.
* [x] `GET /api/quiz/:id`.
* [x] Alias `GET /api/quizzes/:id`.

### Pendencias

* [ ] `POST /api/quiz/:quizId/finish`.
* [ ] `GET /api/quiz/history/:userId`.
* [ ] Selecionar e embaralhar questoes com paridade total ao frontend.

---

## Task 3.4 - Usuarios e Gamificacao

Status: MVP funcional com pendencias.

### Entregue

* [x] `POST /api/users`.
* [x] Geracao de nome anonimo quando ausente.
* [x] `GET /api/users/:id/stats`.
* [x] `GET /api/users/:id/weak-domains`.
* [x] `GET /api/leaderboard`.

### Pendencias

* [ ] `GET /api/users/:id`.
* [ ] `GET /api/users/:id/gamification`.
* [ ] `PUT /api/users/:id/gamification`.

---

## Task 3.5 - Seguranca e Validacao

Status: MVP funcional.

### Entregue

* [x] Validacoes na camada de banco.
* [x] Rate limit.
* [x] Helmet.
* [x] Error handler global.
* [x] Auditoria de dependencias de producao com `npm audit --omit=dev`.

### Pendencias

* [ ] Middleware dedicado de sanitizacao/validacao.
* [ ] Testes especificos de seguranca.

---

## Task 3.6 - Testes

Status: funcional.

### Entregue

* [x] Testes de integracao em `__tests__/api.integration.test.js`.
* [x] Testes de validacao em `__tests__/api.validation.test.js`.
* [x] Suite completa passou em 2026-06-18: 9 suites, 77 testes.

### Pendencias

* [ ] Coverage formal definido e publicado.
* [ ] E2E minimo de navegador.

---

## Task 3.7 - Documentacao da API

Status: parcial.

### Entregue

* [x] Rotas reais documentadas em `docs/ROUTES_AND_INTEGRATIONS.md`.

### Pendencias

* [ ] Criar `docs/API.md` ou OpenAPI.
* [ ] Adicionar exemplos completos de erro e sucesso por endpoint.

---

# Epico 4 - Socket Server e Start Integrado

Status: decisao pendente.

Existem scripts antigos relacionados a socket/start integrado, mas eles nao sao o fluxo oficial atual do app completo.

## Decisoes pendentes

* [ ] Revisar `scripts/pglite.js`.
* [ ] Revisar `backend/database/socketServer.js`.
* [ ] Decidir se socket server continua no produto.
* [ ] Criar comando unico para app completo, se fizer sentido.
* [ ] Avaliar graceful shutdown integrado.

## Leitura atual

O fluxo oficial recomendado continua sendo:

1. `npm run db:seed`
2. `npm run api:start`
3. `npm run dev`

---

# Epico 5 - Validacao de Questoes

Status: MVP tecnico concluido; validacao manual em navegador pendente.

A validacao de questoes esta implementada tecnicamente com persistencia em PGlite, endpoints Express e testes automatizados.

## Banco de Dados

* [x] Campo `validation_status`.
* [x] Campo `rejection_reason`.
* [x] Campo `validation_logs`.
* [x] Campos `validated_by` e `validated_at`.
* [x] Constraint para `PENDING`, `APPROVED` e `REJECTED`.
* [x] Indice `idx_questions_validation_status`.

## Camada de Dados

* [x] `getPendingQuestions()`.
* [x] `validateQuestion()`.

## API Express

* [x] `GET /api/questions/pending`.
* [x] `POST /api/questions/:id/validate`.
* [x] Rejeicao com motivo obrigatorio.
* [x] Validacao de payload invalido.
* [x] Endpoint de pendencias verificado com PGlite seedado em 2026-06-18.

## Painel de Validacao

* [x] Painel usa API real por padrao.
* [x] `validation/js/validationAPI.js` normaliza opcoes e respostas para o formato esperado pela UI.
* [x] Build sincroniza painel em `public/validation/`.

## Testes Automatizados

* [x] Teste de listar questoes pendentes.
* [x] Teste de aprovar questao.
* [x] Teste de rejeitar questao.
* [x] Teste de payload invalido.

## Pendencias operacionais

* [ ] Teste manual completo do painel no navegador.
* [ ] Decidir destino do FastAPI em `validation/backend/`.

## Roteiro de teste manual do painel

* [ ] Iniciar API com `npm run api:start`.
* [ ] Iniciar frontend com `npm run dev`.
* [ ] Abrir painel de validacao.
* [ ] Confirmar carregamento de questoes pendentes.
* [ ] Aprovar uma questao.
* [ ] Rejeitar uma questao com motivo.
* [ ] Tentar rejeitar sem motivo e validar bloqueio.
* [ ] Atualizar a lista apos aprovacao/rejeicao.
* [ ] Confirmar que a API retorna o status atualizado.

---

# Epico 6 - Trilha Visual e Gamificacao

Status: MVP implementado.

O produto ja possui estrutura de trilha, sprint, badges, leaderboard e desafios.
Ainda falta validar experiencia final, acessibilidade e fluxo completo em navegador.

## Entregue

* [x] `trailManager.js`.
* [x] `sprintManager.js`.
* [x] `badges.js`.
* [x] `leaderboard.js`.
* [x] `interactiveEngine.js`.
* [x] Dados de desafios interativos.
* [x] Testes de sprint.

## Pendencias

* [ ] Especificacao visual final da trilha.
* [ ] Revisao de animacoes e estados por UX/acessibilidade.
* [ ] E2E de gamificacao.

---

# Epico 7 - Gaps e Recomendacoes

Status: parcial.

O backend ja calcula dominios fracos, mas a interface ainda precisa transformar esse dado em recomendacoes claras de estudo.

## Entregue

* [x] `getWeakDomains(userId, threshold)` no banco.
* [x] Endpoint `GET /api/users/:id/weak-domains`.
* [x] Insights locais no frontend.

## Pendencias

* [ ] Conectar recomendacoes principais aos dominios fracos da API.
* [ ] Criar card "o que estudar agora" baseado em backend.
* [ ] Adicionar links oficiais AWS por dominio.

---

# Epico 8 - PDF e Relatorios

Status: MVP implementado.

O relatorio PDF ja existe e pode ser exportado.
O foco agora e melhorar acabamento visual, filtros e validacao real em navegadores.

## Entregue

* [x] `pdfReport.js`.
* [x] Exportacao de relatorio de desempenho.
* [x] Dependencias `jspdf` e `html2canvas`.

## Pendencias

* [ ] Criar template profissional final.
* [ ] Adicionar filtro "apenas erros".
* [ ] Validar visualmente o PDF em navegadores reais.

---

# Epico 9 - Testes com Usuarios e Staging

Status: pendente.

Este epico deve entrar depois da estabilizacao do app completo, documentacao da API e validacao manual dos fluxos principais.

## Pendencias

* [ ] Ambiente de staging.
* [ ] Plano de teste com usuarios.
* [ ] Formulario de feedback.
* [ ] Analise dos feedbacks.
* [ ] Priorizacao de bugs criticos.
* [ ] Preparacao de demo/apresentacao.

---

# Backlog Tecnico Geral

Itens abaixo sao importantes, mas nao bloqueiam o MVP atual.

## Governanca e CI/CD

* [ ] Adicionar workflow `ci.yml` com `format:check`, `lint`, `test`, `build` e `npm audit --omit=dev`.
* [ ] Adicionar badge do CI no README.
* [ ] Criar template de Pull Request.
* [ ] Criar `SECURITY.md`.
* [ ] Criar `.nvmrc`.
* [ ] Criar `.editorconfig`.
* [ ] Avaliar Dependabot.

## Qualidade de Codigo

* [ ] Reduzir ou justificar warnings de `console` reportados pelo lint.
* [ ] Definir politica para logs de desenvolvimento.
* [ ] Avaliar coverage minimo.
* [ ] Separar warnings aceitaveis de problemas reais.

## Documentacao

* [ ] Criar `docs/API.md`.
* [ ] Adicionar exemplos de request/response por endpoint.
* [ ] Atualizar README com status real, badges e instrucoes completas.
* [ ] Documentar estrategia de fallback offline.
* [ ] Documentar fluxo de validacao de questoes.

## Produto e UX

* [ ] Testar responsividade mobile.
* [ ] Revisar acessibilidade basica.
* [ ] Adicionar prints ou GIFs ao README.
* [ ] Validar fluxo completo de estudo com usuario real.

## Dados e Conteudo

* [ ] Auditar qualidade PT/EN.
* [ ] Revisar consistencia das questoes por certificacao.
* [ ] Avaliar duplicidade de questoes.
* [ ] Definir criterios de aprovacao de conteudo.

---

# Proxima Sprint Recomendada

## Objetivo

Validar o app completo em ambiente local, fechar pendencias operacionais do Epico 5 e preparar o repositorio para demonstracao publica.

## Tarefas recomendadas

1. Rodar app completo com API + PGlite seedado.
2. Fazer teste manual completo do painel de validacao no navegador.
3. Testar manualmente simulados, leaderboard, gamificacao e PDF.
4. Decidir destino do FastAPI em `validation/backend/`.
5. Criar workflow de CI com:

   * `npm run format:check`
   * `npm run lint`
   * `npm test -- --runInBand`
   * `npm run build`
   * `npm audit --omit=dev`
6. Criar `docs/API.md` com exemplos reais de sucesso e erro.
7. Criar E2E minimo de navegador para fluxo principal.
8. Reduzir ou justificar warnings de `console`.
9. Auditar qualidade PT/EN.

## Criterio de encerramento da sprint

* App completo rodando localmente.
* Painel de validacao testado manualmente no navegador.
* CI rodando verde no GitHub Actions.
* Documentacao da API criada ou iniciada.
* Pendencias criticas separadas de backlog futuro.
