# 🎯 GUIA VISUAL DE ONBOARDING (5 MINUTOS)

> **Seu mapa para entender este projeto rapidamente**

---

## 🗺️ O MAPA DO PROJETO

```
┌─────────────────────────────────────────────────────────────────┐
│                    👤 VOCÊ (Usuário Final)                       │
│                                                                  │
│  Acessa: https://karlarenatadev.github.io/projeto-...           │
│                          ↓                                       │
│  Vê: Telas bonitas, Quiz, Gráficos, Flashcards                 │
└─────────────────────────────────────────────────────────────────┘
                             ↓ Usa
┌─────────────────────────────────────────────────────────────────┐
│  📱 FRONTEND (SRC/FRONTEND)                                      │
│  ├─ HTML bonito (telas)                                         │
│  ├─ CSS estiloso (cores, layout)                                │
│  └─ JavaScript (lógica, interação)                              │
│                                                                  │
│  Arquivos-Chave:                                                │
│  ├─ app.js .................... Inicia tudo                     │
│  ├─ quizEngine.js ............. Lógica do simulado               │
│  ├─ storageManager.js ......... Salva dados localmente           │
│  ├─ chartManager.js ........... Desenha gráficos                │
│  └─ flashcards.js ............. Modo cards                      │
└─────────────────────────────────────────────────────────────────┘
                             ↓ Consulta
┌─────────────────────────────────────────────────────────────────┐
│  💾 DADOS (DATA/)                                               │
│  ├─ questoes/ ..................... ~2000 questões (JSON)       │
│  ├─ diagnostico/ .................. Testes de nivelamento       │
│  ├─ gamificacao/ .................. Desafios                    │
│  └─ contributions/ ................ Questões em revisão         │
│                                                                  │
│  Exemplo de questão:                                            │
│  {                                                              │
│    "text": "O que é VPC?",                                      │
│    "options": { "A": "...", "B": "...", "C": "...", "D": "..." }
│    "correct_answer": "B",                                       │
│    "explanation": "..."                                         │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                             ↓ Gera/Valida
┌─────────────────────────────────────────────────────────────────┐
│  🤖 PIPELINE PYTHON (SRC/PYTHON)                                │
│  ├─ generator.py ............... Cria questões com IA           │
│  ├─ aws_semantic_validator.py .. Verifica se é boa             │
│  ├─ duplicate_detector.py ....... Evita repetidas               │
│  └─ validate_contribution.py .... Valida antes de aceitar       │
│                                                                  │
│  Fluxo:                                                         │
│  Google Gemini → Gera → Valida → Sem Duplicata → JSON           │
└─────────────────────────────────────────────────────────────────┘
                             ↓ Pode armazenar em
┌─────────────────────────────────────────────────────────────────┐
│  🗄️ BACKEND (SRC/BACKEND)                                       │
│  ├─ PGLite database ............ Armazena questões validadas    │
│  ├─ db.js ...................... Conecta ao banco              │
│  └─ server.js .................. Inicia servidor                │
│                                                                  │
│  (Fase: Ainda em desenvolvimento)                               │
└─────────────────────────────────────────────────────────────────┘

```

---

## 📂 A ESTRUTURA (Simplificada)

```
projeto-simulados-certificacao-aws/
│
├── 🟢 FRONTEND
│   src/frontend/
│   ├── js/ ..................... Lógica
│   ├── styles/ ................. Beleza
│   └── index.html .............. Página principal
│
├── 🟠 DADOS
│   data/questoes/
│   ├── clf-c02.json ............ 660 questões (Practitioner)
│   ├── saa-c03.json ............ 380 questões (Solutions Architect)
│   ├── dva-c02.json ............ 400 questões (Developer)
│   └── aif-c01.json ............ 510 questões (AI Practitioner)
│
├── 🔵 BACKEND
│   src/backend/ ............... Servidor + Banco
│
├── 🟣 IA/PIPELINE
│   src/python/ ................ Scripts de geração e validação
│
└── 🟡 DOCUMENTAÇÃO
    docs/ ...................... Manuais e guias
```

---

## 🎓 APRENDA NA SEQUÊNCIA

```
┌────────────────────────────────────────────┐
│ 1. ENTENDA A VISÃO GERAL (5 min)          │
│    → Leia este arquivo todo!              │
│    → Entenda que frontend ≠ backend       │
│    → Saiba que dados são JSON             │
└────────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│ 2. RODE LOCALMENTE (20 min)               │
│    → Clone: git clone ...                 │
│    → Instale: npm install                 │
│    → Rode: npm run dev                    │
│    → Teste no navegador                   │
└────────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│ 3. EXPLORE O CÓDIGO (45 min)              │
│    → Abra src/frontend/js/app.js          │
│    → Leia comentários                     │
│    → Entenda fluxo                        │
└────────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│ 4. TENTE UMA MUDANÇA (1 hora)             │
│    → Mude uma cor em styles/main.css      │
│    → Veja a mudança no navegador          │
│    → Entenda o ciclo dev                  │
└────────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│ 5. FAÇA SUA 1ª CONTRIBUIÇÃO (2 horas)     │
│    → Crie uma questão nova                │
│    → Valide com script Python             │
│    → Envie como PR                        │
│    → Vire contribuidor!                   │
└────────────────────────────────────────────┘
```

---

## 🔑 CONCEITOS CRUCIAIS

### 1️⃣ **O Projeto é 80% Frontend**

```
Frontend (JavaScript + HTML + CSS)
├─ Telas que você vê
├─ Quiz interativo
├─ Gráficos em tempo real
├─ Funciona 100% offline
└─ Salva dados localmente (localStorage)

Backend (Python + Node.js)
└─ Valida questões novas
└─ Gera questões com IA
└─ Armazena no banco (futuro)
```

