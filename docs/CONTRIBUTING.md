# Guia De Contribuicao

Atualizado em: 2026-06-25

Obrigado por contribuir com o Cloud Certification Study Tool. Este projeto e um laboratorio colaborativo para aprender Cloud, Dados, UX e Desenvolvimento de Software na pratica.

## Pre-Requisitos

- Git.
- Conta no GitHub.
- Node.js 18+.
- npm.
- Python 3.12+ para scripts em `src/python/scripts/`.

## Setup Local

```bash
git clone <link-do-seu-fork>
cd projeto-simulados-certificacao-aws
npm install
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Para API/PGlite local, configure no `.env`:

```ini
NODE_ENV=development
DB_DATA_DIR=.pglite-data
PORT=3001
```

Instalar dependencias Python:

```bash
pip install -r src/python/scripts/requirements.txt
```

## Verificacao Antes Do PR

```bash
npm test -- --runInBand
npm run build
```

Quando mexer em JavaScript/CSS:

```bash
npm run lint
npm run format:check
```

## Branches

Use nomes descritivos:

```text
feature/ui/nome-curto-issue
fix/api/nome-curto-issue
docs/roadmap/nome-curto-issue
data/clf-c02/nome-curto-issue
```

Se nao houver issue, use um nome claro e abra o PR explicando contexto.

## Commits

Use Conventional Commits:

```bash
git commit -m "feat(api): adiciona filtro de questoes"
git commit -m "fix(frontend): corrige fallback offline"
git commit -m "docs: atualiza roadmap"
git commit -m "data(clf-c02): adiciona questao sobre s3"
```

## Contribuir Com Questoes

Nao edite diretamente os arquivos principais em `data/*.json` sem alinhamento com mantenedores. Para novas contribuicoes, use `data/contributions/`.

1. Copie um template:

```bash
cp data/contributions/_TEMPLATE.json data/contributions/clf-c02/questao-s3-versionamento.json
```

2. Preencha a questao com cenario realista, alternativas plausiveis, resposta correta, explicacao e referencia oficial.

3. Valide:

```bash
python src/python/scripts/validate_contribution.py data/contributions/clf-c02/questao-s3-versionamento.json
```

4. Abra PR com o arquivo novo.

## Contribuir Com Codigo

Areas principais:

- Frontend: `src/frontend/js/` e `src/frontend/styles/`.
- API: `backend/api/`.
- Banco: `backend/database/`.
- Automacoes: `src/python/scripts/`.
- Documentacao: `docs/`.

Regras praticas:

- Preserve fallback offline.
- Preserve `src/` como fonte e `public/` como artefato de build.
- Ao mexer em diagnostico ou recomendacoes, confirme que o quiz normal continua usando `startQuiz()` e `QuizEngine.loadQuestions()`.
- Rode testes relevantes.
- Atualize docs quando mudar contrato, comando ou fluxo.

## Pull Request

Inclua no PR:

- O que mudou.
- Por que mudou.
- Como foi testado.
- Riscos conhecidos.
- Screenshots quando houver mudanca visual.

Checklist minimo:

- [ ] Rodei testes relevantes.
- [ ] Rodei build quando mexi em frontend/dados/validation.
- [ ] Atualizei documentacao quando necessario.
- [ ] Nao commitei `.env` nem dados locais de PGlite.
- [ ] Nao editei `public/` manualmente sem atualizar a fonte correspondente.
