# 📋 Épicos e Tasks - MVP Simulador AWS (v2.0)

**Data:** 2026-06-02  
**Versão:** 2.0 (Reformulado com PGLite)  
**Status:** Pronto para execução

---

## 📊 Status Atual

### ✅ Épico 1: PostgreSQL (PGLite) - 50%
- ✅ Task 1.1: Schema PostgreSQL - **CONCLUÍDA**
- ✅ Task 1.2: Script Migração - **CONCLUÍDA**
- ⏳ Task 1.3: API FastAPI - AGUARDANDO INTEGRAÇÃO
- ⏳ Task 1.4: Validação Questões - EM PROGRESSO (interface excelente, backend bloqueado)

**Bloqueador:** Integração PGLite com FastAPI

---

## 🎯 ÉPICO 2: Camada de Banco de Dados PGLite (NOVO - PRIORIDADE 1)

**Status:** 🔥 CRÍTICA  
**Estimativa:** 3 dias  
**Objetivo:** Implementar camada de abstração do banco de dados

---

### Task 2.1: Implementar db.js (Inicialização e Conexão)

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 4 horas

Criar arquivo `backend/database/db.js` com funções de inicialização e gerenciamento do PGLite.

**Checklist:**
- [ ] Criar `backend/database/db.js`
- [ ] Função `initializeDatabase(config)` com:
  - [ ] Criar instância PGLite
  - [ ] Carregar schema.sql
  - [ ] Criar tabelas
  - [ ] Criar índices
  - [ ] Retornar instância db
- [ ] Função `closeDatabase()` para encerrar conexão
- [ ] Função `getDatabase()` para acessar instância global
- [ ] Tratamento de erros com try/catch
- [ ] Logging em cada etapa
- [ ] Suportar `dataDir` customizável
- [ ] Exportar como módulo ES6

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

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 6 horas

Adicionar métodos CRUD para questões em `db.js`.

**Checklist:**
- [ ] Função `getQuestions(certification, domain, difficulty)`
- [ ] Função `getQuestionById(id)`
- [ ] Função `insertQuestion(questionData)`
- [ ] Função `updateQuestion(id, questionData)`
- [ ] Função `deleteQuestion(id)`
- [ ] Função `searchQuestions(query, limit)`
- [ ] Função `getQuestionsByDomain(certification, domain)`
- [ ] Implementar paginação em queries
- [ ] Adicionar índices de performance
- [ ] Tratamento de erros específicos
- [ ] Logging de queries (modo debug)
- [ ] Validação de entrada de dados

---

### Task 2.3: Implementar CRUD de Histórico Quiz

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 4 horas

Adicionar métodos para histórico de quizzes e respostas.

**Checklist:**
- [ ] Função `createQuizHistory(userId, certification, answers)`
- [ ] Função `getQuizHistory(userId, limit, offset)`
- [ ] Função `getQuizById(quizId)`
- [ ] Função `recordAnswer(quizId, questionId, userAnswer, isCorrect, timeSecs)`
- [ ] Função `getAnswersByQuiz(quizId)`
- [ ] Função `calculateStats(userId)` - retorna agregações
- [ ] Função `getWeakDomains(userId, threshold)` - domínios com < threshold%
- [ ] Transações SQL para garantir integridade
- [ ] Índices de performance

---

### Task 2.4: Implementar CRUD de Usuários e Gamificação

**Prioridade:** Alta | **Estimativa:** 4 horas

Adicionar métodos para usuários e gamificação.

**Checklist:**
- [ ] Função `createUser(anonymousName)`
- [ ] Função `getUserById(userId)`
- [ ] Função `getUserByName(anonymousName)`
- [ ] Função `updateUser(userId, data)`
- [ ] Função `getGamification(userId)`
- [ ] Função `updateGamification(userId, data)` - XP, badges, streak
- [ ] Função `getLeaderboard(limit)` - top 100 usuários
- [ ] Função `getUserStats(userId)` - agregações completas
- [ ] Validações de unicidade

---

### Task 2.5: Testes Unitários do db.js

**Prioridade:** Alta | **Estimativa:** 5 horas

Criar testes para todas as funções do db.js.

**Checklist:**
- [ ] Criar `tests/unit/database.test.js`
- [ ] Setup/teardown com banco de testes
- [ ] Testes CRUD básicos
- [ ] Testes de paginação
- [ ] Testes de erro (validação)
- [ ] Testes de índices (performance)
- [ ] Testes de transações
- [ ] Coverage > 90%
- [ ] Todos os testes passando ✅

