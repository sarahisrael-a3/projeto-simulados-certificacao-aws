# Onboarding Visual

Atualizado em: 2026-06-25

Leia este arquivo quando quiser entender o projeto em poucos minutos.

## Mapa Mental

```text
Usuario
  |
  v
Frontend SPA/PWA
  |
  |-- usa API se estiver online
  |      |
  |      v
  |   Express API -> PGlite
  |
  |-- usa fallback se API falhar
         |
         v
      JSON + localStorage
```

## Onde Esta Cada Coisa

```text
src/frontend/           codigo da interface
src/services/api.js     cliente HTTP usado pelo frontend
public/                 build servido ao navegador
data/                   questoes, diagnosticos e desafios
backend/api/            API Express
backend/database/       PGlite e schema
validation/             painel interno de validacao
src/python/scripts/     automacoes de dados e IA
docs/                   documentacao
__tests__/              testes Jest
```

## O Que Ja Existe

- Simulados e diagnosticos.
- Simulado personalizado gerado a partir dos dominios fracos do diagnostico.
- Card "O Que Estudar Agora".
- Flashcards.
- Pomodoro.
- Dashboard e relatorios.
- PWA/offline.
- API Express.
- Banco local PGlite.
- Painel de validacao integrado a API.
- Testes automatizados.

## Como Rodar Em 15 Minutos

```bash
npm install
npm run dev
```

Para o app completo:

```bash
cp .env.example .env
npm run db:seed
npm run api:start
```

Em outro terminal:

```bash
npm run dev
```

## Sequencia Recomendada Para Aprender

1. Rode `npm run dev` e explore o app.
2. Leia `src/frontend/js/app.js`.
3. Leia `src/frontend/js/quizEngine.js`.
4. Leia `src/services/api.js`.
5. Leia `backend/api/server.js`.
6. Leia `backend/database/db.js`.
7. Leia `docs/EPICOS-E-TASKS.md`.

## Conceitos-Chave

| Conceito | Significado |
| --- | --- |
| Local-first | O app continua funcionando com JSON/localStorage |
| API opcional | Quando Express esta online, o frontend usa backend |
| PGlite | Banco local persistente, parecido com PostgreSQL |
| Build | Copia fontes para `public/` |
| Validacao | Fluxo interno para aprovar/rejeitar questoes |
| Dominios fracos | Dominios com baixo percentual de acerto no diagnostico ou historico |
| Simulado personalizado | Quiz em modo revisao priorizando dominios fracos |

## Primeira Contribuicao

Escolha uma rota:

- Documentacao: ajuste um `.md` e rode build/test se necessario.
- Frontend: edite `src/frontend/`, rode `npm run build`.
- API: edite `backend/api/`, rode testes.
- Dados: crie arquivo em `data/contributions/` e valide com Python.

Checklist:

- [ ] Entendi qual arquivo e fonte.
- [ ] Rodei teste relevante.
- [ ] Atualizei docs se mudei contrato ou fluxo.
- [ ] Abri PR com resumo claro.
