# 📋 Épicos e Tasks - MVP Simulador AWS (v2.0)

**Data:** 2026-06-02  
**Versão:** 2.0 (Reformulado com PGLite)  
**Status:** Épico 2 concluído; próximo passo é Épico 3

---

## 📊 Status Atual

### ✅ Épico 1: PostgreSQL (PGLite) - 50%

- ✅ Task 1.1: Schema PostgreSQL - **CONCLUÍDA**
- ✅ Task 1.2: Script Migração - **CONCLUÍDA**
- ⏳ Task 1.3: API FastAPI - AGUARDANDO INTEGRAÇÃO
- 🟡 Task 1.4: Validação Questões - ABSORVIDA PELO ÉPICO 5 (interface interna iniciada; backend/API real pendente)

**Bloqueador histórico:** Integração PGLite com FastAPI. A continuidade desta
frente deve acontecer no Épico 5, após decisão sobre API oficial e integração
com a camada `backend/database/db.js`.

---

## ✅ Status atualizado em 2026-06-07

### Concluído e comprovado

- **Épico 2: Camada de Banco de Dados PGLite — CONCLUÍDO**
  - Task 2.1: Inicialização e conexão PGlite
    - Commit: `65d742f fix: consolidate pglite database initialization`
  - Task 2.2: CRUD de questões
    - Commit: `61a8545 feat: complete question crud in database layer`
  - Task 2.3: Histórico de quiz e respostas
    - Commit: `611a3fc feat: add quiz history database operations`
  - Checagem de extensões PGlite/documentação
    - Commit: `6ef0f02 docs: note PGlite contrib extensions`
  - Task 2.4: Usuários e gamificação
    - Commit: `c9f9fee feat: add user gamification database operations`
  - Task 2.5: Testes unitários do `db.js`
    - Commit: `dc85440 test: strengthen database layer coverage`
  - Task 2.6: Documentação do `db.js`
    - Commit: `3c5e7c5 docs: document database layer`

### Validações recentes

- Suíte completa passou com 70 testes.
- Testes do banco passaram.
- `npm run lint` passou com 0 erros e warnings antigos de `console`.
- `git diff --check` passou na task de documentação.

### Observações de escopo

- A camada `backend/database/db.js` está pronta para ser consumida pela API.
- JSON ainda permanece como fallback/referência/seed futuro.
- PGlite está consolidado na camada de banco.
- Integração completa com API/ambiente de produção ainda depende do Épico 3.
- API Express existente deve ser tratada como parcial/existente, mas ainda não
  validada por este roadmap.
- A antiga Task 1.4 de validação possui UI interna iniciada em `validation/`,
  mas foi absorvida pelo Épico 5 porque endpoints, persistência e auditoria real
  ainda não estão concluídos.

---

## 🎯 ÉPICO 2: Camada de Banco de Dados PGLite (NOVO - PRIORIDADE 1)

**Status:** ✅ CONCLUÍDO
**Estimativa:** 3 dias  
**Objetivo:** Implementar camada de abstração do banco de dados

---

### Task 2.1: Implementar db.js (Inicialização e Conexão)

**Status:** ✅ CONCLUÍDA
**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 4 horas
**Commit:** `65d742f fix: consolidate pglite database initialization`

Criar arquivo `backend/database/db.js` com funções de inicialização e gerenciamento do PGLite.

**Checklist:**

- [x] Criar `backend/database/db.js`
- [x] Função `initializeDatabase(config)` com:
  - [x] Criar instância PGLite
  - [x] Carregar schema.sql
  - [x] Criar tabelas
  - [x] Criar índices
  - [x] Retornar instância db
- [x] Função `closeDatabase()` para encerrar conexão
- [x] Função `getDatabase()` para acessar instância global
- [x] Tratamento de erros com try/catch
- [x] Logging em cada etapa
- [x] Suportar `dataDir` customizável
- [x] Exportar como módulo ES6

**Exemplo de estrutura:**

```javascript
export async function initializeDatabase(config) {
  // Inicializar PGLite
  // Executar schema.sql
  // Criar índices
  // Retornar db
}

export async function closeDatabase() {
  // Fechar conexão
  // Liberar recursos
}

export function getDatabase() {
  // Retornar instância global
}
```

---

