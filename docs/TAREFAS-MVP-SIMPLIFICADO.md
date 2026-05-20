# 📝 Guia de Tarefas do MVP - Simulador AWS

**Para:** Estagiários e Desenvolvedores Júnior  
**Data:** 2026-05-20  
**Versão:** 1.0  
**Objetivo:** Explicar de forma simples todas as tarefas do projeto

---

## 📚 Como Usar Este Documento

Este documento lista **todas as tarefas** que precisamos fazer para criar o MVP (Produto Mínimo Viável) do nosso simulador de certificação AWS.

**O que você vai encontrar aqui:**
- ✅ Tarefas organizadas por prioridade
- ✅ Explicação simples do que fazer
- ✅ Tempo estimado para cada tarefa
- ✅ Arquivos que você vai mexer
- ✅ Como testar se funcionou

**Legenda de Dificuldade:**
- 🟢 **Fácil** - Você consegue fazer sozinho
- 🟡 **Médio** - Pode precisar de ajuda
- 🔴 **Difícil** - Peça ajuda ao Tech Lead

---

## 🎯 Visão Geral do Projeto

### O que estamos construindo?

Um simulador de questões para quem está estudando para a certificação **AWS Cloud Practitioner (CLF-C02)**.

### Por que estamos fazendo isso?

Para ajudar pessoas a estudarem de forma mais eficiente, com:
- Questões validadas por especialistas
- Explicações práticas quando errar
- Análise inteligente dos pontos fracos
- Gamificação para manter motivação

### Qual é o nosso diferencial?

Outros simuladores só mostram se você acertou ou errou. O nosso:
1. Mostra **cases práticos** quando você erra
2. Analisa seus erros e **sugere o que estudar**
3. Tem **gamificação** (trilha, badges, ranking)
4. Gera **relatórios em PDF** profissionais

---

## 📅 Cronograma Resumido

```
Sprint 0 (1 semana)  → Organizar o projeto
Sprint 1 (2 semanas) → Banco de dados + Validação
Sprint 2 (2 semanas) → Cases práticos + Análise
Sprint 3 (2 semanas) → Trilha visual + PDF
Sprint 4 (1 semana)  → Testes e ajustes
```

**Total:** 8 semanas até a apresentação para o cliente

---


## 🚀 SPRINT 0: Preparação (1 semana)

**Objetivo:** Organizar o projeto antes de começar a programar

---

### Tarefa 0.1: Configurar GitHub Projects

**Dificuldade:** 🟢 Fácil  
**Tempo:** 1 hora  
**Responsável:** Tech Lead

**O que fazer:**
1. Entrar no repositório do GitHub
2. Clicar em "Projects" → "New Project"
3. Escolher template "Board"
4. Criar as colunas:
   - 📋 Backlog
   - 🎯 Sprint Atual
   - 🏃 Em Progresso
   - 👀 Em Review
   - ✅ Concluído
   - 🚫 Bloqueado

**Como testar:**
- [ ] Consegue criar uma issue de teste
- [ ] Consegue mover entre colunas
- [ ] Todos da equipe têm acesso

---

### Tarefa 0.2: Criar Templates de Issues

**Dificuldade:** 🟢 Fácil  
**Tempo:** 30 minutos  
**Responsável:** Qualquer desenvolvedor

**O que fazer:**
1. Criar pasta `.github/ISSUE_TEMPLATE/`
2. Criar arquivo `bug_report.md`
3. Criar arquivo `feature_request.md`
4. Criar arquivo `task.md`

**Arquivos:**
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/task.md`

**Como testar:**
- [ ] Ao criar issue, aparecem os templates
- [ ] Templates têm todos os campos necessários

---

### Tarefa 0.3: Configurar ESLint e Prettier

**Dificuldade:** 🟡 Médio  
**Tempo:** 2 horas  
**Responsável:** Desenvolvedor com experiência em JavaScript

**O que fazer:**
1. Instalar dependências:
   ```bash
   npm install --save-dev eslint prettier eslint-config-prettier
   ```
2. Criar arquivo `.eslintrc.json`
3. Criar arquivo `.prettierrc`
4. Adicionar scripts no `package.json`:
   ```json
   "scripts": {
     "lint": "eslint js/**/*.js",
     "format": "prettier --write js/**/*.js"
   }
   ```

**Arquivos:**
- `.eslintrc.json` (novo)
- `.prettierrc` (novo)
- `package.json` (editar)

**Como testar:**
- [ ] Rodar `npm run lint` sem erros
- [ ] Rodar `npm run format` e ver código formatado

---

### Tarefa 0.4: Configurar Husky (Pre-commit Hooks)

**Dificuldade:** 🟡 Médio  
**Tempo:** 1 hora  
**Responsável:** Desenvolvedor com experiência em Git

**O que fazer:**
1. Instalar Husky:
   ```bash
   npm install --save-dev husky
   npx husky install
   ```
2. Criar hook de pre-commit:
   ```bash
   npx husky add .husky/pre-commit "npm run lint"
   ```
3. Testar fazendo um commit

**Arquivos:**
- `.husky/pre-commit` (novo)

**Como testar:**
- [ ] Ao fazer commit, lint roda automaticamente
- [ ] Se tiver erro de lint, commit não acontece

---

### Tarefa 0.5: Documentar Padrões de Commit

**Dificuldade:** 🟢 Fácil  
**Tempo:** 1 hora  
**Responsável:** Qualquer desenvolvedor

**O que fazer:**
1. Abrir arquivo `CONTRIBUTING.md`
2. Adicionar seção "Padrões de Commit"
3. Explicar Conventional Commits:
   - `feat:` nova funcionalidade
   - `fix:` correção de bug
   - `docs:` documentação
   - `style:` formatação
   - `refactor:` refatoração
   - `test:` testes
   - `chore:` tarefas gerais

**Arquivos:**
- `CONTRIBUTING.md` (editar)

**Exemplo de commit bom:**
```
feat: adicionar validação de questões por especialistas

