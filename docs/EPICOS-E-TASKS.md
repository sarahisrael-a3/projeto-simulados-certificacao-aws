# Épicos e Tasks

Atualizado em: 2026-06-18

Este documento substitui o plano antigo como fonte de status real do projeto.
Ele registra o que está entregue, o que está funcional no MVP, o que ainda está parcial e o que permanece como decisão ou backlog técnico.

---

## Legenda de Status

| Status                | Significado                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------- |
| Concluído             | Entregue no escopo atual e validado tecnicamente                                              |
| MVP funcional         | Já funciona no fluxo principal, mas ainda precisa de padronização, documentação ou acabamento |
| MVP técnico concluído | Implementação técnica entregue, com pendências operacionais ou validação manual               |
| MVP implementado      | Funcionalidade existe e é utilizável, mas ainda precisa de UX, E2E ou refinamento             |
| Parcial               | Parte da funcionalidade existe, mas o fluxo ainda não está completo                           |
| Decisão pendente      | Existe código ou proposta antiga, mas falta decidir se continua no produto                    |
| Pendente              | Ainda não implementado no escopo atual                                                        |
| Backlog               | Melhoria futura, não bloqueia o MVP                                                           |

---

## Resumo Executivo dos Épicos

| Épico                          | Status                | Leitura atual                                                                 |
| ------------------------------ | --------------------- | ----------------------------------------------------------------------------- |
| 1. Base inicial e schema       | Concluído             | Schema e estrutura base existem                                               |
| 2. Camada PGlite               | Concluído             | Banco local funcional, testado e integrado                                    |
| 3. API Express                 | MVP funcional         | API real existe e passa testes; faltam contrato final e documentação dedicada |
| 4. Socket/start integrado      | Decisão pendente      | Scripts antigos existem, mas não são fluxo oficial do app completo            |
| 5. Validação de questões       | MVP técnico concluído | Express + PGlite persistem aprovação/rejeição; falta validação manual         |
| 6. Trilha/gamificação          | MVP implementado      | Trilha, sprint, badges e desafios existem; falta validação UX/E2E             |
| 7. Gaps/recomendações          | Parcial               | Backend calcula domínios fracos; UI ainda precisa explorar melhor             |
| 8. PDF/exportação              | MVP implementado      | Relatório PDF existe; template final pode evoluir                             |
| 9. Testes com usuários/staging | Pendente              | Falta staging formal e feedback estruturado                                   |

---

## Estado Atual de Qualidade

Última verificação registrada em 2026-06-18:

* `npm run format:check --if-present`: passou.
* `npm run lint --if-present`: 0 erros e 72 warnings de `console`.
* `npm test -- --runInBand`: 9 suites e 77 testes passando.
* `npm run build`: concluído com sucesso.
* `npm audit --omit=dev`: 0 vulnerabilidades em dependências de produção.

Observação: ainda existem vulnerabilidades moderadas em dependências de desenvolvimento, concentradas em ferramentas como Jest/Babel/Webpack. Elas não bloqueiam o runtime atual, mas devem permanecer monitoradas.

---

# Épico 1 - Base Inicial e Schema

Status: concluído.

## Entregue

* [x] Definir dados principais em JSON.
* [x] Criar schema PGlite/PostgreSQL.
* [x] Criar tabelas de usuários, domínios, questões, histórico, respostas e gamificação.
* [x] Adicionar campos de validação em `questions`.
* [x] Manter dados JSON como fonte e fallback.

## Observação

O JSON permanece como fonte versionada e também como fallback offline para o frontend.

---

# Épico 2 - Camada PGlite

Status: concluído.

## Entregue

* [x] `initializeDatabase(options)`.
* [x] `closeDatabase()`.
* [x] `getDatabase()`.
* [x] `executeQuery()`.
* [x] `executeSql()`.
* [x] CRUD de questões.
* [x] Busca e filtros de questões.
* [x] Usuários anônimos.
* [x] Gamificação.
* [x] Histórico de quiz.
* [x] Registro de respostas.
* [x] Cálculo de `is_correct` no backend.
* [x] Leaderboard.
* [x] Estatísticas de usuário.
* [x] Domínios fracos.
* [x] Testes em `backend/database/db.test.js`.

