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

## 🎯 ÉPICO 3: Integração PGLite com Backend (NOVO - PRIORIDADE 1)

**Status:** 🔥 CRÍTICA  
**Estimativa:** 1 semana  
**Objetivo:** Sistema de validação 100% funcional

---

### Task 3.0.1: Schema de Validação no PGLite

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 3 horas

Criar tabelas para validação no PGLite.

**Checklist:**
- [ ] `backend/database/migrations/002_validation_schema.sql`
- [ ] Tabelas: questions, validations, validation_logs
- [ ] Índices para performance
- [ ] Executar schema via db.js
- [ ] Verificar tabelas criadas

---

### Task 3.0.2: Conectar database.py ao PGLite

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 4 horas

Implementar conexão asyncpg.

**Checklist:**
- [ ] Instalar asyncpg (requirements.txt)
- [ ] `connect()` em ValidationDatabase
- [ ] Pool de conexões
- [ ] Tratamento de erros
- [ ] Testar conexão
- [ ] Logging

**Nota:** Manter `npm run db:start` rodando

---

### Task 3.0.3: Implementar Métodos CRUD

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 6 horas

Implementar queries reais em database.py.

**Checklist:**
- [ ] `get_pending_questions()` - SELECT
- [ ] `record_validation()` - INSERT + UPDATE
- [ ] `get_validator_stats()` - GROUP BY
- [ ] `get_validation_history()` - JOINs
- [ ] `export_validation_report()` - Agregações
- [ ] Transações
- [ ] Logging de queries

---

### Task 3.0.4: Conectar FastAPI ao Database

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 4 horas

Substituir TODO em main.py por chamadas reais.

**Checklist:**
- [ ] Importar ValidationDatabase
- [ ] Inicializar no startup
- [ ] GET /api/questions/pending
- [ ] POST /api/questions/{id}/validate
- [ ] GET /api/validators/me/stats
- [ ] GET /api/validations/{id}
- [ ] Error handling
- [ ] Testar endpoints

---

### Task 3.0.5: Popular Dados de Teste

**Prioridade:** Alta | **Estimativa:** 2 horas

Script para popular PGLite com dados de teste.

**Checklist:**
- [ ] `backend/database/seed-validation-data.js`
- [ ] Inserir 10-20 questões
- [ ] Domínios: Cloud, Security, etc
- [ ] Validar dados

---

### Task 3.0.6: Testes de Integração

**Prioridade:** Alta | **Estimativa:** 4 horas

Testes automatizados para integração.

**Checklist:**
- [ ] `tests/test_validation_integration.py`
- [ ] Teste: Listar questões
- [ ] Teste: Validar (aprovar/rejeitar)
- [ ] Teste: Histórico
- [ ] Teste: Estatísticas
- [ ] Todos passando

---

### Task 3.0.7: Documentação

**Prioridade:** Média | **Estimativa:** 2 horas

Documentar integração.

**Checklist:**
- [ ] Atualizar VALIDATION_INTEGRATION_GUIDE.md
- [ ] Criar VALIDATION_TROUBLESHOOTING.md
- [ ] Diagrama de fluxo
- [ ] Exemplos de uso

---

## 🎯 ÉPICO 4: Trilha Visual Interativa (PRIORIDADE 2)

**Status:** ⏳ Não iniciado  
**Estimativa:** 2 semanas  
**Dependência:** Épico 3

---

### Task 4.1: Componente SVG de Trilha

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

### Task 4.2: Animações de Desbloqueio

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

### Task 4.3: Boss Battle (Simulado Final)

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

## 🎯 ÉPICO 5: Análise Inteligente de Gaps (PRIORIDADE 3)

**Status:** ⏳ Não iniciado  
**Estimativa:** 1 semana  
**Dependência:** Épico 3

---

### Task 5.1: Query SQL para Gaps

**Prioridade:** Alta | **Estimativa:** 4 horas

Query agregada para análise de gaps.

**Checklist:**
- [ ] `backend/analytics/gaps_analyzer.py`
- [ ] Query SQL agregada
- [ ] Taxa de erro por domínio
- [ ] 3 domínios com maior taxa
- [ ] JSON estruturado

---

### Task 5.2: Componente "O Que Estudar Agora"

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

## 🎯 ÉPICO 6: Exportação PDF (PRIORIDADE 4)