### Task 2.2: Implementar CRUD de Questões no db.js

**Status:** ✅ CONCLUÍDA
**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 6 horas
**Commit:** `61a8545 feat: complete question crud in database layer`

Adicionar métodos CRUD para questões em `db.js`.

**Checklist:**

- [x] Função `getQuestions(certification, domain, difficulty)`
- [x] Função `getQuestionById(id)`
- [x] Função `insertQuestion(questionData)`
- [x] Função `updateQuestion(id, questionData)`
- [x] Função `deleteQuestion(id)`
- [x] Função `searchQuestions(query, limit)`
- [x] Função `getQuestionsByDomain(certification, domain)`
- [x] Implementar paginação em queries
- [x] Adicionar índices de performance
- [x] Tratamento de erros específicos
- [x] Logging de queries (modo debug)
- [x] Validação de entrada de dados

---

### Task 2.3: Implementar CRUD de Histórico Quiz

**Status:** ✅ CONCLUÍDA
**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 4 horas
**Commit:** `611a3fc feat: add quiz history database operations`

Adicionar métodos para histórico de quizzes e respostas.

**Checklist:**

- [x] Função `createQuizHistory(userId, certification, answers)`
- [x] Função `getQuizHistory(userId, limit, offset)`
- [x] Função `getQuizById(quizId)`
- [x] Função `recordAnswer(quizId, questionId, userAnswer, isCorrect, timeSecs)`
- [x] Função `getAnswersByQuiz(quizId)`
- [x] Função `calculateStats(userId)` - retorna agregações
- [x] Função `getWeakDomains(userId, threshold)` - domínios com < threshold%
- [x] Transações SQL para garantir integridade
- [x] Índices de performance

---

### Task 2.4: Implementar CRUD de Usuários e Gamificação

**Status:** ✅ CONCLUÍDA
**Prioridade:** Alta | **Estimativa:** 4 horas
**Commit:** `c9f9fee feat: add user gamification database operations`

Adicionar métodos para usuários e gamificação.

**Checklist:**

- [x] Função `createUser(anonymousName)`
- [x] Função `getUserById(userId)`
- [x] Função `getUserByName(anonymousName)`
- [x] Função `updateUser(userId, data)`
- [x] Função `getGamification(userId)`
- [x] Função `updateGamification(userId, data)` - XP, badges, streak
- [x] Função `getLeaderboard(limit)` - top 100 usuários
- [x] Função `getUserStats(userId)` - agregações completas
- [x] Validações de unicidade

---

### Task 2.5: Testes Unitários do db.js

**Status:** ✅ CONCLUÍDA
**Prioridade:** Alta | **Estimativa:** 5 horas
**Commit:** `dc85440 test: strengthen database layer coverage`

Criar testes para todas as funções do db.js.

**Checklist:**

- [x] Criar testes em `backend/database/db.test.js`
- [x] Setup/teardown com banco de testes
- [x] Testes CRUD básicos
- [x] Testes de paginação
- [x] Testes de erro (validação)
- [x] Testes de consultas e índices relevantes
- [x] Testes de transações
- [x] Suíte completa passando com 70 testes
- [x] Testes do banco passando

---

### Task 2.6: Documentação do db.js

**Status:** ✅ CONCLUÍDA
**Prioridade:** Média | **Estimativa:** 2 horas
**Commit:** `3c5e7c5 docs: document database layer`

Documentar camada de banco de dados.

**Checklist:**

- [x] Atualizar `backend/database/README.md` com:
  - [x] Descrição de cada tabela principal
  - [x] Documentação de cada função pública
  - [x] Exemplos de uso
  - [x] Troubleshooting
  - [x] Ambientes, variáveis e comandos úteis
- [x] Exemplos com await/async

---

## 🎯 ÉPICO 3: API REST com Express (NOVO - PRIORIDADE 2)

**Status:** 🟡 Parcial existente, ainda não validado por este roadmap
**Estimativa:** 3 dias  
**Objetivo:** Endpoints HTTP para frontend consumir

**Dependência:** Épico 2 (db.js completo) — ✅ atendida

**Nota de status:** há estrutura/API Express parcial no repositório, mas o
Épico 3 ainda não foi executado nem validado contra as tasks abaixo. Não está
concluído.

---