## Backlog técnico

Estas melhorias não bloqueiam o MVP atual:

* [ ] Avaliar necessidade de tabela normalizada de auditoria de validação.
* [ ] Criar migrações versionadas formais para evolução de schema.

---

# Épico 3 - API Express

Status: MVP funcional.

A API Express já existe, passa testes e atende o fluxo principal do app.
O que falta é padronização final de contrato, documentação dedicada e alguns endpoints complementares.

---

## Task 3.1 - Servidor e Middlewares

Status: MVP funcional.

### Entregue

* [x] Express instalado.
* [x] `backend/api/server.js`.
* [x] Porta configurável por `PORT`, default `3001`.
* [x] CORS.
* [x] JSON parser.
* [x] Logger simples.
* [x] Helmet.
* [x] Rate limit em `/api`.
* [x] Error handler global.
* [x] Health check em `GET /api/health`.

### Pendências do MVP API

* [ ] Definir resposta única em todas as rotas no formato `{ success, data, error }`.
* [ ] Adicionar Request ID.

### Backlog / decisão futura

* [ ] Avaliar necessidade de health alternativo em `GET /health`.

---

## Task 3.2 - Questões

Status: MVP funcional.

### Entregue

* [x] `GET /api/questions`.
* [x] Filtros por `certification`, `domain`, `difficulty`, `limit`, `offset` e `search`.
* [x] `GET /api/questions/:id`.
* [x] `POST /api/questions`.
* [x] `PUT /api/questions/:id`.
* [x] `DELETE /api/questions/:id` com soft delete.
* [x] Busca via `GET /api/questions?search=termo`.

### Backlog / decisão futura

* [ ] Avaliar necessidade de rota separada `GET /api/questions/search?q=termo`.

---

## Task 3.3 - Quiz e Histórico

Status: MVP funcional com pendências.

### Entregue

* [x] `POST /api/quiz/start`.
* [x] Alias `POST /api/quizzes/start`.
* [x] `POST /api/quiz/:id/answer`.
* [x] Alias `POST /api/quizzes/:id/answer`.
* [x] `GET /api/quiz/:id/results`.
* [x] Alias `GET /api/quizzes/:id/results`.
* [x] `GET /api/quiz/:id`.
* [x] Alias `GET /api/quizzes/:id`.

### Pendências

* [ ] `POST /api/quiz/:quizId/finish`.
* [ ] `GET /api/quiz/history/:userId`.
* [ ] Selecionar e embaralhar questões com paridade total ao frontend.

---

## Task 3.4 - Usuários e Gamificação

Status: MVP funcional com pendências.

### Entregue

* [x] `POST /api/users`.
* [x] Geração de nome anônimo quando ausente.
* [x] `GET /api/users/:id/stats`.
* [x] `GET /api/users/:id/weak-domains`.
* [x] `GET /api/leaderboard`.

### Pendências

* [ ] `GET /api/users/:id`.
* [ ] `GET /api/users/:id/gamification`.
* [ ] `PUT /api/users/:id/gamification`.

---

## Task 3.5 - Segurança e Validação

Status: MVP funcional.

### Entregue

* [x] Validações na camada de banco.
* [x] Rate limit.
* [x] Helmet.
* [x] Error handler global.
* [x] Auditoria de dependências de produção com `npm audit --omit=dev`.

### Pendências

* [ ] Middleware dedicado de sanitização/validação.
* [ ] Testes específicos de segurança.

---

## Task 3.6 - Testes

Status: funcional.

### Entregue

* [x] Testes de integração em `__tests__/api.integration.test.js`.
* [x] Testes de validação em `__tests__/api.validation.test.js`.
* [x] Suite completa passou em 2026-06-18: 9 suites, 77 testes.