- Criar campo validated_by no banco
- Adicionar badge "Validado" na UI
- Implementar filtro de questões validadas
```

**Como testar:**
- [ ] Documento está claro e com exemplos
- [ ] Equipe entendeu os padrões

---


## 🗄️ SPRINT 1: Banco de Dados (2 semanas)

**Objetivo:** Migrar de JSON para PostgreSQL e criar sistema de validação

---

### Tarefa 1.1: Criar Schema do Banco PostgreSQL

**Dificuldade:** 🟡 Médio  
**Tempo:** 4 horas  
**Responsável:** Desenvolvedor Backend

**O que fazer:**
1. Instalar PostgreSQL localmente
2. Criar banco de dados `aws_simulator`
3. Criar arquivo `backend/database/schema.sql`
4. Criar as tabelas:
   - `questions` (questões)
   - `users` (usuários anônimos)
   - `quiz_history` (histórico de quizzes)
   - `answers` (respostas individuais)

**Arquivos:**
- `backend/database/schema.sql` (novo)

**Estrutura das tabelas:**
```sql
-- Tabela de questões
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

**Como testar:**
- [ ] Banco criado sem erros
- [ ] Consegue inserir uma questão de teste
- [ ] Consegue fazer SELECT e ver os dados

---

### Tarefa 1.2: Criar Script de Migração JSON → PostgreSQL

**Dificuldade:** 🟡 Médio  
**Tempo:** 6 horas  
**Responsável:** Desenvolvedor Python

**O que fazer:**
1. Criar arquivo `scripts_python/migrate_to_postgres.py`
2. Ler arquivo `data/clf-c02.json`
3. Para cada questão:
   - Converter para formato do banco
   - Inserir no PostgreSQL
4. Adicionar barra de progresso
5. Adicionar log de erros

**Arquivos:**
- `scripts_python/migrate_to_postgres.py` (novo)

**Exemplo de código:**
```python
import json
import psycopg2
from tqdm import tqdm

# Conectar ao banco
conn = psycopg2.connect("dbname=aws_simulator user=postgres")
cur = conn.cursor()

# Ler JSON
with open('data/clf-c02.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Migrar
for q in tqdm(questions):
    cur.execute("""
        INSERT INTO questions (certification, domain, difficulty, ...)
        VALUES (%s, %s, %s, ...)
    """, (q['cert'], q['domain'], q['difficulty'], ...))

conn.commit()
```

**Como testar:**
- [ ] Script roda sem erros
- [ ] Todas as questões foram migradas
- [ ] Dados no banco estão corretos

---

### Tarefa 1.3: Criar API FastAPI - Endpoints Básicos

**Dificuldade:** 🟡 Médio  
**Tempo:** 8 horas  
**Responsável:** Desenvolvedor Backend

**O que fazer:**
1. Criar pasta `backend/api/`
2. Criar arquivo `backend/api/main.py`
3. Instalar FastAPI e dependências:
   ```bash
   pip install fastapi uvicorn psycopg2-binary
   ```
4. Criar endpoints:
   - `GET /api/questions` - Listar questões
   - `GET /api/questions/{id}` - Buscar questão
   - `POST /api/quiz/submit` - Salvar resultado
   - `GET /api/history/{user_id}` - Histórico

**Arquivos:**
- `backend/api/main.py` (novo)
- `backend/api/database.py` (novo)
- `backend/api/models.py` (novo)

**Exemplo de endpoint:**
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/api/questions")
async def get_questions(
    certification: str = "clf-c02",
    limit: int = 10
):
    # Buscar questões no banco
    return {"questions": [...]}
```

**Como testar:**
- [ ] Rodar `uvicorn main:app --reload`
- [ ] Acessar http://localhost:8000/docs
- [ ] Testar cada endpoint no Swagger

---

### Tarefa 1.4: Criar Interface de Validação de Questões

**Dificuldade:** 🟡 Médio  
**Tempo:** 6 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Criar arquivo `js/validation/validationUI.js`
2. Criar tela para especialistas validarem questões
3. Adicionar botões:
   - ✅ Aprovar
   - ❌ Reprovar
   - ✏️ Sugerir Edição
4. Salvar validação no banco

**Arquivos:**
- `js/validation/validationUI.js` (novo)
- `validation.html` (novo)

**Layout da tela:**
```
┌─────────────────────────────────────┐
│ Validação de Questões               │
├─────────────────────────────────────┤
│ Questão #123                        │
│ Domínio: Conceitos Cloud            │
│                                     │
│ [Texto da questão aqui]             │
│                                     │
│ A) Opção 1                          │
│ B) Opção 2                          │
│ C) Opção 3                          │
│ D) Opção 4                          │
│                                     │
│ Resposta Correta: A                 │
│                                     │
│ [✅ Aprovar] [❌ Reprovar] [✏️ Editar]│
└─────────────────────────────────────┘
```

**Como testar:**
- [ ] Consegue ver questões não validadas
- [ ] Botões funcionam
- [ ] Status salva no banco

---

### Tarefa 1.5: Adicionar Badge "Validado por Especialista"

**Dificuldade:** 🟢 Fácil  
**Tempo:** 2 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Abrir arquivo `js/quizEngine.js`
2. Verificar se questão tem `validated_by`
3. Se tiver, mostrar badge na UI
4. Adicionar tooltip com nome do validador

**Arquivos:**
- `js/quizEngine.js` (editar)
- `css/style.css` (editar)

**Exemplo de badge:**
```html
<span class="badge-validated" title="Validado por João Silva">
  <i class="fa-solid fa-check-circle"></i> Validado
