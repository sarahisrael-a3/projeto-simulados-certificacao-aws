# ☁️ AWS Certification Simulator

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3670A0?style=flat&logo=python)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=google&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-000?style=flat&logo=progressive-web-apps)
![Version](https://img.shields.io/badge/version-2.0.0-blue)

> Simulador profissional de certificações AWS com 728 questões, suporte a múltipla resposta, modo flashcards 3D, insights inteligentes e geração automática via IA (Google Gemini 2.5 Flash).

🔗 **[Acessar Demo Online](https://karlarenatadev.github.io/projeto-simulados-certificacao-aws/)**

---

## 🎯 Principais Funcionalidades

### 🎓 Simulação Realista
- **4 Certificações AWS**: CLF-C02, SAA-C03, AIF-C01, DVA-C02
- **728 questões** validadas com múltipla resposta ("Escolha 2" ou "Escolha 3")
- **Escala oficial AWS**: Pontuação 100-1000 pontos com selo de aprovação
- **Modo Exame**: Timer real + Modo Revisão sem pressão

### 📚 Modo Flashcards 3D
- **20 termos AWS essenciais** com efeito flip interativo
- Definições oficiais alinhadas com documentação AWS
- Navegação intuitiva e responsivo

### 📊 Análise Inteligente
- **Gráfico de Radar**: Desempenho por domínio (Chart.js)
- **Dashboard Global**: Histórico agregado na sidebar
- **11 tipos de insights**: Análise multifatorial com recomendações personalizadas
- Detecção de tendências, burnout e domínios fracos

### 🌐 Bilíngue & Offline
- **PT-BR e EN-US** com tradução automática
- **PWA completo**: Funciona 100% offline após instalação
- Botão de instalação visível no cabeçalho

---

## 🚀 Início Rápido

### Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/karlarenatadev/projeto-simulados-certificacao-aws.git
cd projeto-simulados-certificacao-aws

# Inicie um servidor local
python -m http.server 8000
# ou
npx http-server -p 8000

# Acesse no navegador
http://localhost:8000
```

### Gerar Novas Questões (Opcional)

```bash
# Instale dependências Python
pip install -r scripts_python/requirements.txt

# Configure API Key no arquivo .env
echo "GEMINI_API_KEY=sua_chave_aqui" > .env

# Gere questões automaticamente
python scripts_python/auto_generate_questions.py clf-c02

# Traduza para inglês
python scripts_python/translate_with_api.py clf-c02
```

---

## 📖 Certificações Suportadas

| Código | Nome | Questões | Múltipla Resposta | Tradução EN |
|--------|------|----------|-------------------|-------------|
| **CLF-C02** | Cloud Practitioner | 195 | ✅ 5 questões | ✅ Completo |
| **SAA-C03** | Solutions Architect Associate | 195 | - | ✅ Completo |
| **AIF-C01** | AI Practitioner | 143 | ✅ 5 questões | 🚧 Pendente |
| **DVA-C02** | Developer Associate | 195 | - | ✅ Completo |

**Total**: 728 questões | 10 questões de múltipla resposta

---

## 🛠️ Tecnologias

**Frontend**: JavaScript ES6+, Tailwind CSS, Chart.js, PWA  
**Backend**: Python 3.12+, Google Gemini 2.5 Flash, Pydantic V2, Deep Translator  
**Arquitetura**: Módulos ES6, LocalStorage, Service Workers

---

## 🌟 Diferenciais

✅ **Fidelidade aos exames oficiais** - Questões de múltipla resposta e escala 100-1000  
✅ **Pipeline de IA completo** - Geração automática com Gemini + fallback Groq  
✅ **Flashcards únicos** - Único simulador com modo de revisão 3D integrado  
✅ **Insights inteligentes** - Análise de 11 fatores com recomendações personalizadas  
✅ **Análise visual avançada** - Gráficos de radar por simulado e dashboard global  
✅ **100% offline** - PWA instalável com persistência robusta

---

## 📚 Documentação Completa

- **[Guia de Início Rápido](./docs/guia-inicio-rapido.md)** - Comece em 5 minutos
- **[Guia de Geração de Questões](./docs/guia-geracao.md)** - Pipeline de IA
- **[Guia de Flashcards](./docs/guia-flashcards.md)** - Modo de revisão 3D
- **[Status da Tradução](./docs/status-traducao.md)** - Progresso PT-BR → EN-US
- **[Análise Completa](./docs/analise-completa-projeto.md)** - Arquitetura técnica
- **[Resolução de Problemas](./docs/resolucao-problemas.md)** - Troubleshooting
- **[CHANGELOG](./CHANGELOG.md)** - Histórico de versões

---

## 📂 Estrutura do Projeto

```text
projeto-simulados-certificacao-aws/
├── js/                      # Módulos JavaScript (app, quizEngine, data, storage)
├── data/                    # Banco de questões JSON (728 questões)
├── scripts_python/          # Pipeline de IA e automação
├── docs/                    # Documentação detalhada
├── index.html               # Interface principal
├── style.css                # Estilos customizados
├── sw.js                    # Service Worker (PWA)
└── manifest.json            # Manifesto PWA
```

---

## 🎯 Novidades v2.0.0 (Março 2026)

🎯 Questões de múltipla resposta ("Escolha 2" ou "Escolha 3")  
📚 Modo Flashcards 3D com 20 termos AWS essenciais  
📊 Escala oficial AWS (100-1000 pontos) com selo de aprovação  
📈 Gráfico de radar interativo com suporte a modo escuro  
🌐 Tradução automática PT-BR → EN-US  
🧠 Sistema de insights inteligentes com 11 tipos de análise  
💾 Botão de instalação PWA visível no cabeçalho  
🏠 Navegação rápida via ícone da nuvem clicável

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📈 Roadmap

**v2.1.0** (Abril 2026): Tradução AIF-C01, +10 questões múltipla resposta, 30 termos no glossário  
**v2.2.0** (Maio 2026): Marcação de flashcards dominados, quiz rápido de termos, exportação Anki  
**v3.0.0** (Junho 2026): Simulados adaptativos (CAT), autenticação, sincronização multi-dispositivo

---

## 👩‍💻 Autora

**Karla Renata A. Rosario**

💼 [LinkedIn](https://www.linkedin.com/in/karlarenata-rosario/) | 🐙 [GitHub](https://github.com/karlarenatadev) | 🌐 [Portfolio](https://karlarenatadev.github.io/projeto-simulados-certificacao-aws/)

---

## 📝 Licença

Projeto educacional para fins de portfólio técnico.

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

<sub>Desenvolvido com ❤️ por Karla Renata | © 2026</sub>

</div>