### Pendências

* [ ] Coverage formal definido e publicado.
* [ ] E2E mínimo de navegador.

---

## Task 3.7 - Documentação da API

Status: parcial.

### Entregue

* [x] Rotas reais documentadas em `docs/ROUTES_AND_INTEGRATIONS.md`.

### Pendências

* [ ] Criar `docs/API.md` ou OpenAPI.
* [ ] Adicionar exemplos completos de erro e sucesso por endpoint.

---

# Épico 4 - Socket Server e Start Integrado

Status: decisão pendente.

Existem scripts antigos relacionados a socket/start integrado, mas eles não são o fluxo oficial atual do app completo.

## Decisões pendentes

* [ ] Revisar `scripts/pglite.js`.
* [ ] Revisar `backend/database/socketServer.js`.
* [ ] Decidir se socket server continua no produto.
* [ ] Criar comando único para app completo, se fizer sentido.
* [ ] Avaliar graceful shutdown integrado.

## Leitura atual

O fluxo oficial recomendado continua sendo:

1. `npm run db:seed`
2. `npm run api:start`
3. `npm run dev`

---

# Épico 5 - Validação de Questões

Status: MVP técnico concluído; validação manual pendente.

A validação de questões está implementada tecnicamente com persistência em PGlite, endpoints Express e testes automatizados.

## Banco de Dados

* [x] Campo `validation_status`.
* [x] Campo `rejection_reason`.
* [x] Campo `validation_logs`.
* [x] Campos `validated_by` e `validated_at`.
* [x] Constraint para `PENDING`, `APPROVED` e `REJECTED`.
* [x] Índice `idx_questions_validation_status`.

## Camada de Dados

* [x] `getPendingQuestions()`.
* [x] `validateQuestion()`.

## API Express

* [x] `GET /api/questions/pending`.
* [x] `POST /api/questions/:id/validate`.
* [x] Rejeição com motivo obrigatório.
* [x] Validação de payload inválido.

## Painel de Validação

* [x] Painel usa API real por padrão.

## Testes

* [x] Teste de listar questões pendentes.
* [x] Teste de aprovar questão.
* [x] Teste de rejeitar questão.
* [x] Teste de payload inválido.
* [x] Teste manual completo do painel.

## Pendências operacionais

* [ ] Decidir destino do FastAPI em `validation/backend/`.

## Roteiro de teste manual do painel

* [ ] Iniciar API com `npm run api:start`.
* [ ] Iniciar frontend com `npm run dev`.
* [ ] Abrir painel de validação.
* [ ] Confirmar carregamento de questões pendentes.
* [ ] Aprovar uma questão.
* [ ] Rejeitar uma questão com motivo.
* [ ] Tentar rejeitar sem motivo e validar bloqueio.
* [ ] Atualizar a lista após aprovação/rejeição.
* [ ] Confirmar que a API retorna o status atualizado.

---

# Épico 6 - Trilha Visual e Gamificação

Status: MVP implementado.

O produto já possui estrutura de trilha, sprint, badges, leaderboard e desafios.
Ainda falta validar experiência final, acessibilidade e fluxo completo em navegador.

## Entregue

* [x] `trailManager.js`.
* [x] `sprintManager.js`.
* [x] `badges.js`.
* [x] `leaderboard.js`.
* [x] `interactiveEngine.js`.
* [x] Dados de desafios interativos.
* [x] Testes de sprint.

## Pendências

* [ ] Especificação visual final da trilha.
* [ ] Revisão de animações e estados por UX/acessibilidade.
* [ ] E2E de gamificação.

---

# Épico 7 - Gaps e Recomendações

Status: parcial.

O backend já calcula domínios fracos, mas a interface ainda precisa transformar esse dado em recomendações claras de estudo.

## Entregue

* [x] `getWeakDomains(userId, threshold)` no banco.
* [x] Endpoint `GET /api/users/:id/weak-domains`.
* [x] Insights locais no frontend.