</span>
```

**Como testar:**
- [ ] Badge aparece em questões validadas
- [ ] Badge não aparece em questões não validadas
- [ ] Tooltip mostra nome do validador

---


## 🧠 SPRINT 2: Inteligência (2 semanas)

**Objetivo:** Adicionar cases práticos e análise de gaps

---

### Tarefa 2.1: Configurar MCP (Model Context Protocol)

**Dificuldade:** 🔴 Difícil  
**Tempo:** 4 horas  
**Responsável:** Tech Lead

**O que fazer:**
1. Instalar MCP no projeto
2. Configurar credenciais da API
3. Criar arquivo de configuração
4. Testar conexão

**Arquivos:**
- `backend/mcp/config.py` (novo)
- `.env` (editar - adicionar API key)

**Como configurar:**
```bash
# Instalar
pip install mcp-client

# Configurar .env
MCP_API_KEY=sua_chave_aqui
MCP_MODEL=gpt-4
```

**Como testar:**
- [ ] Consegue fazer uma chamada de teste
- [ ] API responde corretamente
- [ ] Não vaza a API key no código

---

### Tarefa 2.2: Criar Prompt Template para Cases Práticos

**Dificuldade:** 🟡 Médio  
**Tempo:** 4 horas  
**Responsável:** Desenvolvedor com conhecimento de AWS

**O que fazer:**
1. Criar arquivo `backend/mcp/prompts.py`
2. Criar template de prompt para gerar cases
3. Incluir:
   - Contexto da questão
   - Serviço AWS mencionado
   - Cenário prático
   - Exemplo de código/CLI

**Arquivos:**
- `backend/mcp/prompts.py` (novo)

**Exemplo de prompt:**
```python
CASE_TEMPLATE = """
O usuário errou uma questão sobre {service}.

Questão: {question_text}
Resposta correta: {correct_answer}

Crie um case prático que:
1. Explique o conceito de forma simples
2. Mostre um cenário real de uso
3. Inclua exemplo de AWS CLI ou Console
4. Seja objetivo (máximo 200 palavras)

Formato:
## Entendendo {service}

[Explicação simples]

## Cenário Prático

[Exemplo do mundo real]

## Como Fazer

[Passo a passo ou comando CLI]
"""
```

**Como testar:**
- [ ] Prompt gera cases úteis
- [ ] Cases são objetivos e práticos
- [ ] Exemplos de código funcionam

---

### Tarefa 2.3: Implementar Detecção de Serviços AWS

**Dificuldade:** 🟡 Médio  
**Tempo:** 3 horas  
**Responsável:** Desenvolvedor Backend

**O que fazer:**
1. Criar arquivo `backend/services/aws_detector.py`
2. Criar lista de serviços AWS (S3, EC2, Lambda, etc.)
3. Criar função que detecta serviços no texto da questão
4. Retornar serviços encontrados

**Arquivos:**
- `backend/services/aws_detector.py` (novo)

**Exemplo de código:**
```python
AWS_SERVICES = {
    's3': ['S3', 'Simple Storage Service', 'bucket'],
    'ec2': ['EC2', 'Elastic Compute Cloud', 'instância'],
    'lambda': ['Lambda', 'função serverless'],
    # ... mais serviços
}

def detect_services(question_text):
    """Detecta serviços AWS mencionados na questão"""
    found = []
    for service, keywords in AWS_SERVICES.items():
        for keyword in keywords:
            if keyword.lower() in question_text.lower():
                found.append(service)
                break
    return found
```

**Como testar:**
- [ ] Detecta S3 em "armazenar arquivos no S3"
- [ ] Detecta Lambda em "função serverless"
- [ ] Não detecta falsos positivos

---

### Tarefa 2.4: Criar Componente UI para Cases Práticos

**Dificuldade:** 🟡 Médio  
**Tempo:** 6 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Criar arquivo `js/cases/casesUI.js`
2. Criar componente que mostra case prático
3. Adicionar ao fluxo de erro:
   - Usuário erra questão
   - Sistema detecta serviço AWS
   - Gera case prático
   - Mostra na tela
4. Adicionar botão "Ver Outro Exemplo"

**Arquivos:**
- `js/cases/casesUI.js` (novo)
- `css/cases.css` (novo)

**Layout do componente:**
```
┌─────────────────────────────────────┐
│ 💡 Aprenda na Prática               │
├─────────────────────────────────────┤
│ ## Entendendo S3                    │
│                                     │
│ O S3 é um serviço de armazenamento  │
│ de objetos...                       │
│                                     │
│ ## Cenário Prático                  │
│                                     │
│ Imagine que você precisa...         │
│                                     │
│ ## Como Fazer                       │
│                                     │
│ ```bash                             │
│ aws s3 mb s3://meu-bucket           │
│ ```                                 │
│                                     │
│ [Ver Outro Exemplo] [Entendi]       │
└─────────────────────────────────────┘
```

**Como testar:**
- [ ] Case aparece ao errar questão
- [ ] Markdown renderiza corretamente
- [ ] Código tem syntax highlight
- [ ] Botões funcionam

---

### Tarefa 2.5: Criar Query SQL para Análise de Gaps

**Dificuldade:** 🟡 Médio  
**Tempo:** 4 horas  
**Responsável:** Desenvolvedor Backend

**O que fazer:**
1. Criar arquivo `backend/analytics/gaps_analyzer.py`
2. Criar query SQL que:
   - Agrupa erros por domínio
   - Calcula taxa de erro
   - Identifica 3 domínios mais fracos
3. Retornar JSON com análise

**Arquivos:**
- `backend/analytics/gaps_analyzer.py` (novo)

**Exemplo de query:**
```sql
SELECT 
    q.domain,
    COUNT(*) as total_questions,
    SUM(CASE WHEN a.is_correct = false THEN 1 ELSE 0 END) as errors,
    ROUND(
        (SUM(CASE WHEN a.is_correct = false THEN 1 ELSE 0 END)::float / COUNT(*)) * 100,
        2
    ) as error_rate
