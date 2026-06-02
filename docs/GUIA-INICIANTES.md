# 🎓 GUIA COMPLETO PARA INICIANTES

> **Para Estagiários e Pessoas Novas no Projeto**
> 
> Um guia didático e acolhedor que cobre TUDO que você precisa saber para começar a contribuir.

---

## 📍 VOCÊ ESTÁ AQUI

```
┌─────────────────────────────────┐
│ 🎓 GUIA COMPLETO (Você aqui)     │  ← Comece por aqui!
├─────────────────────────────────┤
│ 1️⃣ VISÃO GERAL                  │
│ 2️⃣ FRONTEND                     │
│ 3️⃣ BACKEND                      │
│ 4️⃣ VALIDAÇÃO DE QUESTÕES        │
│ 5️⃣ DADOS                        │
│ 6️⃣ ATUALIZAÇÃO E MANUTENÇÃO     │
└─────────────────────────────────┘
```

---

# 1️⃣ VISÃO GERAL

## O que é este projeto?

**Cloud Certification Study Tool** é uma plataforma colaborativa de estudo para **certificações AWS**. 

Em outras palavras: é um **simulador de provas AWS**, feito por pessoas como você, para ajudar outras pessoas a estudar.

### ✨ Características principais

| Característica | O que significa? |
|---|---|
| **PWA (Progressive Web App)** | Funciona no navegador, **sem instalação**. Funciona **offline** também! |
| **Questões Geradas por IA** | Não copiamos de outras plataformas. Nossas questões são originais! |
| **Open Source** | Qualquer pessoa pode contribuir. O código é público. |
| **Bilíngue** | Funciona em Português e Inglês. Escolha automática. |
| **Colaborativo** | Você pode adicionar questões novas e ajudar outros a estudar. |

### 🎯 Por quem foi feito?

Pela **Karla Renata Rosario**, uma desenvolvedora que quer democratizar o acesso a materiais de estudo de qualidade.

### 📊 Números do projeto

```
📚 1.964 questões criadas
🏆 4 certificações AWS cobertas
🌍 2 idiomas suportados
👥 Comunidade colaborativa
⭐ Sempre crescendo!
```

---

# 2️⃣ FRONTEND

## Onde está o Frontend?

Após a reorganização, o Frontend está aqui:

```
projeto-simulados-certificacao-aws/
├── public/                    ← Arquivos públicos (servidos direto)
│   ├── index.html            ← A tela principal
│   ├── manifest.json         ← Configuração da PWA
│   └── sw.js                 ← Service Worker (offline)
│
├── src/
│   └── frontend/             ← ✨ AQUI ESTÁ O CODE DO FRONTEND
│       ├── js/               ← Arquivos JavaScript
│       │   ├── app.js        ← Arquivo principal (orquestrador)
│       │   ├── quizEngine.js ← Lógica do simulador
│       │   ├── gamificacao/  ← Pontos, badges, leaderboard
│       │   ├── i18n/         ← Tradução (Português/Inglês)
│       │   ├── modes/        ← Diferentes modos de estudo
│       │   ├── analytics/    ← Gráficos e relatórios
│       │   └── ...           ← Mais arquivos
│       │
│       └── styles/           ← Arquivos CSS
│           ├── main.css      ← Estilos principais
│           └── gamificacao.css ← Estilos da gamificação
```

## Como o Frontend funciona? (Fluxo Simplificado)

```
1. Usuário abre index.html
           ↓
2. app.js carrega
           ↓
3. app.js procura pelas questões em data/
           ↓
4. quizEngine.js gerencia a simulação
           ↓
5. Respostas do usuário são salvas em localStorage (memória local)
           ↓
6. Gráficos e estatísticas aparecem no dashboard
```

### 💾 Como os dados são salvos?

O Frontend **não usa banco de dados de verdade**. Usa `localStorage`, que é como um "armário privado" do navegador:

- **Vantagem:** Funciona offline! 📱
- **Desvantagem:** Dados não sincronizam entre dispositivos

### 🎮 Principais componentes

| Componente | O que faz? | Arquivo |
|---|---|---|
| **Quiz Engine** | Controla as perguntas, respostas, timer | `quizEngine.js` |
| **Gamificação** | Pontos, badges, streaks | `gamificacao/` |
| **Analytics** | Gráficos de desempenho | `analytics/` |
| **I18n** | Tradução automática | `i18n/` |
| **Storage Manager** | Salva dados localmente | `storageManager.js` |

---

# 3️⃣ BACKEND

## Onde está o Backend?

O Backend está aqui:

