# Roadmap do Projeto

Atualizado em: 2026-06-16

Este roadmap reflete a avaliacao do estado atual do repositorio. A plataforma ja saiu do MVP estatico puro e hoje combina frontend SPA/PWA, dados JSON versionados, automacoes de contribuicao, API Express com PGlite e modulos de gamificacao.

## Status Geral

| Frente | Status | Evidencia no projeto |
| :--- | :--- | :--- |
| Frontend de simulados | Concluido e em evolucao | `public/index.html`, `src/frontend/js/app.js`, `quizEngine.js`, `quizManager.js` |
| Base de questoes | Concluido e em manutencao | 2.545 questoes nos JSONs principais PT/EN em `data/` |
| Flashcards, historico e relatorios | Concluido e em evolucao | `flashcards.js`, `storageManager.js`, `pdfReport.js`, dashboard de resultados |
| Sprint de 14 dias e trilhas | Concluido para a versao atual | `sprintManager.js`, `sprintData.js`, `trailManager.js`, testes dedicados |
| API e banco local | Parcial | API Express + PGlite implementados, mas uso em producao ainda opcional/local |
| Validacao interna de questoes | Parcial | UI mock existe; backend FastAPI ainda contem TODOs e dados mock |
| CI/CD e deploy | Parcial | GitHub Actions para testes, deploy e validacao existem; alguns paths precisam revisao |
| Plataforma comunitaria | Planejado | Autenticacao real, perfis persistentes cloud e ranking publico ainda faltam |

## Marcos Concluidos

- Motor de quiz com suporte a prova principal, diagnostico, questoes marcadas e pratica de erros.
- Suporte a quatro certificacoes: CLF-C02, SAA-C03, DVA-C02 e AIF-C01.
- Base bilingue PT/EN para simulados principais e diagnosticos.
- PWA com `manifest.json`, service worker e cache de dados JSON.
- Persistencia local via `localStorage` para historico, progresso, badges, streak e erros.
- Flashcards por certificacao/dominio.
- Dashboard de desempenho com graficos e insights.
- Relatorio PDF de desempenho.
- Pomodoro e cronometros de estudo/prova.
- Sprint de estudos de 14 dias e trilhas de gamificacao.
- API Express em `backend/api/server.js` com rotas de questoes, usuarios, quiz e leaderboard.
- Camada PGlite em `backend/database/db.js` com CRUD de questoes, historico, respostas, gamificacao, ranking, estatisticas e dominios fracos.
- Testes automatizados em Jest cobrindo quiz, storage, sprint, insights, handlers, API service e banco.
- Build script copiando JS, CSS, services, dados e painel de validacao para `public/`.
- GitHub Actions para deploy Pages, testes JS, validacao de contribuicoes e automacoes auxiliares.

## Fase 1 - Estabilizacao da Base Atual

Objetivo: garantir que o que ja existe seja confiavel, documentado e facil de rodar.

- [x] Consolidar frontend estatico com build para `public/`.
- [x] Manter suite Jest verde.
- [x] Documentar comandos principais em README e docs.
- [x] Centralizar acesso ao backend no `apiService`.
- [x] Revisar documentacao desatualizada que ainda descrevia API como "nao implementada".
- [x] Corrigir caminhos do workflow `test-javascript.yml`, que monitorava diretorios antigos.
- [ ] Padronizar encoding dos arquivos que aparecem com caracteres corrompidos em alguns terminais.
- [ ] Definir processo oficial para atualizar `public/` a partir de `src/` sem alteracoes manuais divergentes.

## Fase 2 - Integracao Real API + Frontend

Objetivo: transformar a API local em caminho principal, mantendo JSON como fallback offline.

- [x] Implementar endpoints REST basicos: health, questions, quiz, users e leaderboard.
- [x] Implementar fallback no frontend quando a API nao esta disponivel.
- [x] Persistir historico e respostas no PGlite.
- [x] Calcular estatisticas, ranking e dominios fracos no banco.
- [x] Definir modo oficial de execucao combinando frontend + API + `DB_DATA_DIR`.
- [x] Popular PGlite a partir dos JSONs atuais por seed/migracao reprodutivel.
- [ ] Ajustar quiz API para embaralhar/selecionar questoes de forma equivalente ao frontend.
- [ ] Conectar fluxo principal do frontend ao backend de forma progressiva, sem perder funcionamento offline.
- [x] Documentar contrato real dos endpoints em `docs/ROUTES_AND_INTEGRATIONS.md`.

