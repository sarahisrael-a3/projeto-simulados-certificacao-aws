# 📋 Épicos e Tasks do MVP - Simulador AWS

**Data:** 2026-05-20  
**Versão:** 1.0  
**Objetivo:** Estruturar épicos e tasks para GitHub Projects

---

## 📚 Como usar este documento

Este documento lista todos os **épicos** (grandes funcionalidades) e suas **tasks** (tarefas menores).

**Para criar no GitHub Projects:**
1. Crie cada épico como uma **Issue** com label `epic`
2. Crie cada task como uma **Issue** vinculada ao épico
3. Use os templates fornecidos abaixo

---

## 🎯 ÉPICO 1: Migração para PostgreSQL

**Prioridade:** 🔥 CRÍTICA  
**Estimativa:** 3 semanas  
**Responsável:** Desenvolvedor Backend 

### Descrição
Migrar o sistema de armazenamento de JSON para PostgreSQL, permitindo queries complexas, melhor performance e escalabilidade.

### Objetivo
Desacoplar dados da aplicação e criar base sólida para analytics e features avançadas.

### Critérios de Aceite
- [ ] Banco PostgreSQL configurado e rodando
- [ ] Todas as questões migradas sem perda de dados
- [ ] API REST funcional consumindo PostgreSQL
- [ ] Frontend funcionando normalmente com nova API
- [ ] Backup automático configurado

---

### Task 1.1: Criar Schema PostgreSQL

**Prioridade:** 🔥 CRÍTICA  
**Estimativa:** 4 horas  
**Dependências:** Nenhuma

**Descrição:**
Criar estrutura completa do banco de dados com tabelas, índices e relacionamentos.

**Checklist:**
- [ ] Instalar PostgreSQL localmente
- [ ] Criar banco de dados `aws_simulator`
- [ ] Executar `backend/database/schema.sql`
- [ ] Verificar criação de todas as tabelas
- [ ] Testar conexão com Python

**Arquivos:**
- `backend/database/schema.sql` (já existe)

**Como testar:**
```bash
psql -U postgres -d aws_simulator -c "\dt"
```

---

### Task 1.2: Script de Migração JSON → PostgreSQL

**Prioridade:** 🔥 CRÍTICA  
**Estimativa:** 6 horas  
**Dependências:** Task 1.1

**Descrição:**
Criar script Python que lê os arquivos JSON e insere no PostgreSQL.

**Checklist:**
- [ ] Criar `scripts_python/migrate_to_postgres.py`
- [ ] Ler todos os arquivos JSON (clf-c02, saa-c03, dva-c02, aif-c01)
- [ ] Converter formato JSON para schema PostgreSQL
- [ ] Inserir questões no banco
- [ ] Adicionar barra de progresso (tqdm)
- [ ] Adicionar log de erros
- [ ] Validar migração (contar registros)

**Arquivos:**
- `scripts_python/migrate_to_postgres.py` (criar)

**Como testar:**
```bash
python scripts_python/migrate_to_postgres.py
psql -U postgres -d aws_simulator -c "SELECT COUNT(*) FROM questions;"
```

---

### Task 1.3: API FastAPI - Endpoints Básicos

**Prioridade:** 🔥 CRÍTICA  
**Estimativa:** 8 horas  
**Dependências:** Task 1.1

**Descrição:**
Criar API REST com FastAPI para servir questões e salvar resultados.

**Checklist:**
- [ ] Criar `backend/api/main.py`
- [ ] Criar `backend/api/database.py` (conexão)
- [ ] Criar `backend/api/models.py` (Pydantic models)
- [ ] Implementar endpoint `GET /api/questions`
- [ ] Implementar endpoint `GET /api/questions/{id}`
- [ ] Implementar endpoint `POST /api/quiz/submit`
- [ ] Implementar endpoint `GET /api/history/{user_id}`
- [ ] Documentar com Swagger
- [ ] Adicionar CORS para frontend

**Arquivos:**
- `backend/api/main.py` (criar)
- `backend/api/database.py` (criar)
- `backend/api/models.py` (criar)

**Como testar:**
```bash
uvicorn backend.api.main:app --reload
# Acessar http://localhost:8000/docs
```

---

### Task 1.4: Interface de Validação de Questões