---

### Task 2.6: Documentação do db.js

**Prioridade:** Média | **Estimativa:** 2 horas

Documentar camada de banco de dados.

**Checklist:**
- [ ] Criar `docs/DATABASE.md` com:
  - [ ] Diagrama ER
  - [ ] Descrição de cada tabela
  - [ ] Documentação de cada função
  - [ ] Exemplos de uso
  - [ ] Troubleshooting
- [ ] Adicionar JSDoc em cada função
- [ ] Exemplos com await/async

---

## 🎯 ÉPICO 3: API REST com Express (NOVO - PRIORIDADE 2)

**Status:** ⏳ Não iniciado  
**Estimativa:** 3 dias  
**Objetivo:** Endpoints HTTP para frontend consumir

**Dependência:** Épico 2 (db.js completo)

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
- [ ] Rate limiting por IP
- [ ] Validação de tipos (schema)
- [ ] Error handler customizado
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

**Status:** ⏳ Aguardando Épicos 2-4  
**Estimativa:** 3 dias  
**Objetivo:** Sistema de validação 100% funcional

**Dependência:** Épicos 2, 3, 4

---

### Task 5.1: Schema de Validação no PGLite

**Prioridade:** Alta | **Estimativa:** 2 horas

Criar tabelas adicionais para validação (se necessário).

**Checklist:**
- [ ] Analisar schema.sql existente
- [ ] Adicionar tabelas se faltando:
  - [ ] `validation_logs` (auditoria)
  - [ ] `validator_assignments` (quem valida o quê)
- [ ] Migração SQL para dados existentes
- [ ] Testar schema

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

### Task 5.3: Endpoints de Validação em FastAPI

**Prioridade:** Alta | **Estimativa:** 4 horas

Implementar endpoints de validação.

**Checklist:**
- [ ] `GET /api/questions/pending` - Lista para validar
- [ ] `POST /api/questions/:id/validate` - Validar questão
  - [ ] Recebe: `status`, `feedback`, `correctionNeeded`
  - [ ] Salva em validation_logs
- [ ] `GET /api/validators/me/stats` - Stats do validador
- [ ] `GET /api/validations/:id` - Histórico
- [ ] Testar endpoints

---

### Task 5.4: Testes de Validação

**Prioridade:** Alta | **Estimativa:** 3 horas

Testes E2E do fluxo de validação.

**Checklist:**
- [ ] `tests/integration/validation.test.js`
- [ ] Teste: Listar questões pendentes
- [ ] Teste: Aprovar questão
- [ ] Teste: Rejeitar com feedback
- [ ] Teste: Histórico de validação
- [ ] Todos passando ✅

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
| **2. Database Layer** | **6** | **1.5s** | **🔥** | **🆕** |
| **3. Express API** | **7** | **1.5s** | **🔥** | **🆕** |
| **4. Socket Server** | **2** | **0.5s** | **Alta** | **🆕** |
| **5. Validação** | **4** | **1s** | **Alta** | **🆕** |
| 6. Trilha Visual | 3 | 2s | Alta | ⏳ |
| 7. Gaps Analysis | 2 | 1s | Alta | ⏳ |
| 8. PDF Export | 4 | 1s | Alta | ⏳ |
| 9. User Testing | 7 | 1s | Alta | ⏳ |
| **TOTAL** | **37** | **10s** | - | - |

---

## 🚀 Roadmap (VERSÃO 2.0 - PGLITE COMPLETO)

**Sprint 1 (1.5s):** Épicos 2 - Database Layer  
**Sprint 2 (1.5s):** Épicos 3 - Express API  
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
Épico 2: db.js (Database Layer)
    ↓
Épico 3: Express API + Épico 4: Socket Server
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
2. ⏳ **Próximo:** Começar com **Épico 2 (Task 2.1)** - Implementar db.js
3. ⏳ **Em Paralelo:** Instalar Express em package.json
4. ⏳ **Depois:** Épico 3 - Criar endpoints REST

---

**Documento reformulado:** 2026-06-03  
**Versão:** 2.1 (PGLite Completo - Tasks em Formato Detalhado)  
**Status:** Pronto para implementação começar no Épico 2!
