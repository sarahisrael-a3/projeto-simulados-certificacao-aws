# Checklist do Projeto

Atualizado em: 2026-06-18

Este checklist cruza a documentacao com a base real do repositorio. A leitura considera `src/` como fonte do frontend, `public/` como artefato de build, `backend/api/` como API Express oficial atual e `backend/database/` como camada PGlite.

## Status Executivo

- [x] Frontend SPA/PWA funcional em JavaScript vanilla.
- [x] Dados JSON versionados para uso offline e seed do banco.
- [x] API Express local criada e integrada a PGlite.
- [x] Camada PGlite consolidada com schema, queries, testes e seed.
- [x] Painel estatico de validacao existe e e copiado para `public/validation/`.
- [x] Colunas de controle de validacao adicionadas em `questions`.
- [x] Painel de validacao integrado a endpoints reais da API Express.
- [x] Validacao de questoes persiste aprovacao/rejeicao no banco oficial.
- [x] Itens de seguranca Sprint 1 aplicados: Helmet, rate limiting e middleware global de erro.
- [x] `EPICOS-E-TASKS.md` atualizado para refletir o estado real do Epico 5.
- [ ] Suite Jest completa nao foi validada nesta revisao: `npm test -- --runInBand` excedeu 120s.

## Frontend E Produto

- [x] Frontend SPA em HTML, CSS e JavaScript vanilla.
- [x] Build local copiando `src/frontend/js`, `src/frontend/styles`, `src/services`, `data/` e `validation/` para `public/`.
- [x] PWA com `manifest.json` e service worker.
- [x] Simulado principal por certificacao.
- [x] Teste diagnostico por certificacao.
- [x] Modo flashcards.
- [x] Pratica de questoes erradas.
- [x] Filtro por topico/dominio.
- [x] Troca de idioma PT/EN.
- [x] Tema claro/escuro.
- [x] Historico e progresso local via `storageManager`.
- [x] Badges, streak e progresso de gamificacao local.
- [x] Dashboard de desempenho e graficos.
- [x] Insights de estudo.
- [x] Relatorio PDF de desempenho.
- [x] Pomodoro.
- [x] Sprint de estudo de 14 dias.
- [x] Trilha visual de gamificacao.
- [x] Desafios interativos de gamificacao.
- [ ] Testes e2e dos fluxos principais do navegador.
- [ ] Revisao completa de acessibilidade.
- [ ] Revisao completa de responsividade mobile em navegadores reais.

## Dados E Conteudo

- [x] Dados principais para CLF-C02, SAA-C03, DVA-C02 e AIF-C01.
- [x] Dados de nivelamento/diagnostico para as quatro certificacoes.
- [x] Templates de contribuicao de questoes.
- [x] Scripts Python para validacao, traducao, geracao, deteccao de duplicatas e merge de contribuicoes.
- [x] Seed reprodutivel dos JSONs principais para PGlite via `npm run db:seed`.
- [x] Seed PGlite validado anteriormente com `DB_DATA_DIR` local e `memory://` em teste.
- [ ] Auditar qualidade das questoes e traducoes.
- [ ] Auditar arquivos `*-en.json` com trechos em portugues ou traducao mista.
- [ ] Normalizar diferencas de quantidade entre pares PT/EN.
- [ ] Gerar relatorio de duplicidades e semelhancas por certificacao.
- [ ] Definir padrao final de campos de questao.

## Banco PGlite

- [x] `backend/database/schema.sql` com tabelas de usuarios, dominios, questoes, historico de quiz, respostas, gamificacao e sessoes de foco.
- [x] Campos `validated_by` e `validated_at` existem em `questions`.
- [x] Views de `leaderboard` e `user_stats`.
- [x] Camada `backend/database/db.js` com inicializacao, fechamento e acesso global.
- [x] CRUD de questoes no banco.
- [x] Usuarios anonimos no banco.
- [x] Historico de quiz e respostas no banco.
- [x] Estatisticas, ranking e dominios fracos no backend.
- [x] `recordAnswer()` calcula `is_correct` no backend com base em `correct_answer` e ignora o valor enviado pelo caller.
- [x] Campos `validation_status`, `rejection_reason` e `validation_logs` existem em `questions`.
- [x] Check constraint limita `validation_status` a `PENDING`, `APPROVED` e `REJECTED`.
- [x] Indice `idx_questions_validation_status` criado.
- [x] Funcoes `getPendingQuestions()` e `validateQuestion()` implementadas em `backend/database/db.js`.
- [x] `getPendingQuestions()` e `validateQuestion()` exportadas como named exports e consumidas pelas rotas Express.
- [x] `validateQuestion()` valida status, validador, motivo de rejeicao e questao inexistente.
- [ ] `validation_logs` existe como coluna JSONB em `questions`, mas ainda nao ha tabela separada de auditoria.
- [ ] Tabela oficial `validator_assignments` ainda nao existe no schema PGlite oficial.