### Task 3.1: Configurar Express.js e Middleware

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 3 horas

Criar aplicação Express com middlewares essenciais.

**Checklist:**

- [ ] Instalar `express` em package.json
- [ ] Criar `backend/server-express.js` (novo arquivo, substitui server.js)
- [ ] Configurar:
  - [ ] CORS habilitado
  - [ ] JSON parser
  - [ ] Error handler global
  - [ ] Logger middleware
  - [ ] Request ID para rastreamento
- [ ] Ouvir em porta 3001 (ou customizável via ENV)
- [ ] Health check em `GET /health`
- [ ] Resposta JSON padronizada `{success, data, error}`

---

### Task 3.2: Endpoints de Questões

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 4 horas

Implementar CRUD de questões em REST API.

**Checklist:**

- [ ] `GET /api/questions` - Listar com filtros
  - [ ] Filtrar por `certification`
  - [ ] Filtrar por `domain`
  - [ ] Filtrar por `difficulty`
  - [ ] Paginação com `limit` e `offset`
  - [ ] Retornar total de registros
- [ ] `GET /api/questions/:id` - Detalhes de uma questão
- [ ] `POST /api/questions` - Criar nova questão
  - [ ] Validar JSON
  - [ ] Validar campos obrigatórios
  - [ ] Retornar erro 400 se inválido
- [ ] `PUT /api/questions/:id` - Atualizar questão
- [ ] `DELETE /api/questions/:id` - Deletar questão
- [ ] `GET /api/questions/search?q=termo` - Busca full-text

---

### Task 3.3: Endpoints de Quiz e Histórico

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 4 horas

Implementar endpoints de quiz e histórico.

**Checklist:**

- [ ] `POST /api/quiz/start` - Inicia novo quiz
  - [ ] Recebe `userId`, `certification`, `numQuestions`
  - [ ] Retorna array de questões
  - [ ] Cria registro em quiz_history
- [ ] `POST /api/quiz/:quizId/submit` - Submete resposta
  - [ ] Recebe `questionId`, `userAnswer`, `timeSecs`
  - [ ] Valida resposta
  - [ ] Salva em answers
  - [ ] Retorna `{correct: boolean, explanation}`
- [ ] `POST /api/quiz/:quizId/finish` - Finaliza quiz
  - [ ] Calcula score final
  - [ ] Salva stats completos
  - [ ] Retorna relatório final
- [ ] `GET /api/quiz/history/:userId` - Histórico de quizzes
  - [ ] Paginação
  - [ ] Ordenar por data DESC
- [ ] `GET /api/quiz/:quizId` - Detalhes do quiz
  - [ ] Retorna quiz + todas as respostas

---

### Task 3.4: Endpoints de Usuários e Gamificação

**Prioridade:** Alta | **Estimativa:** 3 horas

Implementar endpoints de usuários.

**Checklist:**