## Fase 3 - Validacao Colaborativa de Questoes

Objetivo: tirar o painel interno de validacao do modo mock.

- [x] Criar painel estatico de validacao em `validation/` e publica-lo no build.
- [x] Criar modelos e esqueleto FastAPI para validacao.
- [x] Criar scripts Python para validar, detectar duplicatas, traduzir e mesclar contribuicoes.
- [x] Criar workflow de validacao de contribuicoes JSON em PR.
- [ ] Implementar endpoints reais para listar pendentes e aprovar/reprovar questoes.
- [ ] Persistir status, validador, historico e motivo de rejeicao no banco.
- [ ] Integrar `validation/js/validationAPI.js` com API real.
- [x] Sinalizar painel atual como demo/mock sem persistencia.
- [ ] Decidir se a validacao usara Express, FastAPI ou um unico backend consolidado.
- [ ] Criar testes para fluxo de aprovacao/reprovacao.

## Fase 4 - Qualidade dos Dados e Conteudo

Objetivo: aumentar confianca pedagogica e tecnica da base.

- [x] Manter base principal para quatro certificacoes.
- [x] Manter templates de contribuicao.
- [x] Ter validacao automatizada basica para contribuicoes.
- [ ] Auditar inconsistencias de traducao nos arquivos `*-en.json`.
- [ ] Normalizar contagens PT/EN onde ha diferenca entre pares de arquivos.
- [ ] Definir campos obrigatorios finais: fonte, dominio, dificuldade, explicacao, tags e tipo de resposta.
- [ ] Criar relatorio de duplicidade/semelhanca por certificacao.
- [ ] Criar criterios de qualidade por nivel de dificuldade.

## Fase 5 - Produto e Experiencia de Estudo

Objetivo: evoluir de simulador para plataforma de aprendizado guiado.

- [x] Simulados, diagnostico, flashcards, relatorios e Pomodoro.
- [x] Trilha visual e sprint de 14 dias.
- [x] Insights de estudo com base no historico local.
- [ ] Implementar testes adaptativos (CAT) por dominio, dificuldade e historico.
- [ ] Criar recomendacoes de estudo baseadas nos dominios fracos vindos da API.
- [ ] Melhorar acessibilidade e navegacao por teclado em todos os fluxos.
- [ ] Revisar responsividade em dispositivos reais.
- [ ] Ampliar cobertura de testes para componentes de UI e fluxos de ponta a ponta.

## Fase 6 - Plataforma, Comunidade e Escala

Objetivo: preparar uso por comunidade maior sem depender apenas de estado local.

- [ ] Autenticacao real ou identidade anonima persistente com sincronizacao.
- [ ] Ranking comunitario com regras de privacidade.
- [ ] Sincronizacao cloud de progresso, historico e badges.
- [ ] Ambiente de producao para API e banco.
- [ ] Observabilidade basica: logs estruturados, metricas e erros.
- [ ] Politica de moderacao e governanca para contribuicoes externas.
- [ ] Estudo de custos e arquitetura AWS alvo.
- [ ] Avaliar app mobile nativo ou empacotamento PWA aprimorado.

## Prioridades Recomendadas

1. Validar manualmente o app completo com API + PGlite seedado antes da apresentacao.
2. Auditar qualidade e paridade dos dados PT/EN.
3. Decidir arquitetura final do painel de validacao real.
4. Adicionar testes e2e dos fluxos principais do navegador.
5. Padronizar encoding dos documentos legados.

## Evidencia de Verificacao

- `npm test -- --runInBand`: 8 suites passaram, 73 testes passaram.
- Contagem atual de questoes principais em `data/`: 2.545 registros somando PT/EN.
- `npm run build`: passou.
- `npm run db:seed` validado em memoria: 2.545 registros lidos, 2.423 importados e 122 ignorados por duplicidade natural.
- Arquivos avaliados: `package.json`, `README.md`, `docs/ARCHITECTURE.md`, `docs/ROUTES_AND_INTEGRATIONS.md`, `backend/api/*`, `backend/database/*`, `src/frontend/js/*`, `src/services/api.js`, `scripts/build.cjs`, `.github/workflows/*`.
