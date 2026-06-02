# ☁️ Cloud Certification Study Tool - By Guilda

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-000000?style=for-the-badge&logo=progressive-web-apps&logoColor=white)

[![Tests](https://img.shields.io/github/actions/workflow/status/karlarenatadev/projeto-simulados-certificacao-aws/test-python-scripts.yml?label=Tests&style=flat-square)](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/actions)
[![Auto Merge](https://img.shields.io/github/actions/workflow/status/karlarenatadev/projeto-simulados-certificacao-aws/auto-merge-contributions.yml?label=Auto-Merge&style=flat-square)](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/actions)
![Version](https://img.shields.io/badge/version-2.0.0-blue?style=flat-square)

**Uma plataforma colaborativa de estudo para certificações AWS, impulsionada por IA Generativa.**

🔗 **[Experimentar Demo Online](https://karlarenatadev.github.io/projeto-simulados-certificacao-aws/)**

</div>

---

## 🚀 COMECE AQUI (5 minutos)

**Você é novo no projeto?** Leia isto primeiro:

- 👀 **[ONBOARDING_VISUAL.md](ONBOARDING_VISUAL.md)** — Entenda o projeto em 5 minutos
- 🎓 **[DOCUMENTACAO_FLUIDA.md](DOCUMENTACAO_FLUIDA.md)** — Guia completo e didático

---

## 📚 DOCUMENTAÇÃO

Escolha o que você quer entender:

| Documento | Para | Tempo |
|-----------|------|-------|
| **[ONBOARDING_VISUAL.md](ONBOARDING_VISUAL.md)** | Entender visão geral rápido | 5 min |
| **[DOCUMENTACAO_FLUIDA.md](DOCUMENTACAO_FLUIDA.md)** | Aprender tudo com detalhes | 45 min |
| **[ESTRUTURA_PROPOSTA.md](ESTRUTURA_PROPOSTA.md)** | Reorganizar o projeto | 2-3 dias |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Contribuir com questões/código | 15 min |
| **[docs/GUIA-COMPLETO.md](docs/GUIA-COMPLETO.md)** | Manual aprofundado | 1 hora |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Arquitetura detalhada | 30 min |

---

## 🎯 O QUE É ESTE PROJETO?

**Em uma frase:** Uma plataforma de estudo interativa para ajudar pessoas a passar em certificações AWS, usando inteligência artificial para gerar questões e acompanhar progresso.

### O Que Você Consegue Fazer

✅ Fazer simulados com questões reais (CLF-C02, SAA-C03, DVA-C02, AIF-C01)  
✅ Ver seu progresso em gráficos interativos  
✅ Estudar com flashcards (cards interativos)  
✅ Usar modo Pomodoro para estudar em sprints  
✅ Tudo funciona **offline** (sem internet)  
✅ Contribuir com novas questões  
✅ Ajudar a comunidade a melhorar o simulador  

### Números

- 📊 **~2.000 questões** geradas, validadas e traduzidas
- 🌐 **2 idiomas:** Português + Inglês
- 🏆 **4 certificações:** CLF-C02, SAA-C03, DVA-C02, AIF-C01
- 👥 **100% open-source** e colaborativo
- 🤖 **Powered by IA** (Google Gemini + Groq)

---

## 🏃 COMEÇAR RÁPIDO (5 minutos)

### Pré-requisitos
- Node.js 18+ ([Instalar](https://nodejs.org/))
- Git
- Editor de código (VS Code recomendado)

### Rodar Localmente

```bash
# 1. Clone
git clone https://github.com/karlarenatadev/projeto-simulados-certificacao-aws.git
cd projeto-simulados-certificacao-aws

# 2. Instale dependências
npm install

# 3. Inicie o projeto
npm run dev

# 4. Abra no navegador
# → http://localhost:8000
```

### Principais Comandos

```bash
npm run test          # Executa testes
npm run lint          # Verifica código
npm run format        # Formata código
npm run build         # Build para produção
npm run db:start      # Inicia banco de dados (PGLite)
```

---

## 🗺️ ENTENDA A ESTRUTURA

```
projeto-simulados-certificacao-aws/
│
├── 📱 src/frontend/          ← Código da interface (o que você vê)
├── 🗄️ src/backend/          ← Servidor e banco de dados
├── 🤖 src/python/           ← Scripts de IA e validação
├── 💾 data/                 ← ~2.000 questões em JSON
├── 📖 docs/                 ← Documentação completa
├── 🧪 tests/                ← Testes automáticos
├── ⚙️ config/               ← Configurações
└── 🔨 scripts/              ← Utilitários
```

**Quer entender melhor?** Leia [ESTRUTURA_PROPOSTA.md](ESTRUTURA_PROPOSTA.md)

---

## 🤝 COMO CONTRIBUIR

### Contribuir com Questões Novas

```bash
# 1. Copie o template
cp data/contributions/_TEMPLATE.json \
   data/contributions/clf-c02/minha-questao.json

# 2. Preencha com sua questão (veja exemplo em _TEMPLATE.json)

# 3. Valide
python src/python/validation/validate_contribution.py \
  data/contributions/clf-c02/minha-questao.json

# 4. Envie um Pull Request (PR)

# 5. Comunidade revisa → Aprovado! 🎉
```

### Contribuir com Código

```bash
# 1. Crie uma branch
git checkout -b minha-feature

# 2. Faça suas mudanças

# 3. Teste localmente
npm run test
npm run lint

# 4. Commit e push
git add .
git commit -m "feat: descrição da mudança"
git push origin minha-feature

# 5. Abra PR no GitHub
```

**Leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.**

---

## 📸 SCREENSHOTS

<div align="center">

| Tela Inicial | Simulado |
| :---: | :---: |
| ![Tela Inicial](img/tela-inicial.png) | ![Simulado](img/simulado.png) |

| Dashboard | Flashcards |
| :---: | :---: |
| ![Dashboard](img/dashboard.png) | ![Flashcards](img/flashcards.png) |

</div>

---

## 🧠 ARQUITETURA

A plataforma é dividida em 3 camadas:

```
┌─────────────────────────────┐
│ 📱 Interface (Frontend)     │  ← Telas, botões, gráficos
├─────────────────────────────┤
│ ⚙️ Lógica (Engine)          │  ← Quiz, validação, analytics
├─────────────────────────────┤
│ 💾 Dados (Backend + JSON)   │  ← Questões, progresso, banco
└─────────────────────────────┘
```

**Quer entender arquitetura?** Leia [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 🔐 VALIDAÇÃO DE QUESTÕES

Toda questão passa por validação rigorosa:

✅ **Estrutura OK** (JSON correto)  
✅ **Sem duplicatas** (não é igual a outra)  
✅ **Tecnicamente correto** (termos AWS reais)  
✅ **Sem pegadinhas fracas** (resposta inequívoca)  
✅ **Tem explicação** (por que está certa)  

**Erros comuns que invalidam:**
- ❌ Pergunta com múltiplas interpretações
- ❌ Opções que não fazem sentido
- ❌ Sem fonte ou explicação
- ❌ Formato JSON incorreto

---

## 🚀 ROADMAP 2026

- [x] Expansão para ~2.000 questões
- [x] Nova certificação AIF-C01
- [x] Exportação de flashcards
- [ ] Testes Adaptativos (CAT)
- [ ] Ranking comunitário
- [ ] Mobile app nativo

---

## 👥 QUEM FAZ ISSO ACONTECER

* **Karla Renata Rosario** — *Orientadora & Desenvolvedora*
* **Otto Jacometo** — *Orientador & Desenvolvedor*
* **Marco Pereira** — *Orientador & Desenvolvedor*
* **Amanda Veras**
* **André Brandão**
* **Eduardo Evangelista**
* **Emily Ventura**
* **João Barros**
* **Maria Costa**
* **Maria Eduarda**
* **Maria Prado**
* **Sarah Israel**


(+ [comunidade contribuidora](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/graphs/contributors))

---

## 📞 PRECISA DE AJUDA?

- 🐙 **GitHub Issues:** [Abra um issue](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/issues)
- 💬 **Discussions:** [Participe](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/discussions)
- 📖 **Documentação:** Veja [docs/](docs/) ou [DOCUMENTACAO_FLUIDA.md](DOCUMENTACAO_FLUIDA.md)

---

## 📄 LICENÇA

MIT License — [VER LICENÇA](LICENSE)

---

## ⭐ ENCONTROU ÚTIL?

Se este projeto ajudou nos seus estudos, considere deixar uma ⭐ no repositório!

<div align="center">

**Construído com ❤️ pela Guilda Z-Maguinhos**

*Aprendizado Colaborativo em Cloud Computing*

</div>

---

## 🔗 LINKS RÁPIDOS

| Link | Descrição |
|------|-----------|
| [ONBOARDING_VISUAL.md](ONBOARDING_VISUAL.md) | Guia visual 5 minutos ⭐ COMECE AQUI |
| [DOCUMENTACAO_FLUIDA.md](DOCUMENTACAO_FLUIDA.md) | Documentação completa e didática |
| [ESTRUTURA_PROPOSTA.md](ESTRUTURA_PROPOSTA.md) | Reorganização e estrutura |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Como contribuir |
| [docs/GUIA-COMPLETO.md](docs/GUIA-COMPLETO.md) | Manual aprofundado |
| [docs/roadmap.md](docs/roadmap.md) | Roadmap e futuro |
| [Demo Online](https://karlarenatadev.github.io/projeto-simulados-certificacao-aws/) | Teste agora! |

