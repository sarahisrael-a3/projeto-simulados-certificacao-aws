# Guia Para Iniciantes

Atualizado em: 2026-06-18

Este guia e para quem esta chegando agora e quer contribuir sem se perder.

## Visao Geral

O projeto tem tres modos de funcionar:

1. Frontend offline com JSON/localStorage.
2. Frontend usando API Express quando ela esta online.
3. API Express persistindo dados em PGlite.

## Estrutura Que Voce Precisa Saber

```text
src/frontend/js/        logica do app
src/frontend/styles/    CSS fonte
src/services/api.js     comunicacao com API
public/                 build servido no navegador
data/                   dados fonte
backend/api/            rotas Express
backend/database/       banco PGlite
validation/             painel de validacao
src/python/scripts/     automacoes Python
```

## Primeiro Dia

1. Rode o projeto:

```bash
npm install
npm run dev
```

2. Explore uma certificacao.
3. Faça um simulado curto.
4. Abra `src/frontend/js/app.js`.
5. Abra `src/frontend/js/quizEngine.js`.

## Segundo Passo: API

Configure:

```bash
cp .env.example .env
npm run db:seed
npm run api:start
```

Health:

```text
http://127.0.0.1:3001/api/health
```

## Como Os Dados Chegam Na Tela

```text
data/*.json
  -> npm run build
  -> public/data/*.json
  -> frontend
```

Com API online:

```text
frontend
  -> src/services/api.js
  -> backend/api
  -> backend/database/db.js
  -> PGlite
```

## Como Criar Uma Questao

```bash
cp data/contributions/_TEMPLATE.json data/contributions/clf-c02/minha-questao.json
python src/python/scripts/validate_contribution.py data/contributions/clf-c02/minha-questao.json
```

Uma boa questao tem:

- cenario realista;
- pergunta objetiva;
- alternativas plausiveis;
- resposta inequivoca;
- explicacao didatica;
- referencia confiavel.

## Como Testar

```bash
npm test -- --runInBand
npm run build
```

Testes atuais verificados em 2026-06-18: 9 suites e 77 testes passando.

## Tarefas Boas Para Comecar

- Corrigir texto de documentacao.
- Criar uma questao via template.
- Melhorar mensagem de erro no frontend.
- Adicionar teste pequeno para funcao existente.
- Revisar acessibilidade de uma tela.

## Cuidados

- Nao edite `public/js` ou `public/css` como fonte permanente.
- Nao commite `.env`.
- Nao commite dados locais de PGlite.
- Nao altere arquivos principais de dados sem alinhamento.
- Atualize docs quando mudar fluxo, comando ou contrato.
