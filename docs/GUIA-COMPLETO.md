# Guia Completo

Atualizado em: 2026-06-25

Este guia consolida o uso do projeto por estudantes, contribuidores e desenvolvedores.

## Inicio Rapido

### Usar Online

Acesse:

```text
https://karlarenatadev.github.io/projeto-simulados-certificacao-aws/
```

Escolha uma certificacao, configure o simulado e inicie.

### Rodar Localmente

```bash
npm install
npm run dev
```

O frontend roda com JSON/localStorage mesmo sem API.

### Rodar Com API E Banco

```bash
cp .env.example .env
npm run db:seed
npm run api:start
```

Em outro terminal:

```bash
npm run dev
```

## Funcionalidades

- Simulados para CLF-C02, SAA-C03, DVA-C02 e AIF-C01.
- Diagnosticos por certificacao.
- Lista de dominios fracos ao finalizar diagnostico.
- CTA para praticar dominios fracos com simulado personalizado.
- Flashcards.
- Pomodoro.
- Historico e progresso local.
- Dashboard e graficos.
- Insights de estudo.
- Card "O Que Estudar Agora".
- Relatorio PDF.
- Tema claro/escuro.
- Idiomas PT/EN.
- PWA/offline.
- API/PGlite opcional como caminho persistente local.
- Painel interno de validacao de questoes.

## Dados

Fonte principal:

```text
data/
  clf-c02.json
  clf-c02-en.json
  saa-c03.json
  saa-c03-en.json
  dva-c02.json
  dva-c02-en.json
  aif-c01.json
  aif-c01-en.json
  nivelamento/
  gamificacao/
  contributions/
```

Contagem em 2026-06-25: 2.545 registros principais PT/EN.

## Contribuir Com Questoes

Use `data/contributions/`:

```bash
cp data/contributions/_TEMPLATE.json data/contributions/clf-c02/minha-questao.json
python src/python/scripts/validate_contribution.py data/contributions/clf-c02/minha-questao.json
```

Boas praticas:

- Use cenario realista.
- Evite pergunta ambigua.
- Use referencia oficial AWS.
- Explique por que a alternativa correta e correta.
- Nao copie dumps de prova.

## Automacoes Python

Instale:

```bash
pip install -r src/python/scripts/requirements.txt
```

Scripts principais:

- `auto_generate_questions.py`
- `quick_generate.py`
- `generator.py`
- `aws_semantic_validator.py`
- `duplicate_detector.py`
- `translate_with_api.py`
- `translate_aws_questions.py`
- `merge_contributions.py`
- `validate_contribution.py`

## API E PGlite

API:

```bash
npm run api:start
```

Health:

```text
GET http://127.0.0.1:3001/api/health
```

Rotas principais:

- `GET /api/questions`
- `POST /api/quiz/start`
- `POST /api/quiz/:id/answer`
- `GET /api/quiz/:id/results`
- `POST /api/users`
- `GET /api/users/:id/stats`
- `GET /api/users/:id/weak-domains`
- `GET /api/leaderboard`
- `GET /api/questions/pending`
- `POST /api/questions/:id/validate`

## Diagnostico E Simulado Personalizado

O fluxo de diagnostico funciona assim:

1. O usuario inicia o Raio-X da Nuvem.
2. O app carrega questoes de `data/nivelamento/` ou tenta API quando disponivel.
3. Ao finalizar, `domainScores` registra acertos por dominio.
4. Dominios abaixo de 60% sao tratados como fracos.
5. Se nenhum dominio estiver abaixo de 60%, o menor percentual vira foco sugerido.
6. O CTA "Praticar dominios fracos" inicia um simulado em modo revisao.

O simulado personalizado prioriza questoes dos dominios fracos e completa com questoes gerais da mesma certificacao quando necessario.

## Testes

```bash
npm test -- --runInBand
npm run build
```

Verificacao de 2026-06-25:

- 9 suites passaram.
- 82 testes passaram.
- Build passou.

## Resolucao De Problemas

### `DB_DATA_DIR is required outside the test environment`

Configure `.env`:

```env
DB_DATA_DIR=.pglite-data
```

### Questoes nao carregam no frontend

Rode:

```bash
npm run build
npm run dev
```

Confirme que os arquivos existem em `public/data/`.

### API nao responde

1. Confirme `.env`.
2. Rode `npm run db:seed`.
3. Rode `npm run api:start`.
4. Acesse `/api/health`.

## Leitura Recomendada

- `docs/LEIA-ME-PRIMEIRO.md`
- `docs/ONBOARDING_VISUAL.md`
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/ROUTES_AND_INTEGRATIONS.md`
- `docs/EPICOS-E-TASKS.md`
- `docs/CHECKLIST.md`