FROM answers a
JOIN questions q ON a.question_id = q.id
WHERE a.user_id = %s
GROUP BY q.domain
ORDER BY error_rate DESC
LIMIT 3;
```

**Como testar:**
- [ ] Query retorna 3 domínios mais fracos
- [ ] Cálculo de taxa de erro está correto
- [ ] Funciona com diferentes usuários

---

### Tarefa 2.6: Criar Componente "O Que Estudar Agora"

**Dificuldade:** 🟢 Fácil  
**Tempo:** 3 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Criar arquivo `js/recommendations/studyNow.js`
2. Buscar análise de gaps da API
3. Mostrar card na sidebar com:
   - 3 domínios mais fracos
   - Taxa de erro de cada
   - Link para recursos de estudo
4. Atualizar após cada quiz

**Arquivos:**
- `js/recommendations/studyNow.js` (novo)
- `css/recommendations.css` (novo)

**Layout do card:**
```
┌─────────────────────────────────────┐
│ 📚 O Que Estudar Agora              │
├─────────────────────────────────────┤
│ Você precisa revisar:               │
│                                     │
│ 1. Segurança (45% de erro)          │
│    → Ver documentação AWS           │
│                                     │
│ 2. Faturamento (38% de erro)        │
│    → Ver documentação AWS           │
│                                     │
│ 3. Tecnologia (32% de erro)         │
│    → Ver documentação AWS           │
│                                     │
│ [Estudar Meus Pontos Fracos]        │
└─────────────────────────────────────┘
```

**Como testar:**
- [ ] Card aparece na sidebar
- [ ] Mostra domínios corretos
- [ ] Links funcionam
- [ ] Atualiza após quiz

---


## 🎮 SPRINT 3: Experiência (2 semanas)

**Objetivo:** Criar trilha visual e exportação de PDF

---

### Tarefa 3.1: Criar Componente SVG de Trilha

**Dificuldade:** 🔴 Difícil  
**Tempo:** 8 horas  
**Responsável:** Desenvolvedor Frontend com experiência em SVG

**O que fazer:**
1. Criar arquivo `js/gamificacao/trailSVG.js`
2. Substituir lista de módulos por trilha visual
3. Criar SVG com:
   - Nós (círculos) para cada módulo
   - Linhas conectando os nós
   - Ícones dentro dos nós
4. Adicionar estados:
   - Bloqueado (cinza)
   - Desbloqueado (laranja)
   - Completo (verde)

**Arquivos:**
- `js/gamificacao/trailSVG.js` (novo)
- `css/trail.css` (novo)

**Estrutura do SVG:**
```javascript
function createTrailSVG(stages) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 800 400");
    
    stages.forEach((stage, index) => {
        // Criar nó
        const circle = createNode(stage, index);
        svg.appendChild(circle);
        
        // Criar linha para próximo nó
        if (index < stages.length - 1) {
            const line = createLine(index, index + 1);
            svg.appendChild(line);
        }
    });
    
    return svg;
}
```

**Como testar:**
- [ ] Trilha renderiza corretamente
- [ ] Funciona em desktop e mobile
- [ ] Estados visuais estão corretos
- [ ] Clique nos nós funciona

---

### Tarefa 3.2: Implementar Animações de Desbloqueio

**Dificuldade:** 🟡 Médio  
**Tempo:** 4 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Adicionar animações CSS/JavaScript
2. Quando desbloquear módulo:
   - Linha se ilumina progressivamente
   - Nó pulsa
   - Confete cai (opcional)
3. Adicionar som de desbloqueio (opcional)

**Arquivos:**
- `css/trail-animations.css` (novo)
- `js/gamificacao/trailAnimations.js` (novo)

**Exemplo de animação:**
```css
@keyframes unlock-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.trail-node.unlocking {
    animation: unlock-pulse 0.5s ease-in-out;
}

@keyframes line-illuminate {
    from { stroke-dashoffset: 100; }
    to { stroke-dashoffset: 0; }
}