**Aprender:** Frontend primeiro, depois backend!

### 2️⃣ **Dados são Arquivos JSON, Não Database**

Agora:
```
data/questoes/clf-c02.json ← Um arquivo simples
```

Futuro:
```
PGLite Database ← Mais profissional para scale
```

### 3️⃣ **Questões Passam por Validação Rigorosa**

```
❌ Ruim: "O que é melhor?"
✅ Bom: "Qual serviço oferece X?"

❌ Ruim: Sem fonte
✅ Bom: "Fonte: AWS Certification Guide"

❌ Ruim: Duplicada
✅ Bom: Verificada contra 2000 existentes
```

### 4️⃣ **Existem 4 Certificações (Exames)**

```
CLF-C02 ........ Cloud Practitioner (Iniciante)
SAA-C03 ........ Solutions Architect (Intermediário)
DVA-C02 ........ Developer (Técnico)
AIF-C01 ........ AI Practitioner (Novo!)
```

Cada uma tem seus próprios:
- ✅ ~400-600 questões
- ✅ Arquivo JSON próprio
- ✅ Pasta de contribuições
- ✅ Teste de diagnóstico

---

## 🚀 SEUS PRIMEIROS 30 MINUTOS

### ✅ Checklist Rápido

```
☐ 1. Clone o repositório (3 min)
☐ 2. npm install (5 min)
☐ 3. npm run dev (2 min)
☐ 4. Abra http://localhost:8000 (1 min)
☐ 5. Comece um simulado (5 min)
☐ 6. Explore as telas (9 min)
☐ 7. Leia src/frontend/js/app.js (até linha 50)
```

---

## 🎯 PRÓXIMAS AÇÕES (Escolha Uma)

### Para Front-End Developers

```
1. Abra src/frontend/styles/main.css
2. Mude a cor de fundo
3. Veja a mudança ao vivo
4. Crie um novo botão interativo
5. Mude uma funcionalidade (ex: timer)
→ Abra PR com suas mudanças
```

### Para Back-End Developers

```
1. Leia src/backend/database/db.js
2. Entenda PGLite
3. Crie uma tabela nova no schema.sql
4. Escreva query para buscar dados
5. Conecte com frontend
→ Abra PR com suas mudanças
```

### Para Python Developers

```
1. Leia src/python/pipeline/generator.py
2. Entenda como gera questões
3. Rode: python generator.py --test
4. Crie 5 questões teste
5. Valide com validate_contribution.py
→ Abra PR com suas questões novas
```

### Para Designers/UX

```
1. Abra o projeto no navegador
2. Identifique 3 melhorias de UX
3. Faça mockups no Figma (opcional)
4. Implemente as mudanças em CSS
5. Teste responsividade
→ Abra PR com seu design melhorado
```

---

## 📞 DÚVIDAS? PERGUNTE!

```
┌─────────────────────────────────────────────────────────────┐
│  🐙 GitHub Issues                                          │
│  → github.com/.../issues                                   │
│  Use quando: Quer relatar bug ou pedir feature             │
│                                                             │
│  💬 GitHub Discussions                                      │
│  → github.com/.../discussions                              │
│  Use quando: Tem dúvida geral ou quer conversar            │
│                                                             │
│  📖 Documentação Completa                                   │
│  → DOCUMENTACAO_FLUIDA.md (Este repositório)               │
│  Use quando: Quer entender tudo com detalhes               │
│                                                             │
│  👨‍💼 Conversa com Contribuidores                             │
│  → Veja CONTRIBUTING.md para contato                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 GLOSSÁRIO RÁPIDO

| Termo | Significa | Exemplo |
|-------|-----------|---------|
| **PWA** | App web que funciona offline | "Estude sem internet" |
| **localStorage** | Armazena dados no navegador | Suas respostas não somem |
| **JSON** | Formato de dados texto | `{"name": "Quiz", "count": 5}` |
| **Frontend** | Código que roda no navegador | HTML, CSS, JavaScript |
| **Backend** | Código que roda no servidor | Python, Node.js |
| **API** | Interface de comunicação | Frontend pede dados para backend |
| **IA/Gemini** | Inteligência artificial | Gera novas questões |
| **Validação** | Verificar se está correto | Script Python valida questões |
| **PGLite** | Banco de dados leve | Armazena questões aprovadas |
| **PR (Pull Request)** | Sua contribuição de código | Você manda, comunidade revisa |

---

## ⚡ DICA PROFISSIONAL

```
Ao explorar este código, pergunte-se:

1. "Onde começa a execução?"
   → Resposta: src/frontend/js/app.js (linha 1)

2. "Como os dados chegam até a tela?"
   → Resposta: JSON → JavaScript → HTML → você vê

3. "Quando o código valida questões?"
   → Resposta: Quando someone faz PR (GitHub Actions)

4. "Onde as questões são guardadas?"
   → Resposta: data/questoes/*.json (agora) 
            ou PGLite (futuro)

5. "Como você pode contribuir?"
   → Resposta: Crie PR com questões, código ou docs
```

---

## 🏁 VOCÊ ESTÁ PRONTO!

Agora que você sabe:
- ✅ Que é um projeto frontend+backend
- ✅ Como os dados são organizados
- ✅ Que existem 4 certificações
- ✅ Como questões são validadas
- ✅ Como rodar localmente

**Próximo passo:** Abra DOCUMENTACAO_FLUIDA.md para aprender COM DETALHES.

---

**Bem-vindo à comunidade! 🎉**

*Agora divirta-se explorando e contribuindo!*