**Prioridade:** Alta  
**Estimativa:** 6 horas  
**Dependências:** Task 1.3

**Descrição:**
Criar tela para especialistas validarem questões antes de irem para produção.

**Checklist:**
- [ ] Criar `validation.html`
- [ ] Criar `js/validation/validationUI.js`
- [ ] Listar questões não validadas
- [ ] Adicionar botões: Aprovar, Reprovar, Editar
- [ ] Integrar com API (POST /api/questions/{id}/validate)
- [ ] Adicionar campo para nome do validador
- [ ] Mostrar contador de questões validadas

**Arquivos:**
- `validation.html` (criar)
- `js/validation/validationUI.js` (criar)

**Como testar:**
- Abrir validation.html
- Validar uma questão
- Verificar no banco se `validated_by` foi preenchido

---

### Task 1.5: Badge "Validado por Especialista"

**Prioridade:** Baixa  
**Estimativa:** 2 horas  
**Dependências:** Task 1.4

**Descrição:**
Adicionar badge visual nas questões que foram validadas por especialistas.

**Checklist:**
- [ ] Editar `js/quizEngine.js` para verificar `validated_by`
- [ ] Adicionar badge na UI da questão
- [ ] Adicionar tooltip com nome do validador
- [ ] Estilizar badge (CSS)

**Arquivos:**
- `js/quizEngine.js` (editar)
- `css/style.css` (editar)

**Como testar:**
- Fazer quiz com questão validada
- Verificar se badge aparece
- Hover no badge para ver tooltip

---

## 🎯 ÉPICO 2: Análise Inteligente de Gaps

**Prioridade:** Alta  
**Estimativa:** 1 semana  
**Responsável:** Desenvolvedor Backend + Frontend

### Descrição
Implementar sistema que analisa erros do usuário e sugere o que estudar.

### Objetivo
Transformar dados de performance em insights acionáveis para melhorar estudo.

### Critérios de Aceite
- [ ] Sistema identifica 3 domínios mais fracos
- [ ] Recomendações aparecem na sidebar
- [ ] Links para recursos de estudo funcionam
- [ ] Atualiza após cada quiz

---

### Task 2.1: Query SQL para Análise de Gaps

**Prioridade:** Alta  
**Estimativa:** 4 horas  
**Dependências:** Épico 1 (Task 1.1)

**Descrição:**
Criar query SQL que agrupa erros por domínio e calcula taxa de erro.

**Checklist:**
- [ ] Criar `backend/analytics/gaps_analyzer.py`
- [ ] Criar query SQL para agrupar erros por domínio
- [ ] Calcular taxa de erro por domínio
- [ ] Identificar 3 domínios com maior taxa de erro
- [ ] Retornar JSON estruturado
- [ ] Adicionar endpoint na API

**Arquivos:**
- `backend/analytics/gaps_analyzer.py` (criar)

**Como testar:**
```python
from backend.analytics.gaps_analyzer import analyze_gaps
result = analyze_gaps(user_id="test-user")
print(result)
```

---

### Task 2.2: Componente "O Que Estudar Agora"

**Prioridade:** Média  
**Estimativa:** 3 horas  
**Dependências:** Task 2.1

**Descrição:**
Criar card na sidebar que mostra domínios fracos e links para estudo.

**Checklist:**
- [ ] Criar `js/recommendations/studyNow.js`
- [ ] Criar `css/recommendations.css`
- [ ] Buscar análise de gaps da API
- [ ] Renderizar card com 3 domínios mais fracos
- [ ] Adicionar links para documentação AWS
- [ ] Adicionar botão "Estudar Meus Pontos Fracos"
- [ ] Atualizar após cada quiz

**Arquivos:**
- `js/recommendations/studyNow.js` (criar)
- `css/recommendations.css` (criar)

**Como testar:**
- Fazer quiz e errar questões de um domínio
- Verificar se card aparece na sidebar
- Clicar nos links e verificar se abrem

---

## 🎯 ÉPICO 3: Trilha Visual Interativa

**Prioridade:** Alta  
**Estimativa:** 2 semanas  
**Responsável:** Desenvolvedor Frontend

### Descrição
Transformar lista de módulos em trilha visual com animações e gamificação.

### Objetivo
Aumentar engajamento e motivação através de visualização clara de progresso.