.trail-line.illuminating {
    animation: line-illuminate 1s ease-in-out;
}
```

**Como testar:**
- [ ] Animação roda ao desbloquear
- [ ] Animação é fluida (60fps)
- [ ] Não trava em dispositivos lentos

---

### Tarefa 3.3: Criar "Boss Battle" (Simulado Final)

**Dificuldade:** 🟡 Médio  
**Tempo:** 6 horas  
**Responsável:** Desenvolvedor Full Stack

**O que fazer:**
1. Criar modo especial para último módulo
2. Adicionar mecânicas diferentes:
   - 65 questões (simulado completo)
   - Timer de 90 minutos
   - Sem feedback imediato
   - Resultado só no final
3. Adicionar visual especial (tema escuro, música épica)

**Arquivos:**
- `js/modes/bossBattle.js` (novo)
- `css/boss-battle.css` (novo)

**Diferenças do modo normal:**
```javascript
const BOSS_BATTLE_CONFIG = {
    questions: 65,
    timeLimit: 90 * 60, // 90 minutos
    showFeedback: false, // Só no final
    passingScore: 70,
    theme: 'dark',
    music: 'epic-battle.mp3' // Opcional
};
```

**Como testar:**
- [ ] Modo ativa no último módulo
- [ ] 65 questões carregam
- [ ] Timer funciona
- [ ] Feedback só aparece no final
- [ ] Visual diferenciado funciona

---

### Tarefa 3.4: Integrar jsPDF + html2canvas

**Dificuldade:** 🟡 Médio  
**Tempo:** 3 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Instalar bibliotecas:
   ```bash
   npm install jspdf html2canvas
   ```
2. Criar arquivo `js/export/pdfGenerator.js`
3. Importar bibliotecas no HTML
4. Criar função básica de geração

**Arquivos:**
- `js/export/pdfGenerator.js` (novo)

**Exemplo de código:**
```javascript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Adicionar título
    pdf.setFontSize(20);
    pdf.text('Relatório de Desempenho', 20, 20);
    
    // Adicionar conteúdo
    pdf.setFontSize(12);
    pdf.text('Nome: João Silva', 20, 40);
    pdf.text('Certificação: CLF-C02', 20, 50);
    
    // Salvar
    pdf.save('relatorio.pdf');
}
```

**Como testar:**
- [ ] PDF é gerado sem erros
- [ ] Arquivo baixa corretamente
- [ ] Conteúdo está legível

---

### Tarefa 3.5: Adicionar Gráficos ao PDF

**Dificuldade:** 🔴 Difícil  
**Tempo:** 6 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Capturar gráfico radar como imagem
2. Adicionar imagem ao PDF
3. Ajustar tamanho e posição
4. Adicionar legenda

**Arquivos:**
- `js/export/pdfGenerator.js` (editar)

**Exemplo de código:**
```javascript
export async function generatePDFWithChart() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Capturar gráfico
    const canvas = document.getElementById('radarChart');
    const chartImage = await html2canvas(canvas);
    const imgData = chartImage.toDataURL('image/png');
    
    // Adicionar ao PDF
    pdf.addImage(imgData, 'PNG', 20, 60, 170, 100);
    
    pdf.save('relatorio.pdf');
}
```

**Como testar:**
- [ ] Gráfico aparece no PDF
- [ ] Imagem está nítida
- [ ] Tamanho está adequado
- [ ] Cores estão corretas

---

### Tarefa 3.6: Criar Template Profissional de PDF

**Dificuldade:** 🟡 Médio  
**Tempo:** 4 horas  
**Responsável:** Desenvolvedor Frontend com senso de design

**O que fazer:**
1. Criar layout profissional com:
   - Cabeçalho com logo
   - Informações do usuário
   - Resumo de performance
   - Gráfico radar
   - Análise por domínio
   - Recomendações de estudo
   - Rodapé com data
2. Usar cores do projeto (laranja AWS)

**Arquivos:**
- `js/export/pdfTemplate.js` (novo)

**Estrutura do PDF:**
```
┌─────────────────────────────────────┐
│ [LOGO]    Relatório de Desempenho   │
├─────────────────────────────────────┤
│ Nome: João Silva                    │
│ Certificação: AWS Cloud Practitioner│
│ Data: 20/05/2026                    │
├─────────────────────────────────────┤
│ RESUMO                              │
│ Pontuação: 750/1000                 │
│ Acertos: 45/65 (69%)                │
│ Status: Precisa Revisar             │
├─────────────────────────────────────┤
│ [GRÁFICO RADAR]                     │
├─────────────────────────────────────┤
│ ANÁLISE POR DOMÍNIO                 │
│ • Conceitos Cloud: 80%              │
│ • Segurança: 65%                    │
│ • Tecnologia: 70%                   │
│ • Faturamento: 60%                  │
├─────────────────────────────────────┤
│ RECOMENDAÇÕES                       │
│ Você precisa revisar:               │
│ 1. Faturamento e Preços             │
│ 2. Segurança e Compliance           │
└─────────────────────────────────────┘
```

**Como testar:**
- [ ] PDF está visualmente atraente
- [ ] Todas as seções aparecem
- [ ] Informações estão corretas
- [ ] Logo e cores estão corretos

---

### Tarefa 3.7: Implementar Filtro "Exportar Apenas Erros"

**Dificuldade:** 🟢 Fácil  
**Tempo:** 2 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Adicionar checkbox na tela de resultados
2. Filtrar questões erradas
3. Gerar PDF só com erros
4. Incluir explicações das respostas corretas

**Arquivos:**
- `js/export/pdfGenerator.js` (editar)

**Exemplo de filtro:**
```javascript
function filterMistakes(answers) {
    return answers.filter(answer => !answer.isCorrect);
}