```
projeto-simulados-certificacao-aws/
├── backend/                   ← ✨ AQUI ESTÁ O BACKEND
│   ├── server.js             ← Servidor Node.js (se houver)
│   ├── database/             ← Tudo de banco de dados
│   │   ├── db.js             ← Configuração do PGLite
│   │   ├── schema.sql        ← Estrutura do banco
│   │   └── ...
│   ├── controllers/          ← Lógica das rotas (se houver)
│   ├── api/                  ← Endpoints da API (se houver)
│   └── ...
│
├── src/
│   └── python/               ← Pipeline de IA
│       └── scripts/          ← Scripts Python
│           ├── auto_generate_questions.py    ← Gera questões novas
│           ├── aws_semantic_validator.py     ← Valida qualidade
│           ├── auditoria_geral.py            ← Audita o banco
│           └── requirements.txt              ← Dependências Python
```

## A Arquitetura do Backend (Simplificada)

```
FRONTEND PEDE UM SIMULADO
         ↓
BACKEND RETORNA AS QUESTÕES
         ↓
FRONTEND EXIBE NA TELA
         ↓
USUÁRIO RESPONDE
         ↓
FRONTEND CALCULA A NOTA
         ↓
RESULTADO APARECE
```

### 🔄 Pipeline de IA (A Fábrica de Questões)

O Backend tem um **pipeline Python** que gera questões automaticamente:

```
COMEÇAR
  ↓
1. Chamar Gemini API (Google IA)
  ↓
2. Receber questão em JSON
  ↓
3. Validar com Pydantic (verificar tipos de dados)
  ↓
4. Validar semanticamente (A resposta faz sentido?)
  ↓
5. Remover duplicatas (Essa questão já existe?)
  ↓
6. Se tudo OK → Salvar em data/
  ↓
FIM
```

### 🐍 Scripts Python Importantes

| Script | O que faz? |
|---|---|
| `auto_generate_questions.py` | Gera N questões novas para uma certificação |
| `aws_semantic_validator.py` | Verifica se a questão é boa e realista |
| `auditoria_geral.py` | Audita todo o banco de questões |
| `validate_contribution.py` | Valida questões contribuídas por usuários |

---

# 4️⃣ VALIDAÇÃO DE QUESTÕES (Regras de Negócio)

## O que é Validação de Questões?

**Validação** = Verificar se uma questão é boa, realista e útil.

Sem validação, o banco teria questões ruins, duplicadas, ou incorretas.

## ⚠️ Regras Críticas que NÃO DEVEM SER QUEBRADAS

### Regra 1: Uma questão SEMPRE tem:
- ✅ **Cenário** — Contexto realista (ex: "Uma empresa usa S3...")
- ✅ **Pergunta** — Uma questão clara (ex: "Qual serviço devo usar?")
- ✅ **Opções** — 4 alternativas (A, B, C, D)
- ✅ **Resposta correta** — Qual é a certa
- ✅ **Explicação** — Por que essa é a resposta

### Regra 2: Sem Pegadinhas Injustas

❌ **Ruim:** "Qual alternativa está INCORRETA?"
✅ **Bom:** "Qual é a melhor prática?"

### Regra 3: Sem Erros de Português/Inglês

❌ **Ruim:** "A configuração sao importantes"
✅ **Bom:** "As configurações são importantes"

### Regra 4: Sem Duplicatas

Se a questão já existe (mesmo com palavras diferentes), ela será rejeitada.

### Regra 5: Deve Testar Conhecimento Real

❌ **Ruim:** "O AWS S3 é para armazenar arquivos?" (muito óbvio)
✅ **Bom:** "Qual é a melhor estratégia de replicação para um bucket S3 com acesso global?" (testa pensamento crítico)

## 🔍 Como a Validação Funciona?

```
QUESTÃO NOVA CHEGA
       ↓
1. Checagem de Estrutura (Tem cenário? Tem opções?)
       ↓
2. Checagem de Tipos (Tudo é texto? Números estão certos?)
       ↓
3. Checagem Semântica (A resposta faz sentido com o cenário?)
       ↓
4. Checagem de Idioma (Português/Inglês correto?)
       ↓
5. Checagem de Duplicatas (Já existe no banco?)
       ↓
✅ SE PASSAR EM TUDO → Questão é aceita!
❌ SE FALHAR → Questão é rejeitada com motivo
```

## 📋 Checklist para Criar uma Boa Questão

Antes de contribuir, pergunte-se:

- [ ] Minha questão tem um cenário realista?
- [ ] A pergunta é clara e sem ambiguidade?
- [ ] Todas as 4 opções são plausíveis?
- [ ] A resposta correta é definitivamente a melhor?
- [ ] A explicação educacional é detalhada?
- [ ] Não tem erros de ortografia/gramática?
- [ ] A questão não é óbvia demais nem impossível?
- [ ] Essa questão já não existe no banco?

Se respondeu SIM para todas, sua questão está pronta! 🚀

---

# 5️⃣ DADOS

## Onde estão os dados?

As questões estão aqui:

```
projeto-simulados-certificacao-aws/
├── data/                              ← ✨ AQUI ESTÃO OS DADOS
│   ├── clf-c02.json                  ← Questões do Cloud Practitioner
│   ├── saa-c03.json                  ← Questões do Solutions Architect
│   ├── dva-c02.json                  ← Questões do Developer
│   ├── aif-c01.json                  ← Questões do AI Practitioner
│   ├── contributions/                ← Questões enviadas pela comunidade
│   │   ├── _TEMPLATE.json            ← Template para contribuir
│   │   ├── clf-c02/                  ← Contribuições para CLF
│   │   ├── saa-c03/
│   │   └── ...
│   └── backups/                      ← Backups antigos
```

## Estrutura de uma Questão (JSON)

Cada questão é assim:

```json
{
  "id": "aws-s3-001",
  "certification": "clf-c02",
  "question": "Uma empresa precisa armazenar documentos confidenciais. Qual serviço AWS oferece armazenamento seguro com criptografia?",
  "options": [
    "EC2",
    "S3 com SSE",
    "RDS",
    "Lambda"
  ],
  "correct_answer": 1,
  "explanation": "S3 (Simple Storage Service) oferece criptografia via SSE (Server-Side Encryption)...",
  "tags": ["armazenamento", "segurança", "s3"],
  "difficulty": "fácil",
  "language": "pt-BR"
}
```

### 📊 Campos Explicados

| Campo | Significado | Exemplo |
|---|---|---|
| `id` | Identificador único | `"aws-s3-001"` |
| `certification` | Qual prova? | `"clf-c02"` |
| `question` | A pergunta | `"Qual serviço..."` |
| `options` | 4 alternativas | `["A", "B", "C", "D"]` |
| `correct_answer` | Índice da correta | `1` (é a segunda opção) |
| `explanation` | Por quê? | `"Porque S3 é..."` |
| `tags` | Palavras-chave | `["s3", "armazenamento"]` |
| `difficulty` | Nível | `"fácil"`, `"médio"`, `"difícil"` |
| `language` | Idioma | `"pt-BR"` ou `"en-US"` |

## 🔄 Fluxo dos Dados (Frontend → Backend → Frontend)

```
FRONTEND CARREGA data/clf-c02.json
         ↓
JAVASCRIPT LIDA O JSON
         ↓
QUESTÕES SÃO EXIBIDAS NA TELA
         ↓
USUÁRIO RESPONDE
         ↓
RESPOSTA É SALVA EM localStorage
         ↓
ESTATÍSTICAS SÃO CALCULADAS
         ↓
GRÁFICOS SÃO MOSTRADOS
```

## 📈 Certificações Cobertas

| Código | Nome | Questões | Status |
|---|---|---|---|
| **CLF-C02** | AWS Certified Cloud Practitioner | ~660 | ✅ Completa |
| **SAA-C03** | AWS Certified Solutions Architect | ~380 | ✅ Completa |
| **DVA-C02** | AWS Certified Developer | ~400 | ✅ Completa |
| **AIF-C01** | AWS Certified AI Practitioner | ~510 | ✅ Completa |

---

# 6️⃣ ATUALIZAÇÃO E MANUTENÇÃO

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

- Git instalado
- Python 3.12+ (para scripts)
- Node.js 18+ (opcional, se usar ferramentas node)
- Um navegador web

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/karlarenatadev/projeto-simulados-certificacao-aws.git
cd projeto-simulados-certificacao-aws
```

### Passo 2: Configure o Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e adicione suas chaves (se necessário)
```

### Passo 3: Instale Dependências

```bash
# Se vai usar scripts Python:
cd src/python/scripts
pip install -r requirements.txt

# Se vai usar ferramentas Node.js:
npm install
```

### Passo 4: Execute Localmente

#### Opção A: Apenas Frontend (Recomendado para iniciantes)

```bash
# Python
python -m http.server 8000

# Ou Node.js
npx http-server

# Abra no navegador: http://localhost:8000
```

#### Opção B: Com Backend (Node.js)

```bash
npm run db:start
```