### Critérios de Aceite
- [ ] Trilha renderiza como mapa visual (SVG)
- [ ] Animações fluidas ao desbloquear módulos
- [ ] Funciona em desktop e mobile
- [ ] Boss battle tem mecânica diferenciada

---

### Task 3.1: Componente SVG de Trilha

**Prioridade:** Alta  
**Estimativa:** 8 horas  
**Dependências:** Nenhuma

**Descrição:**
Criar trilha visual com SVG substituindo lista atual de módulos.

**Checklist:**
- [ ] Criar `js/gamificacao/trailSVG.js`
- [ ] Criar `css/trail.css`
- [ ] Desenhar nós (círculos) para cada módulo
- [ ] Conectar nós com linhas
- [ ] Adicionar ícones dentro dos nós
- [ ] Implementar estados: bloqueado, desbloqueado, completo
- [ ] Tornar responsivo (mobile)
- [ ] Adicionar clique nos nós desbloqueados

**Arquivos:**
- `js/gamificacao/trailSVG.js` (criar)
- `css/trail.css` (criar)

**Como testar:**
- Abrir tela de jornada
- Verificar trilha visual
- Testar em mobile
- Clicar em nó desbloqueado

---

### Task 3.2: Animações de Desbloqueio

**Prioridade:** Média  
**Estimativa:** 4 horas  
**Dependências:** Task 3.1

**Descrição:**
Adicionar animações quando módulo é desbloqueado.

**Checklist:**
- [ ] Criar `css/trail-animations.css`
- [ ] Criar `js/gamificacao/trailAnimations.js`
- [ ] Animação de linha iluminando progressivamente
- [ ] Animação de nó pulsando ao desbloquear
- [ ] Adicionar confete (opcional)
- [ ] Adicionar som de desbloqueio (opcional)
- [ ] Garantir 60fps

**Arquivos:**
- `css/trail-animations.css` (criar)
- `js/gamificacao/trailAnimations.js` (criar)

**Como testar:**
- Completar módulo
- Verificar animação de desbloqueio
- Testar performance (60fps)

---

### Task 3.3: Boss Battle (Simulado Final)

**Prioridade:** Baixa  
**Estimativa:** 6 horas  
**Dependências:** Nenhuma

**Descrição:**
Criar modo especial para último módulo com mecânicas diferentes.

**Checklist:**
- [ ] Criar `js/modes/bossBattle.js`
- [ ] Criar `css/boss-battle.css`
- [ ] Configurar 65 questões (simulado completo)
- [ ] Timer de 90 minutos
- [ ] Sem feedback imediato (só no final)
- [ ] Visual diferenciado (tema escuro)
- [ ] Música épica (opcional)

**Arquivos:**
- `js/modes/bossBattle.js` (criar)
- `css/boss-battle.css` (criar)

**Como testar:**
- Chegar no último módulo
- Iniciar boss battle
- Verificar 65 questões
- Verificar timer
- Verificar feedback só no final

---

## 🎯 ÉPICO 4: Exportação Profissional de PDF

**Prioridade:** Alta  
**Estimativa:** 1 semana  
**Responsável:** Desenvolvedor Frontend

### Descrição
Implementar geração de relatórios em PDF com gráficos e análise detalhada.

### Objetivo
Permitir que usuários tenham relatório profissional para acompanhar evolução.

### Critérios de Aceite
- [ ] PDF gerado com qualidade de impressão
- [ ] Gráficos renderizados corretamente
- [ ] Filtro "apenas erros" funcional
- [ ] Preview antes de baixar

---

### Task 4.1: Integrar jsPDF + html2canvas

**Prioridade:** Alta  
**Estimativa:** 3 horas  
**Dependências:** Nenhuma

**Descrição:**
Configurar bibliotecas e criar função básica de geração de PDF.

**Checklist:**
- [ ] Verificar instalação: `npm list jspdf html2canvas`
- [ ] Criar `js/export/pdfGenerator.js`
- [ ] Importar bibliotecas no HTML
- [ ] Criar função básica de geração
- [ ] Testar geração de PDF simples

**Arquivos:**
- `js/export/pdfGenerator.js` (criar)
- `index.html` (editar - adicionar imports)

