# ☁️ AWS Certification Study Tool

![Status](https://img.shields.io/badge/Status-Ativo-success?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-informational?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.12+-informational?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

Simulador colaborativo para estudos de certificações AWS, desenvolvido pela **Guilda dos Estagiários da A3Data**.

O projeto combina uma **SPA/PWA em HTML, CSS e JavaScript vanilla**, uma **API local em Express**, banco de dados **PGlite**, dados versionados em **JSON**, automações em **Python** e testes automatizados com **Jest**.

> Este é um projeto educacional independente e não possui afiliação oficial com a AWS.

---

## 📌 Status do Projeto

Atualizado em: **2026-06-18**

* Frontend SPA/PWA funcional, servido a partir de `public/` e gerado por `npm run build`.
* Fonte do frontend em `src/frontend/`.
* Cliente HTTP centralizado em `src/services/api.js`.
* Base principal com **2.545 registros JSON** em `data/`.
* Certificações contempladas:

  * **AWS Certified Cloud Practitioner — CLF-C02**
  * **AWS Certified Solutions Architect Associate — SAA-C03**
  * **AWS Certified Developer Associate — DVA-C02**
  * **AWS Certified AI Practitioner — AIF-C01**
* Suporte aos idiomas **Português** e **Inglês**.
* Diagnósticos por certificação em `data/nivelamento/`.
* API Express local em `backend/api/server.js`.
* Banco PGlite persistente em `backend/database/`.
* Painel de validação em `validation/`.
* Fallback offline por JSON e `localStorage` quando a API não está disponível.
* Última verificação:

  * `npm test -- --runInBand`: **9 suites e 77 testes passando**.
  * `npm run build`: **concluído com sucesso**.

---

## 🎯 Objetivo

O objetivo do projeto é apoiar a preparação para certificações AWS por meio de uma experiência de estudo prática, mensurável e evolutiva.

A ferramenta permite que o usuário pratique simulados, acompanhe progresso, identifique domínios fracos, revise conteúdos com flashcards e utilize recursos complementares de estudo, como Pomodoro e relatórios.

Além disso, o projeto também serve como laboratório técnico para a Guilda dos Estagiários, reunindo práticas de frontend, backend, banco local, testes, automações e curadoria de dados.

---

## ✅ O Que Já Funciona

| Funcionalidade                         | Status    |
| -------------------------------------- | --------- |
| Simulados por certificação             | Funcional |
| Testes diagnósticos                    | Funcional |
| Flashcards                             | Funcional |
| Pomodoro                               | Funcional |
| Histórico local de progresso           | Funcional |
| Dashboard com gráficos                 | Funcional |
| Insights de performance                | Funcional |
| Relatório PDF                          | Funcional |
| Tema claro/escuro                      | Funcional |
| Troca de idioma PT/EN                  | Funcional |
| PWA com manifest e service worker      | Funcional |
| Fallback offline por JSON/localStorage | Funcional |
| API Express local                      | Funcional |
| Seed dos JSONs para PGlite             | Funcional |
| Validação de questões com status       | Funcional |
| Testes automatizados com Jest          | Funcional |

---

## 🧱 Arquitetura Geral

O projeto foi estruturado para funcionar tanto como aplicação frontend offline quanto como aplicação completa com API e banco local.

```text
JSON versionado
     │
     ├──> Frontend SPA/PWA
     │        ├── Simulados
     │        ├── Flashcards
     │        ├── Diagnósticos
     │        ├── Dashboard
     │        └── localStorage
     │
     └──> Seed PGlite
              │
              └── API Express
                    ├── Questões
                    ├── Quiz
                    ├── Usuários
                    ├── Estatísticas
                    ├── Domínios fracos
                    ├── Leaderboard
                    └── Validação de questões
```

A aplicação prioriza resiliência: se a API não estiver disponível, o frontend continua funcionando com os dados JSON e armazenamento local.

---

## 🛠️ Stack Tecnológica

| Camada                  | Tecnologia                                         |
| ----------------------- | -------------------------------------------------- |
| Frontend                | HTML, CSS e JavaScript Vanilla                     |
| SPA/PWA                 | `manifest.json`, `service worker` e `localStorage` |
| Backend                 | Node.js + Express                                  |
| Banco local             | PGlite                                             |
| Dados                   | JSON versionado                                    |
| Automação               | Python 3.12+                                       |
| Testes                  | Jest                                               |
| Build                   | Scripts Node                                       |
| Servidor local frontend | live-server                                        |

---

## 📦 Requisitos

Antes de executar o projeto, garanta que você possui:

* **Node.js 18+**
* **npm**
* **Git**
* **Python 3.12+** apenas para automações em `src/python/scripts/`

---

## ⚙️ Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

No Windows/PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure o `.env` para execução local da API e do PGlite:

```ini
NODE_ENV=development
DB_DATA_DIR=.pglite-data
PORT=3001
```

> Fora de `NODE_ENV=test`, a variável `DB_DATA_DIR` é obrigatória.

O arquivo `.env` é local e não deve ser commitado.

---

## ▶️ Rodar Apenas o Frontend

Use esta opção quando quiser testar a interface com fallback por JSON/localStorage.

```bash
npm run dev
```

O comando executa o build e serve a pasta `public/`.

Acesse a URL exibida no terminal, normalmente:

```text
http://127.0.0.1:8080
```

---

## 🗄️ Preparar o Banco PGlite

Para popular o banco local com os JSONs principais:

```bash
npm run db:seed
```

Opcionalmente, informe o diretório de dados:

```bash
npm run db:seed -- --data-dir .pglite-data
```

---

## 🚀 Rodar o App Completo Localmente

Para testar o fluxo completo com frontend, API e banco local, use os passos abaixo.

Primeiro, instale as dependências e prepare o banco:

```bash
npm install
npm run db:seed
```

Depois, use dois terminais separados.

### Terminal 1 — API Express

```bash
npm run api:start
```

Health check:

```text
http://127.0.0.1:3001/api/health
```

### Terminal 2 — Frontend

```bash
npm run dev
```

Acesse a URL exibida no terminal, normalmente:

```text
http://127.0.0.1:8080
```

---

## 🧪 Testes e Verificação

Para executar a suíte de testes:

```bash
npm test
```

Para executar os testes em série:

```bash
npm test -- --runInBand
```

Verificação recomendada antes de apresentar ou abrir pull request:

```bash
npm test -- --runInBand
npm run build
```

Resultado da última verificação registrada em **2026-06-18**:

```text
9 suites passando
77 testes passando
build concluído com sucesso
```

---

## 💻 Comandos Disponíveis

| Comando                   | Descrição                                            |
| ------------------------- | ---------------------------------------------------- |
| `npm test`                | Executa a suíte Jest                                 |
| `npm test -- --runInBand` | Executa os testes em série                           |
| `npm run lint`            | Verifica o JavaScript do frontend                    |
| `npm run format`          | Formata arquivos do frontend/public                  |
| `npm run format:check`    | Verifica a formatação                                |
| `npm run build`           | Copia `src/` e `data/` para `public/`                |
| `npm run dev`             | Executa build e inicia o servidor local em `public/` |
| `npm run db:seed`         | Popula o PGlite com os JSONs principais              |
| `npm run db:start`        | Inicializa camada demonstrativa antiga               |
| `npm run api:start`       | Inicia a API Express oficial atual                   |

---

## 📂 Estrutura do Projeto

```text
backend/
  api/                  API Express e rotas REST
  database/             PGlite, schema, normalizadores, seed e testes

data/                   Fonte dos JSONs de questões e diagnósticos

docs/                   Documentação técnica, planejamento e guias

public/                 Artefato servido pelo frontend/PWA

scripts/                Scripts de build e seed

src/
  frontend/             Fonte principal do frontend
  services/             Cliente HTTP da API
  python/scripts/       Automações de validação, tradução e geração

validation/             Painel interno de validação

__tests__/              Testes Jest
```

> Trate `src/`, `data/` e `validation/` como fontes do projeto.
> O diretório `public/` é sincronizado por `npm run build`.

---

## 🧩 Dados e Certificações

A base principal está versionada em arquivos JSON dentro de `data/`.

Atualmente o projeto contempla:

| Certificação                                | Código  |
| ------------------------------------------- | ------- |
| AWS Certified Cloud Practitioner            | CLF-C02 |
| AWS Certified Solutions Architect Associate | SAA-C03 |
| AWS Certified Developer Associate           | DVA-C02 |
| AWS Certified AI Practitioner               | AIF-C01 |

Os dados são usados em dois fluxos principais:

1. **Frontend offline/fallback**
   O app pode consumir os JSONs diretamente quando a API não está disponível.

2. **Banco PGlite**
   Os JSONs são usados como fonte para popular o banco local via seed.

---

## 🧾 Validação de Questões

O projeto possui um fluxo interno de validação de questões com os seguintes status:

| Status     | Descrição                      |
| ---------- | ------------------------------ |
| `PENDING`  | Questão pendente de revisão    |
| `APPROVED` | Questão aprovada para uso      |
| `REJECTED` | Questão rejeitada na curadoria |

O painel de validação está localizado em:

```text
validation/
```

Ele se integra aos endpoints Express responsáveis por listar pendências e registrar aprovação ou rejeição.

---

## 🌐 API Express

A API local está localizada em:

```text
backend/api/server.js
```

Ela oferece endpoints para:

* Questões
* Quiz
* Usuários
* Estatísticas
* Domínios fracos
* Leaderboard
* Validação de questões

Health check local:

```text
http://127.0.0.1:3001/api/health
```

Consulte a documentação de rotas em:

```text
docs/ROUTES_AND_INTEGRATIONS.md
```

---

## 🗄️ Banco de Dados PGlite

A camada de banco está localizada em:

```text
backend/database/
```

Ela contém:

* Schema do banco
* Normalizadores
* Scripts de seed
* Testes relacionados à persistência
* Configuração de diretório local

Para preparar o banco:

```bash
npm run db:seed
```

Consulte também:

```text
docs/PGLITE_SETUP.md
```

---

## 📱 PWA e Fallback Offline

O projeto possui suporte a PWA por meio dos arquivos:

```text
public/manifest.json
public/sw.js
```

Quando a API não está disponível, o app utiliza:

* JSONs versionados em `data/`
* Dados copiados para `public/`
* Armazenamento local via `localStorage`

Isso permite que o usuário continue estudando mesmo em modo offline ou sem backend ativo.

---

## 🔐 Variáveis de Ambiente

O projeto usa `.env` para configuração local.

Exemplo mínimo para desenvolvimento:

```ini
NODE_ENV=development
DB_DATA_DIR=.pglite-data
PORT=3001
```

Regras importantes:

* `.env` não deve ser commitado.
* `.env.example` deve conter apenas valores de exemplo.
* Fora de `NODE_ENV=test`, `DB_DATA_DIR` é obrigatório.
* Dados locais do PGlite devem ficar fora do versionamento.

---

## 📚 Documentação

Para entender melhor a arquitetura, evolução e regras do projeto, consulte:

* [Checklist](docs/CHECKLIST.md)
* [Roadmap](docs/ROADMAP.md)
* [Épicos e Tasks](docs/EPICOS-E-TASKS.md)
* [Rotas e Integrações](docs/ROUTES_AND_INTEGRATIONS.md)
* [Arquitetura](docs/ARCHITECTURE.md)
* [PGlite Setup](docs/PGLITE_SETUP.md)
* [Guia de Contribuição](docs/CONTRIBUTING.md)

---

## 🧭 Roadmap Resumido

Próximas evoluções possíveis:

* Melhorar a curadoria e validação das questões.
* Evoluir o dashboard de performance.
* Adicionar filtros mais avançados por domínio, dificuldade e idioma.
* Melhorar a experiência mobile.
* Ampliar cobertura de testes.
* Documentar contratos da API.
* Melhorar acessibilidade da interface.
* Evoluir o painel de validação.
* Preparar ambiente para deploy futuro.

Consulte o roadmap completo em:

```text
docs/ROADMAP.md
```

---

## 🤝 Contribuição

Contribuições são bem-vindas.

Antes de contribuir:

1. Leia o guia de contribuição.
2. Rode os testes.
3. Rode o build.
4. Evite commitar arquivos locais, logs, `.env` ou dados gerados.
5. Abra uma branch específica para sua alteração.

Comandos recomendados antes de abrir PR:

```bash
npm test -- --runInBand
npm run build
npm run lint
```

Guia completo:

```text
docs/CONTRIBUTING.md
```

---

## 🧯 Problemas Comuns

### A API não inicia

Verifique se o `.env` existe e se contém:

```ini
DB_DATA_DIR=.pglite-data
PORT=3001
```

Também confira se a porta `3001` já não está em uso.

### O frontend abre, mas não carrega dados da API

Confirme se a API está rodando:

```text
http://127.0.0.1:3001/api/health
```

Se a API estiver indisponível, o app deve usar o fallback por JSON/localStorage.

### O banco não foi populado

Execute novamente:

```bash
npm run db:seed
```

### Os testes travam ou ficam instáveis

Execute em série:

```bash
npm test -- --runInBand
```

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

Consulte o arquivo:

```text
LICENSE
```

---

## 👥 Créditos

Projeto desenvolvido de forma colaborativa pela **Guilda dos Estagiários da A3Data**, com foco em aprendizado prático, certificações cloud, engenharia de software e evolução técnica contínua.