export async function generateMistakesPDF() {
    const mistakes = filterMistakes(quizResults.answers);
    
    const pdf = new jsPDF();
    pdf.text('Questões que Você Errou', 20, 20);
    
    mistakes.forEach((mistake, index) => {
        pdf.text(`${index + 1}. ${mistake.question}`, 20, 40 + (index * 30));
        pdf.text(`Resposta correta: ${mistake.correctAnswer}`, 20, 50 + (index * 30));
    });
    
    pdf.save('meus-erros.pdf');
}
```

**Como testar:**
- [ ] Checkbox aparece na tela
- [ ] PDF contém apenas erros
- [ ] Explicações estão incluídas

---


## ✅ SPRINT 4: Validação (1 semana)

**Objetivo:** Testar com usuários e corrigir bugs

---

### Tarefa 4.1: Criar Ambiente de Staging

**Dificuldade:** 🟡 Médio  
**Tempo:** 3 horas  
**Responsável:** DevOps/Tech Lead

**O que fazer:**
1. Configurar servidor de staging (pode ser Vercel, Netlify, ou AWS)
2. Fazer deploy do MVP
3. Configurar banco de dados de teste
4. Criar URL de acesso

**Arquivos:**
- `.github/workflows/deploy-staging.yml` (novo)

**Como testar:**
- [ ] URL de staging funciona
- [ ] Aplicação carrega sem erros
- [ ] Banco de dados conecta

---

### Tarefa 4.2: Criar Formulário de Feedback

**Dificuldade:** 🟢 Fácil  
**Tempo:** 2 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Criar formulário simples com:
   - O que você achou? (1-5 estrelas)
   - O que você mais gostou?
   - O que pode melhorar?
   - Você usaria de novo? (Sim/Não)
2. Salvar respostas no banco ou Google Forms

**Arquivos:**
- `feedback.html` (novo)
- `js/feedback/feedbackForm.js` (novo)

**Layout do formulário:**
```
┌─────────────────────────────────────┐
│ 💬 Sua Opinião é Importante         │
├─────────────────────────────────────┤
│ Como você avalia o simulador?       │
│ ⭐⭐⭐⭐⭐                              │
│                                     │
│ O que você mais gostou?             │
│ [                                 ] │
│                                     │
│ O que pode melhorar?                │
│ [                                 ] │
│                                     │
│ Você usaria de novo?                │
│ ( ) Sim  ( ) Não                    │
│                                     │
│ [Enviar Feedback]                   │
└─────────────────────────────────────┘
```

**Como testar:**
- [ ] Formulário envia corretamente
- [ ] Dados são salvos
- [ ] Mensagem de confirmação aparece

---

### Tarefa 4.3: Recrutar Usuários Beta

**Dificuldade:** 🟢 Fácil  
**Tempo:** 2 horas  
**Responsável:** Product Owner/Tech Lead

**O que fazer:**
1. Criar lista de 10-15 pessoas para testar
2. Enviar convite por email/WhatsApp
3. Incluir:
   - Link do staging
   - Instruções de uso
   - Link do formulário de feedback
   - Prazo para testar (3 dias)

**Template de convite:**
```
Olá [Nome]!

Estamos desenvolvendo um simulador de certificação AWS e 
gostaríamos da sua ajuda para testar.

🔗 Link: https://staging.simulador-aws.com
📝 Feedback: https://forms.google.com/...

Por favor, teste até [data] e nos dê seu feedback.

Obrigado!
Equipe Simulador AWS
```

**Como testar:**
- [ ] Convites enviados
- [ ] Pessoas confirmaram recebimento
- [ ] Pelo menos 5 pessoas testaram

---

### Tarefa 4.4: Coletar e Analisar Feedback

**Dificuldade:** 🟢 Fácil  
**Tempo:** 3 horas  
**Responsável:** Product Owner + Tech Lead

**O que fazer:**
1. Esperar 3 dias para coleta
2. Compilar todos os feedbacks
3. Categorizar:
   - Bugs críticos (impedem uso)
   - Bugs menores (incomodam mas não impedem)
   - Melhorias de UX
   - Sugestões de features
4. Priorizar correções

**Arquivos:**
- `docs/FEEDBACK-USUARIOS.md` (novo)

**Exemplo de análise:**
```markdown
# Feedback dos Usuários Beta

## Resumo
- Total de testadores: 12
- Avaliação média: 4.2/5
- Taxa de conclusão: 75%

## Bugs Críticos
1. PDF não gera em Safari (3 relatos)
2. Timer trava após 30 min (2 relatos)

## Bugs Menores
1. Badge não aparece em mobile (1 relato)
2. Tooltip some rápido demais (2 relatos)

## Melhorias de UX
1. Botão "Próxima" muito pequeno (4 relatos)
2. Cores muito claras no modo escuro (2 relatos)

## Sugestões de Features
1. Modo offline (3 relatos)
2. Compartilhar resultado (2 relatos)
```

**Como testar:**
- [ ] Todos os feedbacks foram lidos
- [ ] Bugs foram categorizados
- [ ] Prioridades definidas

---

### Tarefa 4.5: Corrigir Bugs Críticos

**Dificuldade:** 🟡 Médio  
**Tempo:** 8 horas  
**Responsável:** Toda a equipe

**O que fazer:**
1. Pegar lista de bugs críticos
2. Dividir entre a equipe
3. Corrigir cada bug
4. Testar correção
5. Fazer deploy

**Arquivos:**
- Vários (depende dos bugs)

**Processo:**
```
Para cada bug:
1. Reproduzir o bug
2. Identificar causa raiz
3. Implementar correção
4. Testar localmente
5. Criar PR
6. Code review
7. Merge e deploy
```

**Como testar:**
- [ ] Todos os bugs críticos corrigidos
- [ ] Testes passando
- [ ] Usuários confirmam correção

---

### Tarefa 4.6: Implementar Melhorias de UX Rápidas

**Dificuldade:** 🟢 Fácil  
**Tempo:** 4 horas  
**Responsável:** Desenvolvedor Frontend

**O que fazer:**
1. Pegar melhorias de UX mais votadas
2. Implementar as mais simples:
   - Aumentar tamanho de botões
   - Ajustar cores
   - Melhorar tooltips
   - Adicionar loading states

**Arquivos:**
- `css/style.css` (editar)
- Vários arquivos JS (pequenas edições)

**Exemplo de melhorias:**
```css
/* Botão maior */
.btn-next {
    padding: 12px 24px; /* era 8px 16px */
    font-size: 16px; /* era 14px */
}