**Como testar:**
```javascript
import { generatePDF } from './js/export/pdfGenerator.js';
generatePDF();
```

---

### Task 4.2: Adicionar Gráficos ao PDF

**Prioridade:** Alta  
**Estimativa:** 6 horas  
**Dependências:** Task 4.1

**Descrição:**
Capturar gráfico radar como imagem e incluir no PDF.

**Checklist:**
- [ ] Capturar canvas do gráfico radar
- [ ] Converter para imagem (html2canvas)
- [ ] Adicionar imagem ao PDF
- [ ] Ajustar tamanho e posição
- [ ] Adicionar legenda
- [ ] Garantir qualidade da imagem

**Arquivos:**
- `js/export/pdfGenerator.js` (editar)

**Como testar:**
- Fazer quiz
- Gerar PDF
- Verificar se gráfico aparece
- Verificar qualidade da imagem

---

### Task 4.3: Template Profissional de PDF

**Prioridade:** Média  
**Estimativa:** 4 horas  
**Dependências:** Task 4.2

**Descrição:**
Criar layout profissional com branding e seções organizadas.

**Checklist:**
- [ ] Criar `js/export/pdfTemplate.js`
- [ ] Adicionar cabeçalho com logo
- [ ] Adicionar informações do usuário
- [ ] Adicionar resumo de performance
- [ ] Adicionar gráfico radar
- [ ] Adicionar análise por domínio
- [ ] Adicionar recomendações
- [ ] Adicionar rodapé com data
- [ ] Usar cores do projeto (laranja AWS)

**Arquivos:**
- `js/export/pdfTemplate.js` (criar)

**Como testar:**
- Gerar PDF
- Verificar layout profissional
- Verificar todas as seções

---

### Task 4.4: Filtro "Exportar Apenas Erros"

**Prioridade:** Baixa  
**Estimativa:** 2 horas  
**Dependências:** Task 4.1

**Descrição:**
Adicionar opção de exportar PDF apenas com questões erradas.

**Checklist:**
- [ ] Adicionar checkbox na tela de resultados
- [ ] Filtrar questões erradas
- [ ] Gerar PDF só com erros
- [ ] Incluir explicações das respostas corretas

**Arquivos:**
- `js/export/pdfGenerator.js` (editar)

**Como testar:**
- Fazer quiz e errar algumas questões
- Marcar checkbox "Apenas erros"
- Gerar PDF
- Verificar se contém apenas erros

---

## 🎯 ÉPICO 5: Validação e Testes com Usuários

**Prioridade:** Alta  
**Estimativa:** 1 semana  
**Responsável:** Product Owner + QA

### Descrição
Testar MVP com usuários reais e coletar feedback para ajustes.

### Objetivo
Validar produto com usuários antes da apresentação ao cliente.

### Critérios de Aceite
- [ ] 10+ usuários testaram
- [ ] Feedback coletado e analisado
- [ ] Bugs críticos corrigidos
- [ ] NPS > 50

---

### Task 5.1: Criar Ambiente de Staging

**Prioridade:** Alta  
**Estimativa:** 3 horas  
**Dependências:** Épico 1 completo

**Descrição:**
Configurar servidor de staging para testes.

**Checklist:**
- [ ] Escolher plataforma (Vercel, Netlify, AWS)
- [ ] Configurar deploy automático
- [ ] Configurar banco de dados de teste
- [ ] Criar URL de acesso
- [ ] Testar deploy

**Arquivos:**
- `.github/workflows/deploy-staging.yml` (criar)

**Como testar:**
- Fazer push para branch staging
- Verificar deploy automático
- Acessar URL de staging

---

### Task 5.2: Criar Formulário de Feedback

**Prioridade:** Média  
**Estimativa:** 2 horas  
**Dependências:** Nenhuma

**Descrição:**
Criar formulário simples para coletar feedback dos usuários.

**Checklist:**
- [ ] Criar `feedback.html`
- [ ] Criar `js/feedback/feedbackForm.js`
- [ ] Adicionar campo de avaliação (1-5 estrelas)
- [ ] Adicionar campo "O que você mais gostou?"
- [ ] Adicionar campo "O que pode melhorar?"
- [ ] Adicionar campo "Você usaria de novo?"
- [ ] Salvar no banco ou Google Forms

