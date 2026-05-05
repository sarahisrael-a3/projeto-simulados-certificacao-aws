# 🌿 Gitflow - Guia de Trabalho: Simulados AWS

Este é o guia completo de Gitflow e conceitos de Git para o projeto **Simulados Certificação AWS**.

---

## 📋 Requisitos

- ✅ Git instalado e configurado  
- ✅ Conta no GitHub com SSH ou Token configurado  
- ✅ Acesso à aba de Issues do repositório para gerenciar as tarefas  

---

## 🌳 Estrutura de Branches

Trabalharemos com 3 tipos de branches principais, adaptando o modelo de homologação contínua:

| Branch | Propósito | Deploy/Automação |
|--------|----------|------------------|
| `hml` | Ambiente de homologação e testes de integração | ✅ Sim (GitHub Actions) |
| `main` | Ambiente de produção | ✅ Sim (com restrições) |
| `feature/*`, `fix/*`, `docs/*` | Branches locais de trabalho | ❌ Não |

---

## 📝 Padrão de Nomenclatura das Branches

Toda branch local deve seguir o formato:

`{acao}/{contexto}/{descricao}-{id-issue}`

⚠️ **Regra Importante:**  
O **ID da Issue é obrigatório** para rastreabilidade.

---

### 🔹 Ações

- `feature` → Nova funcionalidade  
- `fix` → Correção de bug  
- `hotfix` → Correção urgente em produção  
- `refactor` → Refatoração de código  
- `docs` → Documentação  
- `data` → Dados/simulados  

---

### 🔹 Contextos do Projeto

- `engine` → Lógica do quiz  
- `ui` → Interface e gamificação  
- `scripts` → Scripts Python  
- `dataset` → Dados JSON  
- `ci` → Pipelines (GitHub Actions)  

---

### 💡 Exemplos

- Nova funcionalidade (Issue #12)  
  `feature/scripts/validador-semantico-12`

- Correção de bug (Issue #45)  
  `fix/ui/correcao-xp-badges-45`

- Novos dados (Issue #23)  
  `data/dataset/novas-questoes-saac03-23`

---

## 💾 Padrão de Commits (Conventional Commits)

Os commits devem ser claros e descritivos:

- `git commit -m "feat(scripts): adiciona script para detectar questoes duplicadas"`
- `git commit -m "fix(engine): ajusta timer do pomodoro manager"`
- `git commit -m "data(dataset): atualiza json do aif-c01 com 50 novas questoes"`
- `git commit -m "ci(workflows): adiciona step de auto-merge para contribuicoes"`

---

## 🔄 Fluxo de Trabalho (Gitflow na Prática)

### 1. Iniciando o Trabalho

Sempre parta da branch `hml`:

- `git checkout hml`
- `git pull origin hml`
- `git checkout -b feature/scripts/novo-gerador-aws-34`

---

### 2. Pull Request (PR) e Code Review

Ao finalizar:

- **Source:** `feature/...`  
- **Target:** `hml`  

Descrição do PR:

- Use palavras-chave como:  
  `Resolves #34`

- Marque como **Draft** se ainda estiver em desenvolvimento  

---

### 3. Validação Contínua (CI/CD)

Ao abrir o PR, serão executados automaticamente:

- ✅ `test-javascript.yml` → valida o motor do quiz  
- ✅ `test-python-scripts.yml` → valida scripts  
- ✅ `validate-contributions.yml` → valida novas questões  

---

### 4. Deploy para Produção (`main`)

Após validação em `hml`:

- Abrir PR de `hml` → `main`  
- Pipeline garante integridade do código  
- Proteções evitam alterações diretas indevidas  

---