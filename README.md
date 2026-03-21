# 🎓 AWS Certified Cloud Simulator - Pro Edition

![Python](https://img.shields.io/badge/Python-3670A0?style=flat&logo=python)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chart.js)
![PWA](https://img.shields.io/badge/PWA-000?style=flat&logo=progressive-web-apps)

Uma plataforma de elite para **simulados AWS**, unindo **Engenharia de Dados com Python**, **IA Generativa** e uma **experiência de usuário (UX) de alto nível**.  

Este simulador é um ecossistema completo, focado em **Clean Code, Integridade de Dados e Performance**.

---

## 🏗 Arquitetura do Ecossistema

O projeto segue uma abordagem de **Arquitetura Desacoplada (Decoupled Architecture)**:

| Camada | Tecnologias | Função |
|--------|------------|-------|
| **Data Layer** | Python + Pydantic | Pipeline de curadoria e sanitização que garante que todas as questões sigam um contrato de dados estrito |
| **Storage Layer** | JSON | Bancos de dados categorizados por certificação oficial (CLF, SAA, AIF, DVA) |
| **Application Layer** | Vanilla JS + ES6 | Motor de simulado assíncrono com gerenciamento de estado global e reatividade de DOM |
| **Presentation Layer** | TailwindCSS + Chart.js | Interface mobile-first, feedback visual imediato, análise de radar |

---

## 📂 Estrutura do Projeto

```text
├── .github/workflows   # CI/CD: Automação de testes (GitHub Actions)
├── data/               # Bancos de dados JSON validados
├── docs/               # Documentação técnica modular
├── scripts_python/     # Pipeline: IA, Auditoria, Análise
│   ├── generator.py    # Orquestrador de IA Generativa (Gemini API)
│   ├── sanity_check.py # Validador de Integridade de Dados
│   └── analyzer.py     # Dashboard de cobertura e estatísticas
├── tests/              # Testes unitários do motor de simulado
├── app.js              # Motor principal e gestão de estado
├── data.js             # Mapeamento de certificações e trilhas oficiais
├── sw.js               # Service Worker PWA
└── index.html          # Interface semântica e acessível
````

---

## ⚙️ Engenharia de Dados e Integridade

* **Validação Estrita:** Cada questão precisa ter **mínimo de 30 caracteres** e **exatamente 4 opções de resposta**.
* **Mapeamento de Domínios:** Validação obrigatória para os serviços oficiais da AWS (S3, Lambda, EC2, etc).
* **Sanity Check Automatizado:** Script percorre toda a pasta `data/` reportando inconsistências e garantindo integridade.

---

## 🤖 IA Generativa

* O `generator.py` utiliza **Gemini 2.0 Flash** (Google) para gerar questões de exame realistas.
* **Prompt Engineering:** Simula comportamento de um arquiteto AWS sênior.
* **Resiliência de Quota:** Retry com *exponential backoff* para erros de API.
* **Injeção Automática:** Questões validadas pelo Pydantic antes de serem adicionadas ao banco JSON.

---

## 🚀 Diferenciais Técnicos

### 📊 Radar Chart

* Implementado em **Chart.js**, com preenchimento de área, paddings dinâmicos e legibilidade otimizada.
* Feedback visual imediato do desempenho em cada domínio oficial.

### 🛡️ Segurança e Acessibilidade

* Sanitização via `textContent` para prevenir XSS.
* Atributos ARIA e roles semânticas para navegação por teclado e acessibilidade.

### 📱 Experiência PWA

* Instalável em **Android/iOS**.
* Funciona **100% offline**, ideal para estudo em qualquer lugar.

---

## 🎯 Funcionalidades Premium

* ✅ **Cards Interativos:** Letra destacada, estados de seleção e feedback visual.
* ✅ **Modo Exame vs Estudo:** Timer regressivo ou revisão imediata com explicações.
* ✅ **Deep Linking:** Botões para **AWS Whitepapers** em cada resposta.
* ✅ **Gamificação:** Sistema de streaks e badges (`Gabarito`, `Focado`).
* ✅ **Banco de Erros:** Pratique apenas questões incorretas, persistido no `localStorage`.

---

## 🛠 Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/karlarenatadev/projeto-simulados-certificacao-aws.git
```

2. Abra no **VS Code**.
3. Abra `index.html` e inicie o **Live Server** (ou `python -m http.server 5500`).
4. Acesse: [http://127.0.0.1:5500](http://127.0.0.1:5500)

---

## 📈 Roadmap

* ✅ **V1.0** — Motor básico de questões
* ✅ **V2.0** — Migração para JSON + Pydantic
* ✅ **V3.0** — UI Premium com Cards + Radar Chart
* ⬜ **V4.0** — Exportação de relatório em PDF
* ⬜ **V5.0** — Deploy automatizado via **AWS S3 + CloudFront (CI/CD)**

---

## 🌐 Demo Online

*(Quando disponível, após deploy em S3 + CloudFront)*

```
https://simulador-aws.karlarenata.dev
```

---

## 💡 Dica Final

> "A certificação é o seu destino, a disciplina é o seu motor.
> Pratique até o gráfico de radar estar totalmente preenchido."
> – Karla Renata

---

## 📄 Licença

Projeto **educacional**, desenvolvido por **Karla Renata**. Destinado a portfólio técnico e demonstração de competências em engenharia de dados e desenvolvimento web.