- [ ] `POST /api/users` - Criar usuário anônimo
  - [ ] Gera `anonymousName` automático se não fornecido (ex: CloudNinja#4821)
  - [ ] Retorna `userId`
- [ ] `GET /api/users/:userId` - Dados do usuário
- [ ] `GET /api/users/:userId/stats` - Estatísticas
  - [ ] Total de quizzes
  - [ ] Score médio
  - [ ] Melhor score
  - [ ] Tempo total estudado
- [ ] `GET /api/users/:userId/gamification` - Dados de gamificação
  - [ ] XP points
  - [ ] Badges
  - [ ] Streak
  - [ ] Completed stages
- [ ] `PUT /api/users/:userId/gamification` - Atualizar gamificação
  - [ ] Adicionar XP
  - [ ] Desbloquear badge
  - [ ] Atualizar streak
- [ ] `GET /api/leaderboard` - Top 100 usuários
  - [ ] Ordenado por XP DESC

---

### Task 3.5: Middleware de Validação e Segurança

**Prioridade:** Alta | **Estimativa:** 3 horas

Implementar validações e segurança.

**Checklist:**

- [ ] Criar `backend/middleware/validation.js`
- [ ] Validar estrutura JSON de questões
- [ ] Sanitizar inputs (XSS prevention)
- [x] Rate limiting por IP
- [ ] Validação de tipos (schema)
- [x] Error handler customizado
- [ ] Middleware de autenticação básica (se necessário)
- [ ] Testes de segurança

---

### Task 3.6: Testes de Integração da API

**Prioridade:** Alta | **Estimativa:** 5 horas

Testes E2E dos endpoints.

**Checklist:**

- [ ] Criar `tests/integration/api.test.js`
- [ ] Testes para cada endpoint
- [ ] Testes de erro (404, 400, 500)
- [ ] Testes de validação
- [ ] Testes de paginação
- [ ] Coverage > 85%
- [ ] Todos passando ✅

---

### Task 3.7: Documentação da API

**Prioridade:** Média | **Estimativa:** 3 horas

Documentar todos os endpoints.

**Checklist:**

- [ ] Criar `docs/API.md` com:
  - [ ] Lista completa de endpoints
  - [ ] Método HTTP e caminho
  - [ ] Parâmetros esperados
  - [ ] Resposta esperada (exemplo JSON)
  - [ ] Códigos de erro possíveis
- [ ] Adicionar JSDoc em cada rota
- [ ] Gerar OpenAPI spec (Swagger)
- [ ] Exemplo de chamadas com curl

---

## 🎯 ÉPICO 4: Script Socket Server Atualizado (NOVO - PRIORIDADE 3)

**Status:** ⏳ Não iniciado  
**Estimativa:** 1 dia  
**Objetivo:** Atualizar scripts/pglite.js para integrar com Express

**Dependência:** Épicos 2 e 3

---

### Task 4.1: Refatorar scripts/pglite.js

**Prioridade:** Alta | **Estimativa:** 3 horas

Limpar e refatorar o script de inicialização.

**Checklist:**

- [ ] Remover import não utilizado (`exec`)
- [ ] Integrar com `db.js`
- [ ] Usar função `initializeDatabase()` do Épico 2
- [ ] Manter Socket Server para conexões em tempo real
- [ ] Adicionar health checks
- [ ] Melhorar logging
- [ ] Adicionar variáveis de ambiente

---

### Task 4.2: Script de Inicialização Completa

**Prioridade:** Média | **Estimativa:** 2 horas

Criar script que inicia banco + Express.

**Checklist:**

- [ ] `scripts/start-dev.js` que:
  - [ ] Inicia PGLite
  - [ ] Inicia Express API
  - [ ] Inicia Socket Server
  - [ ] Logs sincronizados
  - [ ] Graceful shutdown
- [ ] Adicionar comando `npm run start:dev`
- [ ] Testar inicialização completa

---

## 🎯 ÉPICO 5: Validação de Questões (PRIORIDADE 4)

**Status:** ✅ Concluído tecnicamente via Express + PGlite; validação manual completa pendente
**Estimativa:** 3 dias  
**Objetivo:** Sistema de validação 100% funcional

**Dependência:** Épicos 2, 3, 4

**Origem:** absorve a antiga Task 1.4 "Validação Questões".

**Estado atual comprovado:**

- UI interna iniciada em `validation/valid.html`.
- Estilos da tela iniciados em `validation/css/valid.css`.
- Lógica de UI/localStorage iniciada em `validation/js/validationUI.js` e
  `validation/js/validationStorage.js`.
- `validation/js/validationAPI.js` usa API real com `USE_MOCK_DATA = false`.
- Schema oficial de `questions` ja possui `validation_status`, `rejection_reason`
  e `validation_logs`.
- Funcoes `getPendingQuestions()` e `validateQuestion()` foram finalizadas em
  `backend/database/db.js` com named export, validacoes e cobertura dedicada.
- Backend FastAPI separado existe em `validation/backend/`, mas está em modo
  stub/mock e ainda não está integrado ao schema/camada oficial de banco.

**Critérios concluidos tecnicamente:**

- listar questões pendentes a partir de API real;
- aprovar/reprovar questão persistindo no banco;
- preencher `validated_by`, `validated_at`, `validation_status`,
  `rejection_reason` e `validation_logs` por rota Express real;
- integrar via API Express oficial;
- remover mock como caminho padrao do painel.

**Pendencias residuais:**

- testar manualmente a tela completa.
- investigar timeout da suite Jest completa.

---

### Status tecnico atualizado - 2026-06-18

- [x] Fluxo oficial definido como Express + PGlite.
- [x] Schema oficial de `questions` com `validation_status`, `rejection_reason` e `validation_logs`.
- [x] Constraint de status limitada a `PENDING`, `APPROVED` e `REJECTED`.
- [x] Funcoes `getPendingQuestions()` e `validateQuestion()` implementadas e exportadas em `backend/database/db.js`.
- [x] Rota `GET /api/questions/pending` implementada.
- [x] Rota `POST /api/questions/:id/validate` implementada.
- [x] `validation/js/validationAPI.js` usa API real com `USE_MOCK_DATA = false`.
- [x] Rejeicoes exigem justificativa.
- [x] Sprint 1 de seguranca aplicada: Helmet, rate limiting e middleware global de erro `{ error, status }`.
- [x] Testes `__tests__/api.validation.test.js` cobrindo listar, aprovar, rejeitar e payload invalido.
- [ ] Teste manual completo do painel com API + PGlite seedado.
- [ ] Investigacao do timeout da suite Jest completa.

### Task 5.1: Schema de Validação no PGLite

**Prioridade:** Alta | **Estimativa:** 2 horas

Criar tabelas adicionais para validação (se necessário).

**Checklist:**

- [x] Analisar schema.sql existente
- [x] Adicionar colunas de controle em `questions`:
  - [x] `validation_status`
  - [x] `rejection_reason`
  - [x] `validation_logs`
- [x] Adicionar constraint para status `PENDING`, `APPROVED` e `REJECTED`
- [x] Adicionar indice para `validation_status`
- [ ] Avaliar se ainda sera necessaria tabela separada:
  - [ ] `validation_logs` (auditoria normalizada)
  - [ ] `validator_assignments` (quem valida o quê)
- [ ] Migração SQL para dados existentes
- [x] Testar schema com teste focado do banco

---

### Task 5.2: Conectar Python ao PGLite

**Prioridade:** Alta | **Estimativa:** 4 horas

Implementar conexão Python/asyncpg.

**Checklist:**

- [ ] Instalar asyncpg em requirements.txt
- [ ] Criar `backend/database/async_client.py`
- [ ] Pool de conexões
- [ ] Função `connect()` para conectar ao PGLite
- [ ] Tratamento de erros
- [ ] Logging de queries
- [ ] Testar conexão

---

### Task 5.3: Endpoints de Validação em Express

**Prioridade:** Alta | **Estimativa:** 4 horas

Implementar endpoints de validação no backend oficial Express.

**Checklist:**

- [x] `GET /api/questions/pending` - Lista para validar
- [x] `POST /api/questions/:id/validate` - Validar questão
  - [x] Recebe: `status`, `feedback`, `correctionNeeded`
  - [x] Valida estritamente `APPROVED` ou `REJECTED`
  - [x] Exige justificativa ao rejeitar
  - [x] Atualiza `validation_status`, `rejection_reason`, `validated_by`,
        `validated_at` e `validation_logs`
- [ ] `GET /api/validators/me/stats` - Stats do validador, backlog
- [ ] `GET /api/validations/:id` - Histórico, backlog
- [x] Testar endpoints principais

---

### Task 5.4: Testes de Validação

**Prioridade:** Alta | **Estimativa:** 3 horas

Testes E2E do fluxo de validação.

**Checklist:**

- [x] `__tests__/api.validation.test.js`
- [x] Teste: Listar questões pendentes
- [x] Teste: Aprovar questão
- [x] Teste: Rejeitar com feedback
- [x] Teste: Payload inválido
- [ ] Teste: Histórico de validação, backlog
- [x] Todos os testes do arquivo passando

---

## 🎯 ÉPICO 6: Trilha Visual Interativa (PRIORIDADE 5)

**Status:** ⏳ Não iniciado  
**Estimativa:** 2 semanas  
**Dependência:** Épicos 2-5

---

### Task 6.1: Componente SVG de Trilha

**Prioridade:** Alta | **Estimativa:** 8 horas

Trilha visual com SVG.

**Checklist:**

- [ ] `js/gamificacao/trailSVG.js`
- [ ] `css/trail.css`
- [ ] Nós para módulos
- [ ] Linhas conectando
- [ ] Estados: bloqueado, desbloqueado, completo
- [ ] Responsivo
- [ ] Clique nos nós

---

### Task 6.2: Animações de Desbloqueio

**Prioridade:** Média | **Estimativa:** 4 horas

Animações ao desbloquear módulo.

**Checklist:**

- [ ] `css/trail-animations.css`
- [ ] `js/gamificacao/trailAnimations.js`
- [ ] Linha iluminando
- [ ] Nó pulsando
- [ ] Confete (opcional)
- [ ] Som (opcional)
- [ ] 60fps

---

### Task 6.3: Boss Battle (Simulado Final)

**Prioridade:** Baixa | **Estimativa:** 6 horas

Modo especial para último módulo.

**Checklist:**

- [ ] `js/modes/bossBattle.js`
- [ ] `css/boss-battle.css`
- [ ] 65 questões
- [ ] Timer 90 minutos
- [ ] Sem feedback imediato
- [ ] Visual diferenciado

---

## 🎯 ÉPICO 7: Análise Inteligente de Gaps (PRIORIDADE 6)

**Status:** ⏳ Não iniciado  
**Estimativa:** 1 semana  
**Dependência:** Épicos 2-5

---

### Task 7.1: Query SQL para Gaps

**Prioridade:** Alta | **Estimativa:** 4 horas

Query agregada para análise de gaps.

**Checklist:**

- [ ] `backend/analytics/gaps_analyzer.py`
- [ ] Query SQL agregada
- [ ] Taxa de erro por domínio
- [ ] 3 domínios com maior taxa
- [ ] JSON estruturado

---

### Task 7.2: Componente "O Que Estudar Agora"

**Prioridade:** Média | **Estimativa:** 3 horas

Card na sidebar mostrando domínios fracos.

**Checklist:**

- [ ] `js/recommendations/studyNow.js`
- [ ] `css/recommendations.css`
- [ ] Buscar API
- [ ] Card com 3 domínios
- [ ] Links AWS docs
- [ ] Atualizar após quiz

---

## 🎯 ÉPICO 8: Exportação PDF (PRIORIDADE 7)

**Status:** ⏳ Não iniciado  
**Estimativa:** 1 semana

---

### Task 8.1: Integrar jsPDF + html2canvas

**Prioridade:** Alta | **Estimativa:** 3 horas

**Checklist:**

- [ ] Verificar instalação
- [ ] `js/export/pdfGenerator.js`
- [ ] Função básica
- [ ] Testar

---

### Task 8.2: Gráficos no PDF

**Prioridade:** Alta | **Estimativa:** 6 horas

**Checklist:**

- [ ] Capturar canvas
- [ ] Converter imagem
- [ ] Adicionar ao PDF
- [ ] Ajustar tamanho
- [ ] Qualidade

---

### Task 8.3: Template Profissional

**Prioridade:** Média | **Estimativa:** 4 horas

**Checklist:**

- [ ] `js/export/pdfTemplate.js`
- [ ] Cabeçalho com logo
- [ ] Performance
- [ ] Gráfico radar
- [ ] Análise por domínio
- [ ] Cores AWS

---

### Task 8.4: Filtro "Apenas Erros"

**Prioridade:** Baixa | **Estimativa:** 2 horas

**Checklist:**

- [ ] Checkbox na UI
- [ ] Filtrar erros
- [ ] PDF só erros
- [ ] Explicações

---

## 🎯 ÉPICO 9: Testes com Usuários (PRIORIDADE 8)

**Status:** ⏳ Não iniciado  
**Estimativa:** 1 semana  
**Dependência:** Épicos 2-7

---

### Task 9.1: Staging

**Prioridade:** Alta | **Estimativa:** 3 horas

Servidor de staging.

**Checklist:**

- [ ] Plataforma (Vercel/Netlify)
- [ ] Deploy automático
- [ ] Banco de testes
- [ ] URL de acesso

---

### Task 9.2: Formulário Feedback

**Prioridade:** Média | **Estimativa:** 2 horas

**Checklist:**

- [ ] `feedback.html`
- [ ] `js/feedback/feedbackForm.js`
- [ ] Avaliação 1-5
- [ ] Campos sugestão
- [ ] Salvar dados

---

### Task 9.3: Recrutar Testadores

**Prioridade:** Média | **Estimativa:** 2 horas

**Checklist:**

- [ ] Lista de 10-15
- [ ] Enviar convites
- [ ] Link staging
- [ ] Instruções
- [ ] Prazo 3 dias

---

### Task 9.4: Analisar Feedback

**Prioridade:** Alta | **Estimativa:** 3 horas

**Checklist:**

- [ ] Compilar feedbacks
- [ ] Categorizar
- [ ] Priorizar
- [ ] Documento análise

---

### Task 9.5: Bugs Críticos

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 8 horas

**Checklist:**

- [ ] Listar bugs
- [ ] Dividir equipe
- [ ] Corrigir
- [ ] Testar
- [ ] Deploy

---

### Task 9.6: Melhorias UX

**Prioridade:** Média | **Estimativa:** 4 horas

**Checklist:**

- [ ] Listar melhorias
- [ ] Priorizar simples
- [ ] Implementar
- [ ] Testar
- [ ] Deploy

---

### Task 9.7: Apresentação Cliente

**Prioridade:** Alta | **Estimativa:** 4 horas

**Checklist:**

- [ ] Slides PowerPoint
- [ ] Demo ao vivo
- [ ] Resultados
- [ ] Próximos passos
- [ ] Ensaiar 2x

---

## 📊 Resumo (REFORMULADO)

| Épico | Tasks | Est. | Prio | Status |
|-------|-------|------|------|--------|
| 1. PostgreSQL Schema | 2 | 1s | 🔥 | ✅ 100% |
| **2. Database Layer** | **6** | **1.5s** | **🔥** | **✅ 100%** |
| **3. Express API** | **7** | **1.5s** | **🔥** | **🟡 Parcial / próximo** |
| **4. Socket Server** | **2** | **0.5s** | **Alta** | **⏳ Pendente** |
| **5. Validação** | **4** | **1s** | **Alta** | **✅ Concluído tecnicamente** |
| 6. Trilha Visual | 3 | 2s | Alta | ⏳ |
| 7. Gaps Analysis | 2 | 1s | Alta | ⏳ |
| 8. PDF Export | 4 | 1s | Alta | ⏳ |
| 9. User Testing | 7 | 1s | Alta | ⏳ |
| **TOTAL** | **37** | **10s** | - | - |

---

## 🚀 Roadmap (VERSÃO 2.0 - PGLITE COMPLETO)

**Sprint 1 (1.5s):** Épico 2 - Database Layer ✅ concluído
**Sprint 2 (1.5s):** Épico 3 - Express API 🟡 próximo passo
**Sprint 3 (0.5s):** Épicos 4 - Socket Server  
**Sprint 4 (1s):** Épicos 5 - Validação  
**Sprint 5 (2s):** Épicos 6 - Trilha Visual  
**Sprint 6 (1s):** Épicos 7, 8 - Analytics & PDF  
**Sprint 7 (1s):** Épicos 9 - User Testing  

---

## 🎯 Fluxo de Dependências

```
Épico 1: Schema ✅
    ↓
Épico 2: db.js (Database Layer) ✅
    ↓
Épico 3: Express API 🟡 próximo + Épico 4: Socket Server ⏳
    ↓
Épico 5: Validação
    ↓
Épico 6: Trilha Visual
    ↓
Épico 7: Gap Analysis + Épico 8: PDF Export
    ↓
Épico 9: User Testing & Deploy
```

---

## 📝 Próximas Ações

1. ✅ **Lido:** Este documento
2. ✅ **Concluído:** Épico 2 - Camada de banco PGlite (`db.js`)
3. ⏳ **Antes de avançar:** Fazer push e validar o remoto/CI
4. ⏳ **Próximo:** Iniciar **Épico 3 - API REST com Express**
5. 🟡 **Validação:** decidir se `validation/valid.html` será integrada à API Express oficial ou ao backend FastAPI separado
6. ⏳ **Depois:** Épico 4 - Socket Server atualizado

---

**Documento reformulado:** 2026-06-03  
**Última atualização de status:** 2026-06-07
**Versão:** 2.2 (Épico 2 concluído - Database Layer pronto)
**Status:** Épico 2 concluído. Camada de banco pronta para ser consumida pela API. Próximo passo recomendado: Épico 3 - API REST com Express, após push e validação no remoto.
