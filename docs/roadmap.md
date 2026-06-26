# Roadmap Do Projeto

Atualizado em: 2026-06-25

Este roadmap mostra a evolucao real do repositorio. O projeto nao e mais apenas um simulador estatico: hoje combina SPA/PWA, dados JSON versionados, API Express, PGlite, validacao colaborativa, automacoes Python, seed e testes.

## Status Geral

| Frente | Status | Evidencia |
| --- | --- | --- |
| Frontend SPA/PWA | Funcional | `public/index.html`, `src/frontend/js/`, `public/manifest.json`, `public/sw.js` |
| Dados JSON | Funcional | 2.545 registros principais em `data/*.json` |
| API Express | Funcional com pendencias | `backend/api/server.js`, rotas em `backend/api/routes/` |
| PGlite | Funcional | `backend/database/db.js`, `schema.sql`, `db.test.js` |
| Seed JSON -> PGlite | Funcional e verificado | `npm run db:seed` leu 2.545 registros em 2026-06-18 |
| Validacao colaborativa | Funcional tecnicamente | `validation/js/validationAPI.js`, rotas `/pending` e `/validate` |
| Testes Jest | Verde em 2026-06-25 | 9 suites, 82 testes |
| Produto cloud/comunidade | Planejado | autenticacao real, producao API, observabilidade e governanca ainda pendentes |

## Marcos Concluidos

- Simulados para CLF-C02, SAA-C03, DVA-C02 e AIF-C01.
- Base bilingue PT/EN dos simulados principais.
- Diagnosticos por certificacao.
- PWA com cache/offline.
- LocalStorage para historico, progresso e gamificacao local.
- Flashcards, Pomodoro, sprint de 14 dias, trilha e desafios.
- Dashboard, graficos, insights e relatorio PDF.
- Card "O Que Estudar Agora" com foco por dominios fracos.
- Diagnostico que gera simulado personalizado dos dominios fracos.
- API Express para questoes, quiz, usuarios, stats, dominios fracos e leaderboard.
- PGlite com schema relacional, views, normalizadores e testes.
- Seed dos JSONs principais para PGlite.
- Validacao de questoes via Express + PGlite.
- Helmet, CORS, rate limit e error handler na API.
- Build automatizado para `public/`.

## Fase 1 - Estabilizacao Da Base

Objetivo: garantir que o que existe rode com previsibilidade.

- [x] Consolidar frontend em `src/frontend/` com build para `public/`.
- [x] Documentar comandos oficiais.
- [x] Manter fallback offline.
- [x] Manter Jest verde.
- [x] Verificar build em 2026-06-25.
- [x] Rodar `npm run lint` e `npm run format:check`.
- [ ] Reduzir ou justificar os 77 warnings de `console` do lint.
- [ ] Evitar edicoes manuais permanentes em `public/`.
- [ ] Padronizar encoding dos documentos legados.

## Fase 2 - API + PGlite Como Caminho Local Oficial

Objetivo: manter JSON como fallback, mas usar API/PGlite quando disponiveis.

- [x] Criar API Express.
- [x] Criar camada PGlite.
- [x] Implementar seed reprodutivel.
- [x] Implementar questoes, quiz, usuarios, stats e leaderboard.
- [x] Integrar frontend por `apiService`.
- [x] Documentar rotas reais em `docs/ROUTES_AND_INTEGRATIONS.md`.
- [x] Verificar API local com PGlite persistente seedado via `GET /api/health` e `GET /api/questions/pending?limit=2`.
- [ ] Uniformizar contrato de resposta.
- [ ] Completar rotas opcionais de historico/gamificacao se continuarem no escopo.
- [x] Criar `docs/API.md`.
- [ ] Criar OpenAPI, se necessario.
- [ ] Teste manual completo do app com API persistente.

## Fase 3 - Validacao Colaborativa

Objetivo: revisar questoes em uma tela interna e persistir decisao.

- [x] Criar painel em `validation/`.
- [x] Publicar painel no build.
- [x] Adicionar campos de validacao em `questions`.
- [x] Implementar `getPendingQuestions()` e `validateQuestion()`.
- [x] Implementar `GET /api/questions/pending`.
- [x] Implementar `POST /api/questions/:id/validate`.
- [x] Rejeicao exige motivo.
- [x] Persistir `validation_status`, `rejection_reason`, `validated_by`, `validated_at` e `validation_logs`.
- [x] Criar testes de integracao de validacao.
- [x] Verificar endpoint de pendencias com API + PGlite seedado.
- [ ] Testar a tela manualmente no navegador com API + PGlite seedado.
- [ ] Decidir o futuro do FastAPI em `validation/backend/`.
- [ ] Avaliar tabela normalizada de auditoria.

## Fase 4 - Qualidade Dos Dados

Objetivo: aumentar confianca tecnica e pedagogica da base.

- [x] Manter quatro certificacoes.
- [x] Manter templates de contribuicao.
- [x] Manter validadores Python.
- [ ] Auditar traducoes EN.
- [ ] Corrigir diferencas PT/EN onde existirem.
- [ ] Relatorio de duplicidade/semelhanca.
- [ ] Criterios finais de dificuldade e qualidade.
- [ ] Revisao tecnica por especialistas AWS.

## Fase 5 - Produto E Experiencia

Objetivo: evoluir de simulador para plataforma de estudo guiado.

- [x] Simulados, diagnostico, flashcards, relatorios e Pomodoro.
- [x] Trilha visual e sprint de 14 dias.
- [x] Insights locais.
- [x] Recomendacoes locais e diagnostico focado conectados a dominios fracos.
- [ ] Conectar recomendacoes principais ao backend de dominios fracos quando a API estiver disponivel.
- [ ] Teste adaptativo por dominio/dificuldade/historico.
- [ ] Acessibilidade completa.
- [ ] Testes e2e de UI.
- [ ] Responsividade validada em dispositivos reais.

## Fase 6 - Plataforma, Comunidade E Escala

Objetivo: preparar uso maior sem depender so de estado local.

- [ ] Autenticacao real ou identidade anonima sincronizada.
- [ ] Ambiente de producao para API e banco.
- [ ] Ranking comunitario com privacidade.
- [ ] Sincronizacao cloud de progresso.
- [ ] Observabilidade: logs estruturados, metricas e erros.
- [ ] Governanca e moderacao de contribuicoes.
- [ ] Arquitetura AWS alvo e estimativa de custos.

## Prioridades Recomendadas

1. Validar manualmente o app completo com API + PGlite seedado.
2. Reduzir ou justificar os 77 warnings de `console` do lint.
3. Evoluir `docs/API.md` para OpenAPI se o contrato estabilizar.
4. Criar e2e minimo para fluxos criticos.
5. Auditar dados PT/EN e duplicidades.
6. Decidir destino do backend FastAPI de validacao.

## Evidencia De Verificacao

- `npm test`: 9 suites passaram, 82 testes passaram em 2026-06-25.
- `npm run build`: passou em 2026-06-25.
- `npm run db:seed`: passou em 2026-06-18, com 2.545 registros lidos e ja presentes no PGlite.
- API local: `GET /api/health` e `GET /api/questions/pending?limit=2` retornaram HTTP 200 em 2026-06-18.
- Contagem atual em `data/`: 2.545 registros principais PT/EN.
- `npm run lint`: passou com 0 erros e 77 warnings de `console` em 2026-06-25.
- `npm run format:check`: passou em 2026-06-18.
- `npm audit --omit=dev`: passou com 0 vulnerabilidades de producao em 2026-06-18.
