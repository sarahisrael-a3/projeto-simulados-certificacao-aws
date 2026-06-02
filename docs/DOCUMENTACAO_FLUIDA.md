# 📖 PARTE 2: DOCUMENTAÇÃO FLUIDA E DIDÁTICA

> **Para estagiários e pessoas que nunca viram este código antes**

---

## 📌 ÍNDICE RÁPIDO

1. [Visão Geral](#1-visão-geral-o-que-este-projeto-faz)
2. [Frontend](#2-frontend-as-telas-e-componentes)
3. [Backend](#3-backend-o-servidor-e-a-api)
4. [Validação de Questões](#4-validação-de-questões-regras-de-negócio)
5. [Dados](#5-dados-como-a-informação-flui)
6. [Atualização e Manutenção](#6-atualização-e-manutenção-rodar-e-testar)

---

# 1. VISÃO GERAL: O QUE ESTE PROJETO FAZ

## Em Uma Frase

🎯 **Uma plataforma de estudo interativa e colaborativa para ajudar pessoas a passar em certificações AWS, usando inteligência artificial para gerar questões e acompanhar o progresso dos usuários.**

## Entendendo o Projeto em 3 Camadas

Imagine este projeto como um edifício de 3 andares:

```
┌─────────────────────────────────────────┐
│  📱 CAMADA 1: INTERFACE DO USUÁRIO       │  ← O que você vê
│  (Aplicativo PWA - Telas, Botões, etc)  │
└─────────────────────────────────────────┘
                    ↕️ (comunica)
┌─────────────────────────────────────────┐
│  ⚙️ CAMADA 2: LÓGICA E PROCESSAMENTO     │  ← O que faz acontecer
│  (Mecanismo de Quiz, Validação, etc)    │
└─────────────────────────────────────────┘
                    ↕️ (armazena)
┌─────────────────────────────────────────┐
│  📊 CAMADA 3: DADOS E ARMAZENAMENTO      │  ← Onde tudo é guardado
│  (Questões em JSON, Cache, etc)         │
└─────────────────────────────────────────┘
```

## O que Cada Parte Faz

### 🎮 **A Experiência do Usuário**
Você acessa o site, vê:
- ✅ Uma lista de exames para escolher (CLF-C02, SAA-C03, DVA-C02, AIF-C01)
- ✅ Um simulado com cronômetro (tempo real como na prova)
- ✅ Questões com 4 opções de resposta
- ✅ Gráficos mostrando seu desempenho
- ✅ Cards (flashcards) para revisar rápido
- ✅ Modo Pomodoro para estudar em sprints
- ✅ Tudo funciona **offline** (não precisa de internet depois que carrega)

### 🧠 **A Inteligência do Sistema**
Por trás das cortinas:
- 🤖 **IA Generativa:** Google Gemini + Groq geram novas questões automaticamente
- 📐 **Validação Semântica:** Scripts verificam se as questões fazem sentido
- 🔍 **Deduplicação:** Sistema evita questões repetidas
- 📊 **Analytics:** Analisa seu progresso e recomenda ações
- 🎯 **Gamificação:** Badges, sprints, trails para motivar

### 💾 **O Armazenamento**
- **Questões:** ~2.000 questões em JSON (organizadas por certificação)
- **Seu Progresso:** Salvo no `localStorage` do navegador (bem rápido)
- **Banco de Dados Futuro:** PGLite para validadores aprovarem questões novas

---

# 2. FRONTEND: AS TELAS E COMPONENTES

> **"Aquele código que faz coisas aparecerem na tela"**

## Onde Fica na Estrutura

```
src/frontend/
├── js/                    ← Todo JavaScript
│   ├── app.js             ← Ponto de entrada (inicia tudo)
│   ├── core/              ← Motor principal
│   │   ├── quizEngine.js  ← Lógica do quiz
│   │   ├── storageManager.js ← Salva dados locais
│   │   └── timerManager.js   ← Cronômetro
│   │
│   ├── features/          ← Funcionalidades extras
│   │   ├── gamificacao/   ← Badges, leaderboard, etc
│   │   ├── modes/         ← Flashcards, Pomodoro
│   │   └── analytics/     ← Gráficos e relatórios
│   │
│   └── i18n/              ← Tradução (PT/EN)
│
├── styles/                ← CSS (beleza)
│   ├── main.css
│   ├── gamificacao.css
│   └── responsive.css
│
└── index.html             ← A página principal
```

## Como o Frontend Funciona (Fluxo)

```
1. Usuário acessa index.html
                ↓
2. Navegador carrega app.js
                ↓
3. app.js procura dados em localStorage
                ↓
4. Se não existir, carrega de data/questoes/*.json
                ↓
5. Mostra a tela de seleção de exame
                ↓
6. Usuário clica em "Começar Simulado"
                ↓
7. quizEngine.js:
   - Embaralha questões
   - Inicia timer
   - Renderiza primeira questão
                ↓
8. Usuário responde
                ↓
9. storageManager.js salva resposta no localStorage
                ↓
10. App calcula pontuação e mostra próxima
                ↓
11. Fim do simulado → chartManager.js desenha gráficos
```

## Os Arquivos Mais Importantes (Front)

| Arquivo | Faz O Quê | Use Quando |
|---------|-----------|-----------|
| `app.js` | Inicializa a aplicação | Quer entender como tudo começa |
| `quizEngine.js` | Lógica de quiz (embaralha, valida respostas) | Quer mudar regras do simulado |
| `storageManager.js` | Salva/carrega dados do navegador | Quer armazenar algo novo |
| `chartManager.js` | Desenha gráficos de desempenho | Quer visualizar dados diferente |
| `flashcards.js` | Interface de cartões interativos | Quer criar novo modo de estudo |
| `translations.js` | Textos em português/inglês | Quer adicionar novo idioma |

### 💡 **Como É Comunicação Frontend?**

Todo o front fala através de **funções JavaScript** bem organizadas:

```javascript
// Arquivo: src/frontend/js/app.js
import { initQuiz } from './core/quizEngine.js';
import { saveProgress } from './core/storageManager.js';

// Quando usuário clica em "Começar"
document.getElementById('startBtn').addEventListener('click', () => {
    const selectedExam = 'clf-c02';
    
    // ← Inicia o quiz
    initQuiz(selectedExam);
    
    // ← Salva que o usuário começou
    saveProgress({ exam: selectedExam, startTime: Date.now() });
});
```

---

# 3. BACKEND: O SERVIDOR E A API

> **"Aquele código que faz coisas acontecerem nos bastidores"**

## Estrutura do Backend

```
src/backend/
├── server.js              ← Inicia servidor Node.js
├── database/
│   ├── db.js              ← Conecta ao PGLite
│   ├── schema.sql         ← Estrutura do banco
│   └── socketServer.js    ← Conexão em tempo real
└── api/                   ← (Futuro) Rotas REST
```

## O Backend Faz Duas Coisas Principais

### 1️⃣ **Gerencia o PGLite** (Banco de Dados)

```javascript
// Arquivo: src/backend/database/db.js

import { PGlite } from '@electric-sql/pglite';

// Conecta ao banco em memória
const db = new PGlite();

// Cria tabelas
async function initializeDatabase() {
    await db.sql`
        CREATE TABLE IF NOT EXISTS questions (
            id SERIAL PRIMARY KEY,
            domain VARCHAR(100) NOT NULL,
            text TEXT NOT NULL,
            correct_answer CHAR(1) NOT NULL
        );
    `;
}

// Busca questões
async function getQuestions(certId) {
    const result = await db.sql`
        SELECT * FROM questions WHERE domain = ${certId}
    `;
    return result.rows;
}
```

**Para Quê Serve?**
- ✅ Guardar questões que validadores aprovam
- ✅ Rastrear quem validou o quê
- ✅ Criar relatórios de qualidade

### 2️⃣ **Valida Questões Novas** (Será módulo REST)

Quando alguém contribui uma questão nova, o backend:
1. Recebe pelo HTTP
2. Verifica se está correta (usando validadores)
3. Aprova ou rejeita
4. Guarda o resultado

---

# 4. VALIDAÇÃO DE QUESTÕES: REGRAS DE NEGÓCIO

> **"Os segredos para uma boa questão"**

## ⚠️ O PROBLEMA QUE RESOLVEMOS

Sabe aquele teste ruim na escola? Aquele onde:
- ❌ Duas alternativas significam a mesma coisa
- ❌ A resposta correta é óbvia demais
- ❌ Uma questão que já vimos antes
- ❌ Linguagem confusa ou termos errados

**Isto NÃO pode acontecer aqui.** Por isso temos **validação rigorosa**.

## 📋 AS REGRAS DE NEGÓCIO (Leia Com Atenção!)

### Regra 1: **Estrutura Obrigatória**

Toda questão **DEVE** ter:

```json
{
  "id": "unique-identifier",
  "domain": "Cloud Concepts",          // Uma das 4 certificações
  "difficulty": "intermediate",         // easy, intermediate, hard
  "text": "O que é uma VPC?",           // Pergunta clara e objetiva
  "options": {
    "A": "Uma..." ,
    "B": "Uma...",
    "C": "Uma...",
    "D": "Uma..."
  },
  "correct_answer": "B",               // SEMPRE uma letra
  "explanation": "Uma VPC é...",       // Por que B é correto
  "source": "AWS Documentation",       // De onde veio
  "created_at": "2026-06-02T10:00:00Z"
}
```

**Se faltar algo → REJEITADA** ❌

### Regra 2: **Sem Pegadinhas Fracas**

🚫 **Não pode:**
- Usar truques gramaticais para enganar
- "Qual é o **melhor**?" (melhor é subjetivo!)
- Misturar dois tópicos na mesma pergunta

✅ **Deve:**
- Ser testável com fatos técnicos
- Ter UMA única resposta correta inequívoca
- Usar linguagem clara e profissional

**Exemplo BAD:**
```
P: Qual AWS service é "mais rápido"?
A) EC2
B) Lambda
C) S3
D) DynamoDB

❌ RUIM: "Mais rápido" é vago. Em qual contexto?
```

**Exemplo GOOD:**
```
P: Qual AWS service oferece execução de código 
   sem gerenciar servidores?
A) EC2
B) Lambda         ← CORRETO e inequívoco
C) RDS
D) S3
```

### Regra 3: **Sem Duplicatas**

Sistema compara questões novas com as existentes usando:
- ✅ Similaridade de texto (string matching)
- ✅ Comparação de opcões
- ✅ Análise semântica

**Se detectar cópia → REJEITADA** ❌

**Exemplo:**

```
Questão A (existente):
"O que AWS Lambda permite?"
A) ...
B) ...
C) ...
D) ...

Questão B (nova - SERÁ REJEITADA):
"O que o AWS Lambda oferece?"  ← Texto muito similar
A) ...
B) ...
C) ...
D) ...

❌ Detecta como duplicata (90% similaridade)
```

### Regra 4: **Dificuldade Apropriada**

Toda questão tem nível:

| Level | Quando Usar | Exemplo |
|-------|------------|---------|
| **Easy** | Conceitos fundamentais | "O que é AWS?" |
| **Intermediate** | Aplicação prática | "Como integrar Lambda com API Gateway?" |
| **Hard** | Arquitetura complexa | "Descrever padrão multi-region com failover" |

**Deve estar** balanceado:
- 30% Easy
- 50% Intermediate
- 20% Hard

**Se desbalanceado → AVISO** ⚠️

### Regra 5: **Múltipla Resposta (Quando Apropriado)**

Algumas questões permite **várias respostas corretas**:

```json
{
  "text": "Quais são benefícios do AWS CloudFront?",
  "type": "multiple_answer",
  "correct_answers": ["A", "C"],  ← DUAS estão certas
  "options": {
    "A": "Reduz latência",          ← ✅
    "B": "Armazena dados",          ← ❌
    "C": "Distribui globalmente",   ← ✅
    "D": "Computa funções"          ← ❌
  }
}
```

**Cuidado:** Não abuse! Só use quando a prova real usa.

### Regra 6: **Fonte e Rastreabilidade**

Toda questão **DEVE** ter fonte:

```json
{
  "source": "AWS Certified Cloud Practitioner Exam Guide v2.3",
  "source_url": "https://...",
  "created_by": "karlarenatadev",
  "reviewed_by": "otto.jacometo",
  "created_at": "2026-06-02T10:00:00Z"
}
```

**Por quê?** Rastreabilidade legal e académica.

---

## 🔄 O FLUXO DE VALIDAÇÃO

```
1. CONTRIBUIDOR submete questão (via PR)
                ↓
2. VALIDADOR SEMÂNTICO (Script Python)
   ✓ Verifica estrutura JSON
   ✓ Checa tamanho do texto (>20, <500 chars)
   ✓ Valida opciones (A-D, não vazias)
   ✓ Compara com duplicatas
                ↓
3. VALIDADOR ESPECIALISTA (Pessoa)
   ✓ Valida tecnicamente
   ✓ Checa se pergunta faz sentido
   ✓ Aprova ou pede mudanças
                ↓
4. ✅ APROVADA ou ❌ REJEITADA
                ↓
5. Se aprovada → Entra no banco de dados
   Se rejeitada → Comentário explicando por quê
```

---

## ⚠️ ATENÇÃO: ERROS COMUNS QUE INVALIDAM

```javascript
// ❌ ERRO 1: Falta estrutura
{
  "question": "O que é VPC?",    // Campo errado! Deve ser "text"
  "alternatives": [...]          // Deve ser "options"
}

// ❌ ERRO 2: Resposta duplicada
{
  "options": {
    "A": "Uma VPC é...",
    "B": "Uma VPC é...",          // IDÊNTICO A 'A'!
    "C": "...",
    "D": "..."
  }
}

// ❌ ERRO 3: Resposta correta não existe
{
  "correct_answer": "E",          // Mas só temos A, B, C, D!
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." }
}

// ❌ ERRO 4: Múltipla sem indicar
{
  "correct_answers": ["A", "B"],  // Mas type não é "multiple_answer"
  "type": "single_answer"         // CONFLITO!
}
```

**Regra de Ouro:** Se duvidou, teste antes com `validate_contribution.py`:
```bash
python src/python/validation/validate_contribution.py \
  data/contributions/clf-c02/minha-questao.json
```

---

# 5. DADOS: COMO A INFORMAÇÃO FLUI

> **"O caminho que uma questão faz desde a criação até você responder"**

## 📊 A Estrutura dos Dados

```
data/
├── questoes/                    ← Questões finalizadas (IMUTÁVEL)
│   ├── clf-c02.json            (660 questões em PT)
│   ├── clf-c02-en.json         (660 questões em EN)
│   ├── saa-c03.json
│   ├── saa-c03-en.json
│   ├── dva-c02.json
│   ├── dva-c02-en.json
│   ├── aif-c01.json
│   └── aif-c01-en.json
│
├── diagnostico/                 ← Testes de nivelamento
│   ├── diagnostic-clf-c02.json
│   ├── diagnostic-clf-c02-en.json
│   └── ... (um para cada cert)
│
├── gamificacao/                 ← Desafios interativos
│   └── interactive-challenges.json
│
└── contributions/               ← Questões em aprovação
    ├── clf-c02/
    ├── saa-c03/
    ├── dva-c02/
    └── aif-c01/
```

## 📈 O FLUXO DE UMA QUESTÃO

### Fase 1: Geração (Pipeline Python)

```
🤖 Google Gemini
   ↓
   "Gere 10 questões sobre EC2"
   ↓
📝 generator.py (orquestra)
   ↓
🔍 aws_semantic_validator.py
   ✓ Verifica linguagem técnica
   ✓ Valida termos AWS reais
   ↓
🆚 duplicate_detector.py
   ✓ Compara com 2000 questões existentes
   ↓
💾 JSON estruturado
   ↓
   data/questoes/clf-c02.json
```

### Fase 2: Contribuição (GitHub)

```
👤 Contribuidor
   ↓
   Cria arquivo:
   data/contributions/clf-c02/minha-questao.json
   ↓
   Abre PR no GitHub
   ↓
🤖 GitHub Actions
   ✓ Executa validate_contribution.py
   ✓ Se OK → Aprova automaticamente
   ✓ Se BAD → Pede correção
   ↓
👨‍💼 Revisor (pessoa)
   ✓ Verifica se tecnicamente correto
   ↓
✅ APROVADO → Merge na main
```

### Fase 3: Você Respondendo (Frontend)

```
1. Navegador carrega data/questoes/clf-c02.json
   ↓
2. JavaScript embaralha as questões
   ↓
3. storageManager.js salva em localStorage
   ↓
4. Você responde ("Clico em B")
   ↓
5. quizEngine.js valida:
   ✓ Resposta correta? Soma +1 ponto
   ✓ Errada? Soma +0, mostra explicação
   ↓
6. chartManager.js atualiza gráfico
   ↓
7. Fim do simulado:
   ✓ Mostra score
   ✓ Recomenda áreas fracas
   ✓ Propõe próximos passos
```

## 📦 Anatomia de Uma Questão (JSON)

```json
{
  "id": "clf-c02-2024-001",
  
  "domain": "Cloud Concepts",
  "subdomain": "AWS Regions and AZs",
  
  "difficulty": "easy",
  "type": "single_answer",
  
  "text": "Uma Região AWS é melhor descrita como:",
  
  "options": {
    "A": "Um único data center conectado por fibra óptica",
    "B": "Uma área geográfica que contém múltiplas Zonas de Disponibilidade",
    "C": "Um conjunto de servidores em um único edifício",
    "D": "Uma conexão de rede entre dois data centers"
  },
  
  "correct_answer": "B",
  
  "explanation": "Uma Região AWS é uma área geográfica isolada que contém múltiplas Zonas de Disponibilidade. Cada AZ é um data center isolado com sua própria infraestrutura de alimentação e resfriamento. A Região B é a resposta correta porque oferece redundância e alta disponibilidade.",
  
  "tags": ["regions", "availability-zones", "infrastructure"],
  
  "source": "AWS Certification Exam",
  "source_url": "https://aws.amazon.com/training/",
  
  "created_by": "karlarenatadev",
  "created_at": "2026-06-02T10:00:00Z",
  "updated_at": "2026-06-02T10:00:00Z",
  
  "metadata": {
    "pass_rate": 87.3,
    "average_time_seconds": 15,
    "attempts": 243,
    "reported_errors": 0,
    "quality_score": 9.2
  }
}
```

## 🔄 Como os Dados Viajam

```
API Fetch
│
├─ src/frontend/js/app.js (solicita)
│  ↓
├─ data/questoes/clf-c02.json (responde)
│  ↓
├─ JSON parseado em JavaScript
│  ↓
├─ storageManager.js (salva em localStorage)
│  ↓
├─ Browser Local Storage (persiste)
│  ↓
├─ quizEngine.js (usa para renderizar)
│  ↓
├─ HTML renderizado na tela
│  ↓
└─ Usuário vê e responde!
```

---

# 6. ATUALIZAÇÃO E MANUTENÇÃO: RODAR E TESTAR

> **"Como fazer o projeto funcionar no seu computador"**

## 🚀 SETUP INICIAL (Primeira Vez)

### Passo 1: Clone o Repositório

**Windows (PowerShell):**
```powershell
git clone https://github.com/karlarenatadev/projeto-simulados-certificacao-aws.git
cd projeto-simulados-certificacao-aws
```

**Mac/Linux:**
```bash
git clone https://github.com/karlarenatadev/projeto-simulados-certificacao-aws.git
cd projeto-simulados-certificacao-aws
```

### Passo 2: Instale Dependências

```bash
# Instala Node.js + npm (se não tiver)
# Depois:
npm install
```

### Passo 3: Configure Variáveis de Ambiente

```bash
# Copie o template
cp .env.example .env

# Abra .env e adicione suas chaves:
# GEMINI_API_KEY=sua-chave-aqui
# (Obtenha em https://makersuite.google.com/)
```

### Passo 4: Rode o Projeto

```bash
# Terminal 1: Inicia o banco de dados
npm run db:start

# Terminal 2: Inicia servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:8000
```

## 🧪 TESTANDO (Verificar se Tudo Funciona)

### Teste 1: Linters e Formatação

```bash
# Verifica se código está correto
npm run lint

# Corrige problemas automáticos
npm run lint:fix

# Formata código (prettier)
npm run format
```

### Teste 2: Testes Unitários

```bash
# Executa todos os testes
npm run test

# Modo watch (re-executa ao salvar)
npm run test:watch

# Esperado: ✓ Todos os testes passando
```

### Teste 3: Manualmente no Navegador

1. Acesse `http://localhost:8000`
2. Selecione uma certificação (ex: CLF-C02)
3. Clique "Começar Simulado"
4. Responda 3-5 questões
5. Verifique:
   - ✅ Cronômetro funciona?
   - ✅ Respostas são salvas?
   - ✅ Score está correto?
   - ✅ Funciona offline (despluga internet)?

### Teste 4: Validar Questão Nova

```bash
# Crie uma questão teste
cp data/contributions/_TEMPLATE.json \
   data/contributions/clf-c02/teste.json

# Edite o arquivo com uma questão

# Valide
python src/python/validation/validate_contribution.py \
  data/contributions/clf-c02/teste.json

# Esperado:
# ✓ Válida!
# ✓ Sem duplicatas
# ✓ Estrutura OK
```

---

## 📝 PRINCIPAIS COMANDOS (Referência Rápida)

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de dev
npm run db:start         # Inicia PGLite
npm run lint             # Checa código
npm run test             # Executa testes

# Build & Deploy
npm run build            # Compila para produção
npm run deploy           # Faz deploy

# Python (Geração de Questões)
cd src/python
python pipeline/auto_generate_questions.py clf-c02 --quantity 10
python validation/validate_contribution.py <arquivo>

# Git & GitHub
git checkout -b minha-feature
git add .
git commit -m "feat: descrição da mudança"
git push origin minha-feature
# Depois abra PR no GitHub
```

---

## ⚠️ ERROS COMUNS E SOLUÇÕES

### Erro: `npm run dev` não funciona

```
❌ Error: Cannot find module...
```

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: Questões não carregam

```
❌ GET /data/questoes/clf-c02.json 404
```

**Solução:** Verifique se estrutura de pastas está correta:
```bash
ls data/questoes/
# Deve listar:
# aif-c01.json
# clf-c02.json
# dva-c02.json
# saa-c03.json
```

### Erro: localStorage cheio

```
❌ QuotaExceededError: localStorage quota exceeded
```

**Solução:** Limpe cache:
```javascript
// No console do navegador:
localStorage.clear();
location.reload();
```

### Erro: Teste falha

```
❌ FAIL  __tests__/quizEngine.test.js
```

**Solução:** Verifique se arquivo existe e jest.config.js aponta certo:
```bash
npm run test -- --verbose
```

---

## 📚 REFERÊNCIAS RÁPIDAS

### Arquivos Principais Para Estudar

1. **Quer entender o início?**
   → Leia `src/frontend/js/app.js`

2. **Quer entender quiz?**
   → Leia `src/frontend/js/core/quizEngine.js`

3. **Quer entender dados?**
   → Abra `data/questoes/clf-c02.json`

4. **Quer entender geração IA?**
   → Leia `src/python/pipeline/generator.py`

5. **Quer entender validação?**
   → Leia `src/python/validation/aws_semantic_validator.py`

### Documentação Completa

- 📖 [Guia Completo](docs/GUIA-COMPLETO.md)
- 🏛️ [Arquitetura](docs/ARQUITETURA.md)
- 🤝 [Como Contribuir](CONTRIBUTING.md)
- 🚀 [Roadmap](docs/roadmap.md)

---

## 🎯 PRÓXIMAS AÇÕES PARA INICIANTES

Se você é novo no projeto:

1. **Semana 1:** Clone, rode localmente, entenda fluxo
2. **Semana 2:** Leia `quizEngine.js` e `storageManager.js`
3. **Semana 3:** Crie uma questão teste e valide
4. **Semana 4:** Faça sua primeira contribuição (PR)

---

## 📞 PRECISA DE AJUDA?

- 🐙 **GitHub Issues:** [Abra um issue](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/issues)
- 💬 **Discussions:** [Participe das discussões](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/discussions)
- 📧 **Email:** Verifique CONTRIBUTING.md para contato

---

**Parabéns! Você agora entende este projeto como um todo.** 🎉

Próximo passo: Mergulhe no código e divirta-se contribuindo! 🚀