/* Modo escuro mais suave */
.dark {
    --bg-color: #1a1a2e; /* era #000 */
    --text-color: #e5e5e5; /* era #fff */
}

/* Tooltip mais duradouro */
.tooltip {
    transition-delay: 0.5s; /* era 0.2s */
}
```

**Como testar:**
- [ ] Melhorias implementadas
- [ ] Visual melhorou
- [ ] Usuários aprovam mudanças

---

### Tarefa 4.7: Preparar Apresentação para Cliente

**Dificuldade:** 🟢 Fácil  
**Tempo:** 4 horas  
**Responsável:** Tech Lead + Product Owner

**O que fazer:**
1. Criar slides (PowerPoint ou Google Slides)
2. Incluir:
   - Problema que resolvemos
   - Solução (nosso MVP)
   - Demo ao vivo
   - Resultados dos testes
   - Próximos passos
3. Ensaiar apresentação

**Arquivos:**
- `docs/APRESENTACAO-CLIENTE.pptx` (novo)

**Estrutura dos slides:**
```
Slide 1: Capa
- Título: Simulador AWS Cloud Practitioner
- Subtítulo: MVP - Versão 1.0
- Data e equipe

Slide 2: O Problema
- Estudar para certificação é difícil
- Simuladores existentes são caros ou ruins
- Falta feedback prático

Slide 3: Nossa Solução
- Questões validadas por especialistas
- Cases práticos ao errar
- Análise inteligente de gaps
- Gamificação engajadora

Slide 4: Demo ao Vivo
[Fazer demo do sistema]

Slide 5: Resultados dos Testes
- 12 usuários testaram
- 4.2/5 de avaliação
- 75% completaram um quiz
- Feedback positivo

Slide 6: Próximos Passos
- Adicionar mais certificações
- Leaderboard real
- Mobile app
- Comunidade

Slide 7: Perguntas
```

**Como testar:**
- [ ] Slides estão claros e bonitos
- [ ] Demo funciona perfeitamente
- [ ] Apresentação cabe em 30 minutos
- [ ] Equipe ensaiou 2x

---


## 📊 Resumo das Tarefas

### Por Sprint

| Sprint | Tarefas | Tempo Total | Dificuldade Média |
|--------|---------|-------------|-------------------|
| Sprint 0 | 5 tarefas | 1 semana | 🟢 Fácil |
| Sprint 1 | 5 tarefas | 2 semanas | 🟡 Médio |
| Sprint 2 | 6 tarefas | 2 semanas | 🟡 Médio |
| Sprint 3 | 7 tarefas | 2 semanas | 🔴 Difícil |
| Sprint 4 | 7 tarefas | 1 semana | 🟢 Fácil |
| **TOTAL** | **30 tarefas** | **8 semanas** | 🟡 Médio |

---

### Por Dificuldade

- 🟢 **Fácil:** 12 tarefas (40%)
- 🟡 **Médio:** 15 tarefas (50%)
- 🔴 **Difícil:** 3 tarefas (10%)

---

### Por Área

| Área | Tarefas | Percentual |
|------|---------|------------|
| Frontend | 12 tarefas | 40% |
| Backend | 10 tarefas | 33% |
| DevOps | 3 tarefas | 10% |
| Design/UX | 3 tarefas | 10% |
| Gestão | 2 tarefas | 7% |

---

## 🎯 Tarefas Prioritárias (Faça Primeiro!)

Se você está começando agora, comece por estas tarefas:

### Para Estagiários Frontend:
1. **Tarefa 0.2** - Criar Templates de Issues (🟢 Fácil, 30 min)
2. **Tarefa 1.5** - Adicionar Badge "Validado" (🟢 Fácil, 2h)
3. **Tarefa 2.6** - Componente "O Que Estudar" (🟢 Fácil, 3h)
4. **Tarefa 3.7** - Filtro "Exportar Erros" (🟢 Fácil, 2h)

### Para Estagiários Backend:
1. **Tarefa 0.5** - Documentar Padrões de Commit (🟢 Fácil, 1h)
2. **Tarefa 1.1** - Criar Schema PostgreSQL (🟡 Médio, 4h)
3. **Tarefa 2.3** - Detecção de Serviços AWS (🟡 Médio, 3h)
4. **Tarefa 2.5** - Query de Análise de Gaps (🟡 Médio, 4h)

### Para Desenvolvedores Sênior:
1. **Tarefa 1.3** - API FastAPI (🟡 Médio, 8h)
2. **Tarefa 2.1** - Configurar MCP (🔴 Difícil, 4h)
3. **Tarefa 3.1** - Trilha SVG (🔴 Difícil, 8h)
4. **Tarefa 3.5** - Gráficos no PDF (🔴 Difícil, 6h)

---

## 🤝 Como Trabalhar em Equipe

### Regras de Ouro

1. **Nunca edite o mesmo arquivo ao mesmo tempo**
   - Antes de começar, avise no grupo: "Vou mexer no arquivo X"
   - Se alguém já está mexendo, escolha outra tarefa

2. **Faça commits pequenos e frequentes**
   - Não acumule 500 linhas de código
   - Commit a cada funcionalidade pequena
   - Use mensagens claras: `feat: adicionar validação de questões`

3. **Peça code review**
   - Nunca faça merge direto na main
   - Sempre crie Pull Request
   - Peça para alguém revisar seu código

4. **Teste antes de fazer PR**
   - Rode o projeto localmente
   - Teste a funcionalidade 3x
   - Verifique se não quebrou nada

5. **Documente o que fizer**
   - Adicione comentários no código
   - Atualize o README se necessário
   - Explique decisões técnicas no PR

---

## 🆘 Quando Pedir Ajuda

### Peça ajuda se:
- ❌ Está travado há mais de 2 horas
- ❌ Não entendeu o que a tarefa pede
- ❌ Quebrou algo e não sabe consertar
- ❌ Precisa de acesso/permissão
- ❌ Não sabe qual tecnologia usar

### Não peça ajuda se:
- ✅ Ainda não tentou pesquisar no Google
- ✅ Não leu a documentação
- ✅ Não tentou debugar
- ✅ Está com preguiça de pensar

### Como pedir ajuda:
```
❌ Ruim: "Não tá funcionando, me ajuda?"