---

## 📋 Tarefas Comuns

### 1. Validar Suas Questões Antes de Enviar

```bash
cd src/python/scripts
python validate_contribution.py ../../data/contributions/clf-c02/minha-questao.json
```

### 2. Gerar Novas Questões

```bash
cd src/python/scripts
python auto_generate_questions.py clf-c02 --quantity 5
```

### 3. Auditar Todo o Banco

```bash
cd src/python/scripts
python auditoria_geral.py
```

### 4. Rodar Testes

```bash
npm test
```

### 5. Formatar Código

```bash
npm run format
```

### 6. Verificar Erros de Linting

```bash
npm run lint
```

---

## 🔧 Estrutura de Pastas (Nova e Limpa!)

Após a reorganização, o projeto está assim:

```
projeto-simulados-certificacao-aws/
│
├── 📄 ARQUIVOS DE CONFIGURAÇÃO (Root - Apenas Essencial)
├── package.json
├── .env.example
├── .gitignore
├── README.md
│
├── 📂 public/                    ← Arquivos servidos direto
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
│
├── 📂 src/
│   ├── frontend/                ← Código JavaScript + CSS
│   │   ├── js/
│   │   └── styles/
│   ├── python/                  ← Scripts de IA
│   │   └── scripts/
│   └── ... (outras pastas)
│
├── 📂 backend/                  ← Servidor e banco
├── 📂 data/                     ← Questões (JSON)
├── 📂 docs/                     ← Documentação
├── 📂 config/                   ← Configurações
├── 📂 __tests__/                ← Testes
└── ... (mais pastas)
```

## ⚠️ Erros Comuns e Como Evitar

### ❌ Erro: "data/clf-c02.json não encontrado"

**Causa:** Você está em um diretório errado.

**Solução:**
```bash
# Sempre execute do root do projeto
cd projeto-simulados-certificacao-aws
ls data/  # Deve aparecer os arquivos JSON
```

### ❌ Erro: "ModuleNotFoundError: No module named 'pydantic'"

**Causa:** Dependências Python não instaladas.

**Solução:**
```bash
pip install -r src/python/scripts/requirements.txt
```

### ❌ Erro: "Port 8000 already in use"

**Causa:** Outra aplicação já está usando a porta.

**Solução:**
```bash
# Use outra porta
python -m http.server 8001
```

### ❌ Erro: "Questão rejeitada: Duplicata detectada"

**Causa:** Essa questão já existe no banco.

**Solução:**
- Procure no `data/` para verificar
- Se a existente está ruim, atualize-a
- Se a sua é melhor, edite o ID para ser único

---

## 💡 Dicas de Ouro para Iniciantes

### 1. Sempre leia CONTRIBUTING.md antes de enviar

```bash
# Abra a documentação de contribuição
open docs/CONTRIBUTING.md
```

### 2. Teste localmente ANTES de enviar PR

```bash
# Valide sua questão localmente
python src/python/scripts/validate_contribution.py seu-arquivo.json
```

### 3. Entenda o fluxo de uma questão

```
seu-arquivo.json → Validação → data/clf-c02.json → Frontend → Usuário
```

### 4. Use templates

```bash
# Copie o template para sua questão
cp data/contributions/_TEMPLATE.json data/contributions/clf-c02/minha-questao.json
```

### 5. Documente suas mudanças

Ao contribuir, descreva:
- O que você adicionou?
- Por quê?
- Como testa?

---

## 🎓 Próximos Passos

### Para Contribuidores de Questões:
1. Leia `docs/CONTRIBUTING.md`
2. Copie o template em `data/contributions/`
3. Crie sua questão
4. Valide com `validate_contribution.py`
5. Abra um Pull Request!

### Para Desenvolvedores Frontend:
1. Explore `src/frontend/js/`
2. Entenda `quizEngine.js`
3. Modifique componentes
4. Teste localmente
5. Abra um Pull Request!

### Para Engenheiros de Dados:
1. Explore `src/python/scripts/`
2. Entenda o pipeline
3. Melhore os validadores
4. Adicione novas certificações
5. Abra um Pull Request!

---

## 📞 Precisa de Ajuda?

- 📖 Leia os arquivos em `docs/`
- 🐙 Veja issues no GitHub
- 💬 Deixe um comentário no PR
- ⭐ Compartilhe o projeto com amigos!

---

**Parabéns por chegar até aqui! 🎉**

Você agora tem todo o conhecimento para começar a contribuir. A jornada é colaborativa e todos somos aprendizes.

**Bem-vindo à Guilda! 🚀**