**Status:** ⏳ Não iniciado  
**Estimativa:** 1 semana

---

### Task 6.1: Integrar jsPDF + html2canvas

**Prioridade:** Alta | **Estimativa:** 3 horas

**Checklist:**
- [ ] Verificar instalação
- [ ] `js/export/pdfGenerator.js`
- [ ] Função básica
- [ ] Testar

---

### Task 6.2: Gráficos no PDF

**Prioridade:** Alta | **Estimativa:** 6 horas

**Checklist:**
- [ ] Capturar canvas
- [ ] Converter imagem
- [ ] Adicionar ao PDF
- [ ] Ajustar tamanho
- [ ] Qualidade

---

### Task 6.3: Template Profissional

**Prioridade:** Média | **Estimativa:** 4 horas

**Checklist:**
- [ ] `js/export/pdfTemplate.js`
- [ ] Cabeçalho com logo
- [ ] Performance
- [ ] Gráfico radar
- [ ] Análise por domínio
- [ ] Cores AWS

---

### Task 6.4: Filtro "Apenas Erros"

**Prioridade:** Baixa | **Estimativa:** 2 horas

**Checklist:**
- [ ] Checkbox na UI
- [ ] Filtrar erros
- [ ] PDF só erros
- [ ] Explicações

---

## 🎯 ÉPICO 7: Testes com Usuários (PRIORIDADE 5)

**Status:** ⏳ Não iniciado  
**Estimativa:** 1 semana  
**Dependência:** Épicos 3, 4, 5

---

### Task 7.1: Staging

**Prioridade:** Alta | **Estimativa:** 3 horas

Servidor de staging.

**Checklist:**
- [ ] Plataforma (Vercel/Netlify)
- [ ] Deploy automático
- [ ] Banco de testes
- [ ] URL de acesso

---

### Task 7.2: Formulário Feedback

**Prioridade:** Média | **Estimativa:** 2 horas

**Checklist:**
- [ ] `feedback.html`
- [ ] `js/feedback/feedbackForm.js`
- [ ] Avaliação 1-5
- [ ] Campos sugestão
- [ ] Salvar dados

---

### Task 7.3: Recrutar Testadores

**Prioridade:** Média | **Estimativa:** 2 horas

**Checklist:**
- [ ] Lista de 10-15
- [ ] Enviar convites
- [ ] Link staging
- [ ] Instruções
- [ ] Prazo 3 dias

---

### Task 7.4: Analisar Feedback

**Prioridade:** Alta | **Estimativa:** 3 horas

**Checklist:**
- [ ] Compilar feedbacks
- [ ] Categorizar
- [ ] Priorizar
- [ ] Documento análise

---

### Task 7.5: Bugs Críticos

**Prioridade:** 🔥 CRÍTICA | **Estimativa:** 8 horas

**Checklist:**
- [ ] Listar bugs
- [ ] Dividir equipe
- [ ] Corrigir
- [ ] Testar
- [ ] Deploy

---

### Task 7.6: Melhorias UX

**Prioridade:** Média | **Estimativa:** 4 horas

**Checklist:**
- [ ] Listar melhorias
- [ ] Priorizar simples
- [ ] Implementar
- [ ] Testar
- [ ] Deploy

---

### Task 7.7: Apresentação Cliente

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
| 1. PostgreSQL | 4 | 2s | 🔥 | 50% |
| **3. Integração** | **7** | **1s** | **🔥** | **🆕** |
| 4. Trilha Visual | 3 | 2s | Alta | ⏳ |
| 5. Gaps | 2 | 1s | Alta | ⏳ |
| 6. PDF | 4 | 1s | Alta | ⏳ |
| 7. Testes | 7 | 1s | Alta | ⏳ |
| **TOTAL** | **27** | **8s** | - | - |

---

## 🚀 Roadmap (REFORMULADO)

**Sprint 1 (1s):** Épico 3 - Integração PGLite  
**Sprint 2 (1s):** Épico 4 - Trilha Visual  
**Sprint 3 (2s):** Épico 4 finalize + Épico 5, 6  
**Sprint 4 (1s):** Épico 6 finalize + Épico 7  
**Sprint 5 (1s):** Épico 7 finalize + Deploy  

---

**Documento reformulado:** 2026-06-02  
**Versão:** 2.0  
**Ação:** Começar Épico 3 HOJE!