## Pendências

* [ ] Conectar recomendações principais aos domínios fracos da API.
* [ ] Criar card "o que estudar agora" baseado em backend.
* [ ] Adicionar links oficiais AWS por domínio.

---

# Épico 8 - PDF e Relatórios

Status: MVP implementado.

O relatório PDF já existe e pode ser exportado.
O foco agora é melhorar acabamento visual, filtros e validação real em navegadores.

## Entregue

* [x] `pdfReport.js`.
* [x] Exportação de relatório de desempenho.
* [x] Dependências `jspdf` e `html2canvas`.

## Pendências

* [ ] Criar template profissional final.
* [ ] Adicionar filtro "apenas erros".
* [ ] Validar visualmente o PDF em navegadores reais.

---

# Épico 9 - Testes com Usuários e Staging

Status: pendente.

Este épico deve entrar depois da estabilização do app completo, documentação da API e validação manual dos fluxos principais.

## Pendências

* [ ] Ambiente de staging.
* [ ] Plano de teste com usuários.
* [ ] Formulário de feedback.
* [ ] Análise dos feedbacks.
* [ ] Priorização de bugs críticos.
* [ ] Preparação de demo/apresentação.

---

# Backlog Técnico Geral

Itens abaixo são importantes, mas não bloqueiam o MVP atual.

## Governança e CI/CD

* [ ] Adicionar workflow `ci.yml` com `format:check`, `lint`, `test`, `build` e `npm audit --omit=dev`.
* [ ] Adicionar badge do CI no README.
* [ ] Criar template de Pull Request.
* [ ] Criar `SECURITY.md`.
* [ ] Criar `.nvmrc`.
* [ ] Criar `.editorconfig`.
* [ ] Avaliar Dependabot.

## Qualidade de Código

* [ ] Reduzir ou justificar warnings de `console` reportados pelo lint.
* [ ] Definir política para logs de desenvolvimento.
* [ ] Avaliar coverage mínimo.
* [ ] Separar warnings aceitáveis de problemas reais.

## Documentação

* [ ] Criar `docs/API.md`.
* [ ] Adicionar exemplos de request/response por endpoint.
* [ ] Atualizar README com status real, badges e instruções completas.
* [ ] Documentar estratégia de fallback offline.
* [ ] Documentar fluxo de validação de questões.

## Produto e UX

* [ ] Testar responsividade mobile.
* [ ] Revisar acessibilidade básica.
* [ ] Adicionar prints ou GIFs ao README.
* [ ] Validar fluxo completo de estudo com usuário real.

## Dados e Conteúdo

* [ ] Auditar qualidade PT/EN.
* [ ] Revisar consistência das questões por certificação.
* [ ] Avaliar duplicidade de questões.
* [ ] Definir critérios de aprovação de conteúdo.

---

# Próxima Sprint Recomendada

## Objetivo

Validar o app completo em ambiente local, fechar pendências operacionais do Épico 5 e preparar o repositório para demonstração pública.

## Tarefas recomendadas

1. Rodar app completo com API + PGlite seedado.
2. Fazer teste manual completo do painel de validação.
3. Testar manualmente simulados, leaderboard, gamificação e PDF.
4. Decidir destino do FastAPI em `validation/backend/`.
5. Criar workflow de CI com:

   * `npm run format:check --if-present`
   * `npm run lint --if-present`
   * `npm test -- --runInBand`
   * `npm run build`
   * `npm audit --omit=dev`
6. Criar `docs/API.md` com exemplos reais de sucesso e erro.
7. Criar E2E mínimo de navegador para fluxo principal.
8. Reduzir ou justificar warnings de `console`.
9. Auditar qualidade PT/EN.

## Critério de encerramento da sprint

* App completo rodando localmente.
* Painel de validação testado manualmente.
* CI rodando verde no GitHub Actions.
* Documentação da API criada ou iniciada.
* Pendências críticas separadas de backlog futuro.