## API Express

- [x] API Express em `backend/api/server.js`.
- [x] CORS habilitado.
- [x] Helmet configurado para seguranca de headers HTTP.
- [x] Rate limiting configurado em `/api`.
- [x] JSON parser configurado.
- [x] Logger simples por request.
- [x] Error handler global.
- [x] Middleware global de erro retorna JSON padronizado `{ error, status }`.
- [x] Health check em `GET /api/health`.
- [x] Rotas REST de questoes: listar, buscar por ID, criar, atualizar e remover logicamente.
- [x] Filtros de questoes por `certification`, `domain`, `difficulty`, `limit`, `offset` e `search`.
- [x] Rotas REST de quiz: iniciar, responder, ver resultados e detalhes.
- [x] Rotas REST de usuarios: criar usuario, estatisticas e dominios fracos.
- [x] Rota REST de leaderboard.
- [x] Teste de integracao Express para health, listar questoes, iniciar quiz, responder e obter resultado.
- [ ] Request ID para rastreamento.
- [ ] Health check em `GET /health`, se o contrato do Epico 3 continuar exigindo esse caminho.
- [ ] Resposta padronizada ainda usa combinacao de `message`, `data`, `count`, `pagination` e `error`; falta contrato unico `{ success, data, error }`.
- [ ] `GET /api/questions/search?q=termo` nao existe como rota separada; busca atual fica em `GET /api/questions?search=termo`.
- [ ] `POST /api/quiz/:quizId/submit` nao existe; endpoint atual e `POST /api/quiz/:id/answer`.
- [ ] `POST /api/quiz/:quizId/finish` nao existe.
- [ ] `GET /api/quiz/history/:userId` nao existe.
- [ ] `GET /api/users/:userId` nao existe.
- [ ] `GET /api/users/:userId/gamification` nao existe.
- [ ] `PUT /api/users/:userId/gamification` nao existe.
- [ ] Middleware dedicado de validacao/seguranca em `backend/middleware/validation.js`.
- [x] Rate limiting por IP.
- [ ] Sanitizacao explicita de inputs para XSS.
- [ ] OpenAPI/Swagger ou `docs/API.md` dedicado.
- [x] Rota Express `GET /api/questions/pending`.
- [x] Rota Express `POST /api/questions/:id/validate`.
- [x] Testes de integracao para as rotas de validacao.

## Integracao Frontend + API

- [x] `apiService` centralizado com normalizacao de resposta, timeout e fallback.
- [x] Frontend tenta API para questoes e usa JSON local como fallback.
- [x] `userManager`, `quizManager` e `leaderboard` usam API quando disponivel.
- [x] Fallback offline preservado via JSON/localStorage.
- [ ] Validacao manual completa com frontend + API + PGlite seedado em ambiente local.
- [ ] Algumas telas/fluxos ainda dependem diretamente dos JSONs.
- [ ] O contrato do frontend ainda envia `is_correct` em alguns pontos, apesar de a camada de banco recalcular.
- [ ] Quiz API ainda precisa embaralhar/selecionar questoes de forma equivalente ao frontend.
- [ ] Recomendacoes de estudo ainda nao estao ligadas aos dominios fracos calculados pelo backend.

## Painel De Validacao

- [x] Painel estatico de validacao iniciado em `validation/valid.html`.
- [x] Estilos do painel em `validation/css/valid.css`.
- [x] UI do painel em `validation/js/validationUI.js`.
- [x] Estado local auxiliar em `validation/js/validationStorage.js`.
- [x] Contrato planejado documentado em `window.VALIDATION_API_CONTRACT`.
- [x] Painel sinalizado como demo/mock sem persistencia real.
- [x] Backend FastAPI separado iniciado em `validation/backend/`.
- [x] `validation/js/validationAPI.js` usa `USE_MOCK_DATA = false`.
- [x] `validation/js/validationAPI.js` consome `GET /api/questions/pending` com `fetch()`.
- [x] `validation/js/validationAPI.js` consome `POST /api/questions/:id/validate` com `fetch()`.
- [x] Aprovacao/rejeicao atualiza `questions.validated_by` e `questions.validated_at` no PGlite oficial.
- [x] Motivo de rejeicao, status de validacao e historico em `validation_logs` sao persistidos no PGlite oficial.
- [ ] FastAPI de validacao contem TODOs e usa mocks/stubs, sem integracao com `backend/database/db.js`.
- [x] Decisao arquitetural aplicada: validacao consolidada no Express oficial.
- [x] Testes de integracao para listar pendentes, aprovar e rejeitar.

