# Sumario Executivo

Atualizado em: 2026-06-18

## Estado Atual

O projeto evoluiu de um simulador estatico para uma plataforma local-first com frontend PWA, dados JSON versionados, API Express, banco PGlite, validacao colaborativa e automacoes Python.

## Entregas Reais

- Frontend SPA/PWA funcional.
- Quatro certificacoes cobertas: CLF-C02, SAA-C03, DVA-C02 e AIF-C01.
- 2.545 registros JSON principais PT/EN.
- Diagnosticos por certificacao.
- Flashcards, Pomodoro, dashboard, insights, relatorio PDF e gamificacao.
- API Express local.
- PGlite com schema relacional.
- Seed dos JSONs para PGlite.
- Painel de validacao integrado tecnicamente a API.
- Testes Jest passando.

## Verificacao De 2026-06-18

- `npm test -- --runInBand`: 9 suites, 77 testes, sucesso.
- `npm run build`: sucesso.
- `npm run lint`: sucesso com 0 erros e 72 warnings de `console`.
- `npm run format:check`: sucesso.

## Principais Pendencias

- Teste manual completo com frontend + API + PGlite seedado.
- Reducao ou justificativa dos 72 warnings de `console` reportados pelo lint.
- E2E de navegador.
- OpenAPI ou `docs/API.md`.
- Auditoria de qualidade PT/EN.
- Decisao sobre o backend FastAPI legado em `validation/backend/`.

## Decisoes Tecnicas Vigentes

- `src/`, `data/` e `validation/` sao fontes.
- `public/` e artefato de build.
- Express + PGlite sao o backend oficial atual.
- JSON/localStorage continuam como fallback offline.
- Validacao colaborativa esta consolidada no Express.

## Proxima Sprint Recomendada

1. Rodar app completo com API + PGlite.
2. Validar manualmente simulado, resultados, leaderboard e painel de validacao.
3. Reduzir ou justificar warnings de `console`.
4. Criar documentacao de API dedicada.
5. Criar e2e minimo.
6. Auditar dados PT/EN.