**Arquivos:**
- `feedback.html` (criar)
- `js/feedback/feedbackForm.js` (criar)

**Como testar:**
- Abrir feedback.html
- Preencher formulário
- Enviar
- Verificar se salvou

---

### Task 5.3: Recrutar Usuários Beta

**Prioridade:** Média  
**Estimativa:** 2 horas  
**Dependências:** Task 5.1

**Descrição:**
Recrutar 10-15 pessoas para testar o MVP.

**Checklist:**
- [ ] Criar lista de potenciais testadores
- [ ] Enviar convites por email/WhatsApp
- [ ] Incluir link do staging
- [ ] Incluir instruções de uso
- [ ] Incluir link do formulário de feedback
- [ ] Definir prazo para testes (3 dias)

**Como testar:**
- Verificar se convites foram enviados
- Verificar se pessoas confirmaram
- Acompanhar quantos testaram

---

### Task 5.4: Coletar e Analisar Feedback

**Prioridade:** Alta  
**Estimativa:** 3 horas  
**Dependências:** Task 5.3

**Descrição:**
Compilar feedbacks e categorizar por tipo.

**Checklist:**
- [ ] Esperar 3 dias para coleta
- [ ] Compilar todos os feedbacks
- [ ] Categorizar: bugs críticos, bugs menores, melhorias UX, sugestões
- [ ] Priorizar correções
- [ ] Criar documento de análise

**Arquivos:**
- `docs/FEEDBACK-USUARIOS.md` (criar)

**Como testar:**
- Verificar se todos feedbacks foram lidos
- Verificar se bugs foram categorizados

---

### Task 5.5: Corrigir Bugs Críticos

**Prioridade:** 🔥 CRÍTICA  
**Estimativa:** 8 horas  
**Dependências:** Task 5.4

**Descrição:**
Corrigir todos os bugs que impedem uso do sistema.

**Checklist:**
- [ ] Listar bugs críticos
- [ ] Dividir entre equipe
- [ ] Corrigir cada bug
- [ ] Testar correção
- [ ] Fazer deploy
- [ ] Pedir usuários para confirmarem correção

**Como testar:**
- Reproduzir cada bug
- Verificar se foi corrigido
- Pedir confirmação dos usuários

---

### Task 5.6: Implementar Melhorias de UX Rápidas

**Prioridade:** Média  
**Estimativa:** 4 horas  
**Dependências:** Task 5.4

**Descrição:**
Implementar melhorias de UX mais votadas e simples.

**Checklist:**
- [ ] Listar melhorias de UX
- [ ] Priorizar as mais simples
- [ ] Implementar (ex: aumentar botões, ajustar cores)
- [ ] Testar
- [ ] Fazer deploy

**Arquivos:**
- `css/style.css` (editar)
- Vários arquivos JS (pequenas edições)

**Como testar:**
- Verificar melhorias implementadas
- Pedir feedback dos usuários

---

### Task 5.7: Preparar Apresentação para Cliente

**Prioridade:** Alta  
**Estimativa:** 4 horas  
**Dependências:** Task 5.5

**Descrição:**
Criar apresentação profissional do MVP.

**Checklist:**
- [ ] Criar slides (PowerPoint ou Google Slides)
- [ ] Slide 1: Capa
- [ ] Slide 2: O Problema
- [ ] Slide 3: Nossa Solução
- [ ] Slide 4: Demo ao Vivo
- [ ] Slide 5: Resultados dos Testes
- [ ] Slide 6: Próximos Passos
- [ ] Slide 7: Perguntas
- [ ] Ensaiar apresentação (2x)

**Arquivos:**
- `docs/APRESENTACAO-CLIENTE.pptx` (criar)

**Como testar:**
- Ensaiar apresentação
- Verificar se cabe em 30 minutos
- Testar demo ao vivo

---

## 📊 Resumo dos Épicos

| Épico | Tasks | Estimativa | Prioridade |
|-------|-------|------------|------------|
| 1. Migração PostgreSQL | 5 | 3 semanas | 🔥 CRÍTICA |
| 2. Análise de Gaps | 2 | 1 semana | Alta |
| 3. Trilha Visual | 3 | 2 semanas | Alta |
| 4. Exportação PDF | 4 | 1 semana | Alta |
| 5. Validação e Testes | 7 | 1 semana | Alta |
| **TOTAL** | **21** | **8 semanas** | - |