## Epicos E Roadmap

- [x] Epico 2 - Camada de Banco de Dados PGlite: concluido na estrutura atual.
- [x] Epico 3 - API REST com Express: implementado parcialmente e utilizavel.
- [ ] Epico 3 - API REST com Express: ainda nao atende todos os criterios descritos em `EPICOS-E-TASKS.md`.
- [ ] Epico 4 - Socket Server atualizado: pendente.
- [x] Epico 5 / Fase 3 - Validacao Colaborativa de Questoes: concluido tecnicamente.
- [ ] Fase 4 - Qualidade dos Dados e Conteudo: pendente/parcial.
- [ ] Fase 5 - Produto e Experiencia: concluida em recursos atuais, pendente em CAT, acessibilidade e e2e.
- [ ] Fase 6 - Plataforma, Comunidade e Escala: pendente.

## Workflows E Automacoes

- [x] Workflows GitHub Actions para deploy Pages, testes JS, validacao de contribuicoes e automacoes.
- [x] Workflow JS observando `src/frontend/js/**`, `src/services/**`, `backend/**`, `scripts/**` e `__tests__/**`.
- [x] Documentacao principal atualizada para API Express real e comandos oficiais.
- [x] `docs/ROUTES_AND_INTEGRATIONS.md` reflete a API Express real.
- [x] `.env.example` documenta `DB_DATA_DIR`.
- [ ] Padronizar encoding dos arquivos que aparecem corrompidos no terminal.
- [ ] Tratar `src/` como fonte e `public/` como build para evitar divergencias manuais.

## Verificacoes Nesta Revisao

- [x] Leitura cruzada de `docs/CHECKLIST.md`, `docs/ROADMAP.md` e `docs/EPICOS-E-TASKS.md`.
- [x] Inspecao de `backend/api/server.js`, rotas Express e `backend/database/schema.sql`.
- [x] Inspecao de `validation/js/validationAPI.js` e `validation/backend/main.py`.
- [x] Inspecao das colunas `validation_status`, `rejection_reason` e `validation_logs`.
- [x] `npm test -- __tests__/api.integration.test.js --runInBand` passou: 1 suite, 3 testes.
- [x] `npm test -- __tests__/api.validation.test.js --runInBand` passou: 1 suite, 5 testes.
- [x] `npm test -- backend\database\db.test.js --runInBand -t "updates a question"` passou: 1 teste focado.
- [x] `npm run build` passou e sincronizou `public/validation`.
- [ ] `npm test -- --runInBand` nao concluiu nesta revisao: comando excedeu timeout de 120s.
- [ ] `npm run lint` nao executado nesta revisao.
- [ ] `npm run format:check` nao executado nesta revisao.
- [ ] Teste manual do app em `public/`.
- [ ] Teste manual da API em `http://127.0.0.1:3001/api/health`.

## Proximos Passos Praticos

- [x] Decidir e registrar a arquitetura oficial da validacao: consolidada no Express para reutilizar `backend/database/db.js`.
- [x] Adicionar no schema oficial os campos minimos para validacao: `validation_status`, `rejection_reason` e `validation_logs`.
- [x] Finalizar funcoes em `backend/database/db.js`: named exports, validacoes e retorno padronizado.
- [ ] Criar funcoes em `backend/database/db.js`: `getValidationHistory()` e `getValidatorStats()`, se forem mantidas no escopo do epico.
- [x] Implementar rotas Express `GET /api/questions/pending` e `POST /api/questions/:id/validate`.
- [x] Atualizar `validation/js/validationAPI.js` para usar API real e manter mock apenas como fallback explicito.
- [x] Criar testes de integracao para fluxo de validacao.
- [x] Atualizar `EPICOS-E-TASKS.md` para refletir que a frente ativa real e a validacao colaborativa.
- [ ] Rodar teste manual completo com API + PGlite + painel de validacao.

## Gargalos Arquitetonicos

- [x] Dois backends concorrentes para validacao resolvido para o fluxo oficial: Express + PGlite.
- [x] Modelo de validacao minimo completo no schema oficial: `validation_status`, `rejection_reason`, `validation_logs`, `validated_by` e `validated_at`.
- [ ] Contratos de rota divergentes entre `EPICOS-E-TASKS.md`, `ROUTES_AND_INTEGRATIONS.md` e codigo real.
- [ ] Encoding inconsistente em documentos pode atrapalhar manutencao e revisao.