✅ Bom: 
"Estou na tarefa 1.3 (API FastAPI).
Tentei criar o endpoint GET /api/questions mas está dando erro 500.
Já tentei:
- Verificar conexão com banco (OK)
- Testar query SQL direto (funciona)
- Adicionar logs (não aparece nada)

Erro: [colar erro aqui]
Código: [link do arquivo]

Alguém pode me ajudar?"
```

---

## 📚 Recursos Úteis

### Documentação Oficial
- [PostgreSQL](https://www.postgresql.org/docs/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React (se usar)](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Chart.js](https://www.chartjs.org/docs/)

### Tutoriais Recomendados
- [PostgreSQL para Iniciantes](https://www.postgresqltutorial.com/)
- [FastAPI em 30 minutos](https://fastapi.tiangolo.com/tutorial/)
- [SVG para Desenvolvedores](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
- [Git e GitHub](https://www.youtube.com/watch?v=UBAX-13g8OM)

### Ferramentas
- [DB Browser for SQLite](https://sqlitebrowser.org/) - Ver banco de dados
- [Postman](https://www.postman.com/) - Testar APIs
- [VS Code](https://code.visualstudio.com/) - Editor de código
- [GitHub Desktop](https://desktop.github.com/) - Git visual

---

## ✅ Checklist Diário

Use este checklist todo dia antes de começar a trabalhar:

### Manhã (Antes de Começar)
- [ ] Puxei as últimas mudanças do repositório (`git pull`)
- [ ] Li as mensagens do grupo
- [ ] Sei qual tarefa vou fazer hoje
- [ ] Movi a tarefa para "Em Progresso" no board
- [ ] Avisei no grupo que vou mexer no arquivo X

### Durante o Trabalho
- [ ] Estou fazendo commits pequenos
- [ ] Estou testando conforme desenvolvo
- [ ] Estou documentando o código
- [ ] Pedi ajuda quando travei

### Fim do Dia
- [ ] Fiz commit de tudo que fiz
- [ ] Testei a funcionalidade completa
- [ ] Atualizei o status da tarefa
- [ ] Avisei no grupo o que consegui fazer
- [ ] Se terminei, criei Pull Request

---

## 🎓 Dicas para Estagiários

### 1. Não tenha medo de errar
- Todo mundo erra, até os sêniors
- Erro é parte do aprendizado
- O importante é aprender com o erro

### 2. Pergunte "por quê?"
- Não faça algo só porque mandaram
- Entenda o motivo de cada decisão
- Isso vai te tornar um desenvolvedor melhor

### 3. Leia código dos outros
- Veja como os sêniors resolvem problemas
- Aprenda padrões e boas práticas
- Copie o que é bom, melhore o que é ruim

### 4. Teste muito
- Não confie que "deve estar funcionando"
- Teste em diferentes navegadores
- Teste em mobile
- Teste casos extremos

### 5. Documente tudo
- Seu "eu do futuro" vai agradecer
- Outros desenvolvedores vão agradecer
- Você vai parecer mais profissional

### 6. Gerencie seu tempo
- Use Pomodoro (25 min foco + 5 min pausa)
- Não fique 8h seguidas programando
- Faça pausas para descansar a mente

### 7. Celebre pequenas vitórias
- Terminou uma tarefa? Comemore!
- Corrigiu um bug difícil? Compartilhe!
- Aprendeu algo novo? Ensine alguém!

---

## 🚀 Vamos Começar!

Agora que você leu tudo, está pronto para começar!

**Próximos passos:**
1. Escolha uma tarefa do seu nível
2. Leia a descrição com atenção
3. Avise no grupo que vai fazer
4. Mova para "Em Progresso"
5. Comece a programar!

**Lembre-se:**
- 💪 Você é capaz!
- 🤝 A equipe está aqui para ajudar
- 🎯 Foco no MVP, não na perfeição
- 🚀 Vamos construir algo incrível juntos!

---

**Boa sorte e bom código! 🎉**

---

## 📞 Contatos da Equipe

**Tech Lead:** [Nome] - [Email/Slack]  
**Product Owner:** [Nome] - [Email/Slack]  
**DevOps:** [Nome] - [Email/Slack]  

**Grupo no Slack/Discord:** #simulador-aws  
**Reuniões Diárias:** 9h30 (15 minutos)  
**Reunião de Sprint:** Sexta-feira 16h

---

**Documento criado em:** 2026-05-20  
**Última atualização:** 2026-05-20  
**Versão:** 1.0
