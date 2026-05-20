# 🎯 MVP Roadmap - Insights de Especialistas e Estratégia de Produto

**Data:** 2026-05-20  
**Versão:** 1.0  
**Objetivo:** Redefinir escopo do projeto para um MVP focado, validado por especialistas e pronto para demonstração

---

## 📋 Índice

1. [Insights dos Especialistas](#insights-dos-especialistas)
2. [Decisões Estratégicas](#decisões-estratégicas)
3. [Escopo do MVP](#escopo-do-mvp)
4. [Épicos e Tarefas](#épicos-e-tarefas)
5. [Cronograma de Execução](#cronograma-de-execução)
6. [Gestão de Tarefas](#gestão-de-tarefas)

---

## 💡 Insights dos Especialistas

### Insight 1: May - Validação de Conteúdo e Qualidade

**Problemas Identificados:**
- Risco de estudar conteúdo desatualizado ou fora do escopo da prova
- Falta de validação por quem já passou na certificação
- Questões podem não refletir o formato real da AWS

**Soluções Propostas:**
1. ✅ **Validador de Conteúdo**: Integrar especialistas que já tiraram a certificação
2. ✅ **Treinamento AWS SME**: Seguir o guia oficial de como questões são criadas
   - Link: https://skillbuilder.aws/learn/ENFQ4QSNTH/aws-certification-subject-matter-expert-training
3. ✅ **Banco de Questões Reais**: Buscar questões que já caíram em provas passadas
4. ✅ **Guias Oficiais**: Sempre consultar os exam guides atualizados da AWS

**Impacto no MVP:**
- Adicionar sistema de validação de questões por especialistas
- Criar processo de curadoria de conteúdo
- Integrar links para guias oficiais em cada domínio

---

### Insight 2: Boni - Redução de Escopo e Foco

**Problemas Identificados:**
- Escopo muito amplo (4 certificações) dificulta manutenção
- Diferença grande entre níveis (Practitioner vs Associate vs Professional)
- Falta de cases práticos e explicações didáticas

**Soluções Propostas:**
1. ✅ **Foco em 1-2 Certificações**: Começar apenas com Cloud Practitioner
2. ✅ **Integração MCP**: Usar Model Context Protocol para cases práticos
3. ✅ **Explicações Didáticas**: Quando errar, mostrar case de estudo prático
4. ✅ **Banco de Dados Externo**: Usar PostgreSQL local para desacoplar dados

**Impacto no MVP:**
- Reduzir para CLF-C02 (Cloud Practitioner) apenas
- Criar sistema de "Cases Práticos" para cada erro
- Migrar de JSON para PostgreSQL

---

### Insight 3: Gestão de Tarefas e Paralelização

**Problemas Identificados:**
- Tarefas muito grandes e difíceis de paralelizar
- Falta de clareza sobre dependências
- Risco de conflitos ao trabalhar em dupla na mesma task

**Soluções Propostas:**
1. ✅ **Tarefas Individuais**: Priorizar tasks que uma pessoa consegue fazer sozinha
2. ✅ **Épicos Claros**: Criar estrutura de épico → tarefas filhas
3. ✅ **Discussão Prévia**: Alinhar fluxo antes de começar a implementar
4. ✅ **Gestão Visual**: Usar ferramenta de gestão (GitHub Projects, Trello, Jira)

**Impacto no MVP:**
- Quebrar tarefas grandes em subtarefas de 2-4 horas
- Criar épicos com contexto macro
- Definir critérios de aceite claros

---

## 🎯 Decisões Estratégicas

### 1. Redução de Escopo de Certificações

**Decisão:** Focar apenas em **AWS Cloud Practitioner (CLF-C02)** no MVP

**Justificativa:**
- É a certificação de entrada (maior público)
- Conteúdo mais estável e bem documentado
- Permite validar o modelo antes de escalar
- Reduz complexidade de manutenção em 75%

**Roadmap Futuro:**
- **Fase 1 (MVP):** CLF-C02 apenas
- **Fase 2:** Adicionar SAA-C03 (Solutions Architect)
- **Fase 3:** Adicionar DVA-C02 e AIF-C01

---

### 2. Migração de Dados: JSON → PostgreSQL

**Decisão:** Migrar de arquivos JSON para PostgreSQL local

**Justificativa:**
- Facilita curadoria e validação de questões
- Permite queries complexas para análise de gaps
- Desacopla dados da aplicação
- Facilita contribuições externas

**Estrutura de Tabelas:**
```sql
-- Tabela de questões
CREATE TABLE questions (
    id UUID PRIMARY KEY,
    certification VARCHAR(20) NOT NULL,
    domain VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer JSONB NOT NULL,
    explanation TEXT NOT NULL,
    reference_url TEXT,
    validated_by VARCHAR(100),
    validated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de usuários (anônimos)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    anonymous_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de histórico de quizzes
CREATE TABLE quiz_history (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    certification VARCHAR(20) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    domain_scores JSONB NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de respostas individuais
CREATE TABLE answers (
    id UUID PRIMARY KEY,
    quiz_id UUID REFERENCES quiz_history(id),
    question_id UUID REFERENCES questions(id),
    user_answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3. Sistema de Cases Práticos (MCP Integration)

**Decisão:** Integrar Model Context Protocol para gerar explicações didáticas

**Justificativa:**
- Transforma erro em oportunidade de aprendizado prático
- Reduz carga teórica e aumenta retenção
- Diferencial competitivo forte

**Fluxo:**
```
Usuário erra questão sobre API Gateway
    ↓
Sistema identifica o serviço AWS mencionado
    ↓
MCP gera case prático:
    "Imagine que você precisa criar uma API REST para um app mobile.
     Você tem um Lambda que processa pedidos. Como conectar?
     
     Solução: API Gateway → Lambda
     
     Exemplo prático:
     1. Criar API REST no API Gateway
     2. Criar recurso /pedidos
     3. Criar método POST
     4. Integrar com Lambda
     5. Deploy em stage 'prod'
     
     Comando AWS CLI:
     aws apigateway create-rest-api --name 'MeuApp'"
```

---

## 🚀 Escopo do MVP

### Funcionalidades Mantidas (Já Existem)

✅ **Core do Simulador**
- Motor de quiz com questões de múltipla escolha
- Timer e modo exame
- Feedback imediato com explicações
- Histórico de performance

✅ **Gamificação Básica**
- Sistema de badges
- Trilha de progresso (lista simples)
- Leaderboard mockado

✅ **Estudo Ativo**
- Flashcards interativos
- Modo revisão de erros

✅ **Analytics Básico**
- Gráfico radar de domínios
- Dashboard de progresso

---

### Funcionalidades Novas (MVP)

#### 🎯 Épico 1: Validação de Conteúdo

**Objetivo:** Garantir qualidade e atualização das questões

**Tarefas:**
1. [ ] Criar sistema de validação de questões
2. [ ] Adicionar campo "validado_por" no banco
3. [ ] Criar interface de curadoria para especialistas
4. [ ] Integrar links para exam guides oficiais
5. [ ] Adicionar badge "Validado por Especialista"

**Critérios de Aceite:**
- Questões têm status de validação visível
- Especialistas conseguem aprovar/reprovar questões
- Links para documentação oficial funcionam

**Estimativa:** 2 semanas

---

#### 🎯 Épico 2: Cases Práticos (MCP)

**Objetivo:** Transformar erros em aprendizado prático

**Tarefas:**
1. [ ] Configurar MCP no projeto
2. [ ] Criar prompt template para cases práticos
3. [ ] Implementar detecção de serviços AWS nas questões
4. [ ] Criar componente UI para exibir cases
5. [ ] Adicionar exemplos de AWS CLI

**Critérios de Aceite:**
- Ao errar, usuário vê case prático relacionado
- Case inclui exemplo de código/CLI
- Funciona offline (cache de cases comuns)

**Estimativa:** 2 semanas

---

#### 🎯 Épico 3: Migração PostgreSQL

**Objetivo:** Desacoplar dados e facilitar curadoria

**Tarefas:**
1. [ ] Criar schema PostgreSQL
2. [ ] Criar script de migração JSON → PostgreSQL
3. [ ] Implementar API FastAPI para CRUD de questões
4. [ ] Atualizar frontend para consumir API
5. [ ] Criar backup automático

**Critérios de Aceite:**
- Todas as questões migradas sem perda de dados
- API responde em < 200ms
- Frontend funciona normalmente
- Backup diário configurado

**Estimativa:** 3 semanas

---

#### 🎯 Épico 4: Análise de Gaps Inteligente

**Objetivo:** Sugerir o que estudar baseado em erros

**Tarefas:**
1. [ ] Criar query SQL para análise de erros por domínio
2. [ ] Implementar algoritmo de recomendação
3. [ ] Criar componente "O que estudar agora"
4. [ ] Adicionar links para recursos de estudo
5. [ ] Implementar notificações de recomendação

**Critérios de Aceite:**
- Sistema identifica 3 domínios mais fracos
- Recomenda recursos específicos (docs, vídeos)
- Atualiza após cada quiz

**Estimativa:** 1 semana

---

#### 🎯 Épico 5: Trilha Visual Interativa

**Objetivo:** Gamificar a jornada de estudo

**Tarefas:**
1. [ ] Criar componente SVG de trilha
2. [ ] Implementar animações de desbloqueio
3. [ ] Adicionar tooltips com progresso
4. [ ] Criar "boss battle" (simulado final)
5. [ ] Adicionar efeitos sonoros

**Critérios de Aceite:**
- Trilha renderiza em desktop e mobile
- Animações fluidas (60fps)
- Acessível via teclado
- Boss battle tem mecânica diferenciada

**Estimativa:** 2 semanas

---

#### 🎯 Épico 6: Exportação Profissional

**Objetivo:** Gerar relatórios de estudo em PDF

**Tarefas:**
1. [ ] Integrar jsPDF + html2canvas
2. [ ] Criar template de PDF com branding
3. [ ] Incluir gráficos no PDF
4. [ ] Adicionar filtro "apenas erros"
5. [ ] Implementar preview antes de baixar

**Critérios de Aceite:**
- PDF gerado com qualidade de impressão
- Gráficos renderizados corretamente
- Preview funcional
- Tempo de geração < 5 segundos

**Estimativa:** 1 semana

---

## 📅 Cronograma de Execução

### Sprint 0: Preparação (1 semana)

**Objetivo:** Organizar projeto e definir padrões

- [ ] Configurar GitHub Projects
- [ ] Criar épicos e tarefas
- [ ] Definir padrões de commit (Conventional Commits)
- [ ] Configurar ESLint + Prettier
- [ ] Criar templates de PR e Issues
- [ ] Reunião de kickoff com equipe

**Responsável:** Tech Lead  
**Entregável:** Projeto organizado e pronto para desenvolvimento

---

### Sprint 1: Fundação (2 semanas)

**Épicos:**
- ✅ Épico 3: Migração PostgreSQL (Prioridade 1)
- ✅ Épico 1: Validação de Conteúdo (Prioridade 2)

**Tarefas Paralelas:**
- **Dev 1:** Criar schema PostgreSQL + API FastAPI
- **Dev 2:** Criar interface de validação de questões
- **Dev 3:** Script de migração JSON → PostgreSQL

**Entregável:** Banco de dados funcionando + Sistema de validação

---

### Sprint 2: Inteligência (2 semanas)

**Épicos:**
- ✅ Épico 2: Cases Práticos (MCP) (Prioridade 1)
- ✅ Épico 4: Análise de Gaps (Prioridade 2)

**Tarefas Paralelas:**
- **Dev 1:** Configurar MCP + criar prompts
- **Dev 2:** Implementar análise de gaps SQL
- **Dev 3:** Criar componentes UI para cases e recomendações

**Entregável:** Sistema de aprendizado adaptativo funcionando

---

### Sprint 3: Experiência (2 semanas)

**Épicos:**
- ✅ Épico 5: Trilha Visual (Prioridade 1)
- ✅ Épico 6: Exportação Profissional (Prioridade 2)

**Tarefas Paralelas:**
- **Dev 1:** Criar trilha SVG + animações
- **Dev 2:** Implementar geração de PDF
- **Dev 3:** Testes de integração e QA

**Entregável:** MVP completo e polido

---

### Sprint 4: Validação (1 semana)

**Objetivo:** Testar com usuários reais e ajustar

- [ ] Testes com 5-10 usuários beta
- [ ] Coletar feedback
- [ ] Corrigir bugs críticos
- [ ] Ajustar UX baseado em feedback
- [ ] Preparar apresentação para cliente

**Entregável:** MVP validado e pronto para demonstração

---

## 🗂️ Gestão de Tarefas

### Estrutura de Épicos

Cada épico segue este template:

```markdown
# [ÉPICO] Nome do Épico

## Contexto
Por que este épico é importante? Qual problema resolve?

## Objetivo
O que queremos alcançar ao completar este épico?

## Tarefas Filhas
- [ ] Tarefa 1 (Estimativa: Xh)
- [ ] Tarefa 2 (Estimativa: Xh)
- [ ] Tarefa 3 (Estimativa: Xh)

## Critérios de Aceite
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## Dependências
- Depende de: [Épico X]
- Bloqueia: [Épico Y]

## Estimativa Total
X semanas

## Responsável
Nome do Tech Lead do épico
```

---

### Estrutura de Tarefas Individuais

Cada tarefa segue este template:

```markdown
# [TASK] Nome da Tarefa

## Descrição
O que precisa ser feito? (1-2 parágrafos)

## Contexto Técnico
- Arquivos afetados: `file1.js`, `file2.py`
- Tecnologias: PostgreSQL, FastAPI, React
- Padrões: Clean Architecture, REST API

## Passos de Implementação
1. Passo 1
2. Passo 2
3. Passo 3

## Critérios de Aceite
- [ ] Funcionalidade implementada
- [ ] Testes unitários passando
- [ ] Documentação atualizada
- [ ] Code review aprovado

## Testes
Como testar se está funcionando?

## Dependências
- Depende de: [TASK-123]
- Bloqueia: [TASK-456]

## Estimativa
4 horas

## Responsável
@username
```

---

### Ferramentas de Gestão

**Opção 1: GitHub Projects (Recomendado)**

Vantagens:
- ✅ Integrado com repositório
- ✅ Gratuito
- ✅ Automação com GitHub Actions
- ✅ Visualização Kanban

Configuração:
```
Colunas:
- 📋 Backlog
- 🎯 Sprint Atual
- 🏃 Em Progresso
- 👀 Em Review
- ✅ Concluído
- 🚫 Bloqueado
```

---

**Opção 2: Trello**

Vantagens:
- ✅ Interface simples
- ✅ Power-ups úteis
- ✅ Mobile app

---

**Opção 3: Jira**

Vantagens:
- ✅ Mais robusto
- ✅ Relatórios avançados
- ✅ Integração com Confluence

Desvantagens:
- ❌ Curva de aprendizado
- ❌ Pode ser overkill para MVP

---

### Regras de Paralelização

**✅ Pode Paralelizar:**
- Tarefas de épicos diferentes
- Tarefas sem dependências
- Frontend + Backend de features diferentes

**❌ Não Pode Paralelizar:**
- Tarefas do mesmo arquivo
- Tarefas com dependência direta
- Tarefas que afetam o mesmo componente

**Exemplo de Paralelização Boa:**
```
Sprint 1:
- Dev 1: Criar schema PostgreSQL (backend/database)
- Dev 2: Interface de validação (frontend/validation)
- Dev 3: Script de migração (scripts/migration)
```

**Exemplo de Paralelização Ruim:**
```
Sprint 1:
- Dev 1: Criar API de questões (backend/api.py)
- Dev 2: Adicionar endpoint de validação (backend/api.py) ❌ CONFLITO
```

---

## 📊 Métricas de Sucesso do MVP

### Métricas Técnicas

- **Cobertura de Testes:** > 80%
- **Performance:** Tempo de resposta < 200ms
- **Disponibilidade:** > 99% uptime
- **Bugs Críticos:** 0 em produção

### Métricas de Produto

- **Questões Validadas:** 100% das questões CLF-C02
- **Taxa de Conclusão:** > 60% dos usuários completam um quiz
- **NPS (Net Promoter Score):** > 50
- **Tempo Médio de Estudo:** 15-20 min/dia

### Métricas de Negócio

- **Usuários Beta:** 10-20 usuários testando
- **Feedback Positivo:** > 80% de satisfação
- **Taxa de Retorno:** > 40% voltam após 7 dias
- **Conversão para Certificação:** Acompanhar quantos passam na prova

---

## 🎬 Apresentação para Cliente

### Estrutura da Demo (30 minutos)

**1. Introdução (5 min)**
- Problema que estamos resolvendo
- Insights dos especialistas
- Decisões estratégicas tomadas

**2. Demo do MVP (15 min)**
- Fluxo completo de estudo:
  1. Fazer quiz
  2. Ver análise de gaps
  3. Receber case prático ao errar
  4. Visualizar trilha de progresso
  5. Exportar relatório em PDF

**3. Diferenciais (5 min)**
- Validação por especialistas
- Cases práticos com MCP
- Análise inteligente de gaps
- Gamificação engajadora

**4. Roadmap Futuro (3 min)**
- Adicionar mais certificações
- Leaderboard real
- Mobile app
- Comunidade

**5. Q&A (2 min)**

---

## 📝 Checklist Pré-Demo

### 1 Semana Antes
- [ ] Todos os épicos concluídos
- [ ] Testes de integração passando
- [ ] Deploy em ambiente de staging
- [ ] Dados de exemplo populados

### 3 Dias Antes
- [ ] Ensaio da apresentação
- [ ] Preparar slides
- [ ] Gravar vídeo de backup (caso internet falhe)
- [ ] Testar em diferentes navegadores

### 1 Dia Antes
- [ ] Verificar ambiente de demo
- [ ] Preparar dados de demonstração
- [ ] Testar fluxo completo 3x
- [ ] Preparar respostas para perguntas comuns

### Dia da Demo
- [ ] Chegar 15 min antes
- [ ] Testar conexão e projetor
- [ ] Abrir todas as abas necessárias
- [ ] Respirar fundo e arrasar! 🚀

---

## 🎯 Próximos Passos Imediatos

### Esta Semana
1. [ ] Revisar este documento com a equipe
2. [ ] Criar projeto no GitHub Projects
3. [ ] Criar todos os épicos como Issues
4. [ ] Atribuir responsáveis
5. [ ] Agendar reunião de kickoff

### Próxima Semana
6. [ ] Iniciar Sprint 0 (Preparação)
7. [ ] Configurar ambiente de desenvolvimento
8. [ ] Definir padrões de código
9. [ ] Criar primeira PR de exemplo

---

## 📚 Recursos Úteis

### Documentação AWS
- [CLF-C02 Exam Guide](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf)
- [AWS Skill Builder](https://skillbuilder.aws/)
- [AWS Whitepapers](https://aws.amazon.com/whitepapers/)

### Treinamento SME
- [AWS Certification SME Training](https://skillbuilder.aws/learn/ENFQ4QSNTH/aws-certification-subject-matter-expert-training)

### Ferramentas
- [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

---

**Documento criado em:** 2026-05-20  
**Última atualização:** 2026-05-20  
**Versão:** 1.0  
**Aprovado por:** Equipe Técnica

---

## 🙏 Agradecimentos

Agradecimentos especiais aos especialistas **May** e **Boni** pelos insights valiosos que moldaram este roadmap.

---

**🚀 Vamos construir o melhor simulador de certificação AWS do mercado!**