---

## 🎯 Ordem de Execução Recomendada

### Sprint 1 (2 semanas)
- **Épico 1:** Migração PostgreSQL (Tasks 1.1, 1.2, 1.3)

### Sprint 2 (2 semanas)
- **Épico 1:** Finalizar (Tasks 1.4, 1.5)
- **Épico 2:** Análise de Gaps (Tasks 2.1, 2.2)

### Sprint 3 (2 semanas)
- **Épico 3:** Trilha Visual (Tasks 3.1, 3.2, 3.3)
- **Épico 4:** Exportação PDF (Tasks 4.1, 4.2)

### Sprint 4 (2 semanas)
- **Épico 4:** Finalizar PDF (Tasks 4.3, 4.4)
- **Épico 5:** Validação (Tasks 5.1, 5.2, 5.3)

### Sprint 5 (1 semana)
- **Épico 5:** Finalizar (Tasks 5.4, 5.5, 5.6, 5.7)

---

## 📋 Template de Issue para Épico

```markdown
## [ÉPICO] Nome do Épico

### Descrição
[Descrição detalhada do épico]

### Objetivo
[O que queremos alcançar]

### Critérios de Aceite
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

### Tasks Relacionadas
- #[número da task 1]
- #[número da task 2]
- #[número da task 3]

### Estimativa
[X semanas]

### Prioridade
[CRÍTICA / Alta / Média / Baixa]

### Responsável
@[username]
```

---

## 📋 Template de Issue para Task

```markdown
## [TASK] Nome da Task

### Épico
Relacionado ao #[número do épico]

### Descrição
[O que precisa ser feito]

### Contexto Técnico
- **Arquivos afetados:** `file1.js`, `file2.py`
- **Tecnologias:** PostgreSQL, FastAPI, React
- **Padrões:** Clean Architecture, REST API

### Checklist
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

### Critérios de Aceite
- [ ] Funcionalidade implementada
- [ ] Testes unitários passando
- [ ] Documentação atualizada
- [ ] Code review aprovado

### Como Testar
[Instruções de como testar]

### Dependências
- Depende de: #[número da task]
- Bloqueia: #[número da task]

### Estimativa
[X horas]

### Prioridade
[🔥 CRÍTICA / Alta / Média / Baixa]

### Responsável
@[username]

### Labels
`task`, `sprint-X`, `backend` ou `frontend`
```

---

## 🚀 Como Criar no GitHub Projects

### Passo 1: Criar Épicos
1. Ir em **Issues** → **New Issue**
2. Título: `[ÉPICO] Nome do Épico`
3. Usar template de épico
4. Adicionar label `epic`
5. Adicionar ao projeto
6. Mover para coluna "Backlog"

### Passo 2: Criar Tasks
1. Ir em **Issues** → **New Issue**
2. Título: `[TASK] Nome da Task`
3. Usar template de task
4. Adicionar label `task` + `sprint-X` + `backend`/`frontend`
5. Vincular ao épico (mencionar #número)
6. Adicionar ao projeto
7. Mover para coluna apropriada

### Passo 3: Organizar no Board
```
Colunas sugeridas:
📋 Backlog
🎯 Sprint Atual
🏃 Em Progresso
👀 Em Review
✅ Concluído
🚫 Bloqueado
```

---

## 📊 Métricas de Acompanhamento

### Por Sprint
- Total de tasks planejadas
- Total de tasks concluídas
- Velocity (tasks/semana)
- Bugs encontrados
- Bugs corrigidos

### Por Épico
- % de conclusão
- Tempo gasto vs estimado
- Bloqueadores encontrados
- Dependências resolvidas

---

## ✅ Checklist de Criação

- [ ] Revisar este documento
- [ ] Criar 5 épicos no GitHub
- [ ] Criar 21 tasks no GitHub
- [ ] Vincular tasks aos épicos
- [ ] Adicionar labels apropriadas
- [ ] Atribuir responsáveis
- [ ] Definir milestones (sprints)
- [ ] Organizar no board
- [ ] Comunicar equipe

---

**Documento criado em:** 2026-05-20  
**Última atualização:** 2026-05-20  
**Versão:** 1.0
