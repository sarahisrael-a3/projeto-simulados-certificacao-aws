# Sumario Executivo

Atualizado em: 2026-06-25

## Estado Atual

O projeto evoluiu de um simulador estatico para uma plataforma local-first com frontend PWA, dados JSON versionados, API Express, banco PGlite, validacao colaborativa e automacoes Python.

## Entregas Reais

- Frontend SPA/PWA funcional.
- Quatro certificacoes cobertas: CLF-C02, SAA-C03, DVA-C02 e AIF-C01.
- 2.545 registros JSON principais PT/EN.
- Diagnosticos por certificacao.
- Diagnostico transformado em acao: lista dominios fracos e inicia simulado personalizado.
- Flashcards, Pomodoro, dashboard, insights, relatorio PDF e gamificacao.
- Card "O Que Estudar Agora" com recomendacoes por dominios fracos.
- API Express local.
- PGlite com schema relacional.
- Seed dos JSONs para PGlite.
- Painel de validacao integrado tecnicamente a API.
- Testes Jest passando.

## Verificacao De 2026-06-25

- `npm test`: 9 suites, 82 testes, sucesso.
- `npm run build`: sucesso.
- `npm run lint`: sucesso com 0 erros e 77 warnings de `console`.
- `npm run format:check`: sucesso.

## Principais Pendencias

- Teste manual completo com frontend + API + PGlite seedado.
- Reducao ou justificativa dos 77 warnings de `console` reportados pelo lint.
- E2E de navegador.
- OpenAPI, se o contrato da API estabilizar.
- Auditoria de qualidade PT/EN.
- Decisao sobre o backend FastAPI legado em `validation/backend/`.

## Decisoes Tecnicas Vigentes

- `src/`, `data/` e `validation/` sao fontes.
- `public/` e artefato de build.
- Express + PGlite sao o backend oficial atual.
- JSON/localStorage continuam como fallback offline.
- Validacao colaborativa esta consolidada no Express.
- Diagnostico personalizado ainda e frontend-first: nao cria endpoint novo nem altera backend.

## Proxima Sprint Recomendada

1. Rodar app completo com API + PGlite.
2. Validar manualmente simulado, resultados, leaderboard e painel de validacao.
3. Reduzir ou justificar os 77 warnings de `console`.
4. Evoluir `docs/API.md` para OpenAPI se necessario.
5. Criar e2e minimo.
6. Auditar dados PT/EN.
