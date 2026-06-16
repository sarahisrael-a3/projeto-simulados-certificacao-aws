# Checklist do Projeto

Atualizado em: 2026-06-16

Este checklist resume o que foi encontrado como feito, parcial e pendente apos avaliacao do repositorio.

## Verificado Como Feito

- [x] Frontend SPA em HTML, CSS e JavaScript vanilla.
- [x] Build local copiando `src/frontend/js`, `src/frontend/styles`, `src/services`, `data/` e painel de validacao para `public/`.
- [x] PWA com manifest e service worker.
- [x] Simulado principal por certificacao.
- [x] Teste diagnostico por certificacao.
- [x] Modo flashcards.
- [x] Pratica de questoes erradas.
- [x] Filtro por topico/dominio.
- [x] Troca de idioma PT/EN.
- [x] Tema claro/escuro.
- [x] Historico e progresso local via `storageManager`.
- [x] Badges, streak e progresso de gamificacao local.
- [x] Dashboard de desempenho e graficos.
- [x] Insights de estudo.
- [x] Relatorio PDF de desempenho.
- [x] Pomodoro.
- [x] Sprint de estudo de 14 dias.
- [x] Trilha visual de gamificacao.
- [x] Desafios interativos de gamificacao.
- [x] Dados principais para CLF-C02, SAA-C03, DVA-C02 e AIF-C01.
- [x] Dados de nivelamento/diagnostico para as quatro certificacoes.
- [x] API Express com health check.
- [x] Rotas REST de questoes: listar, buscar, criar, atualizar e remover logicamente.
- [x] Rotas REST de quiz: iniciar, responder, ver resultados e detalhes.
- [x] Rotas REST de usuarios: criar usuario, estatisticas e dominios fracos.
- [x] Rota REST de leaderboard.
- [x] Camada PGlite com schema, inicializacao, queries e fechamento gracioso.
- [x] CRUD de questoes no banco.
- [x] Usuarios anonimos no banco.
- [x] Historico de quiz e respostas no banco.
- [x] Calculo de acertos no backend sem confiar no `is_correct` enviado pelo cliente.
- [x] Estatisticas, ranking e dominios fracos no backend.
- [x] `apiService` com normalizacao de resposta, timeout e fallback.
- [x] Scripts Python para validacao, traducao, geracao, deteccao de duplicatas e merge de contribuicoes.
- [x] Templates de contribuicao de questoes.
- [x] Painel estatico de validacao iniciado.
- [x] Workflows GitHub Actions para deploy Pages, testes JS, validacao de contribuicoes e automacoes.
- [x] Testes Jest passando: 8 suites, 73 testes.
- [x] Documentacao principal atualizada para a API Express real e comandos oficiais.
- [x] Workflow JS observando `src/frontend/js/**`, `src/services/**`, `backend/**`, `scripts/**` e `__tests__/**`.
- [x] Seed reprodutivel dos JSONs principais para PGlite via `npm run db:seed`.
- [x] Seed PGlite validado localmente apos configurar `DB_DATA_DIR` no `.env`.
- [x] Documentacao atualizada para orientar novos contribuidores sobre `DB_DATA_DIR`, `.env.example` e PowerShell.
- [x] Testes de integracao Express para health, listar questoes, iniciar quiz, responder e obter resultado.
- [x] Painel de validacao sinalizado claramente como modo demo/mock sem persistencia.

## Parcial Ou Em Risco

- [ ] A API existe e esta documentada, mas ainda precisa de validacao manual completa com o frontend em ambiente local.
- [ ] O frontend tem API preferencial e fallback local, mas algumas telas ainda dependem diretamente dos JSONs.
- [ ] O painel de validacao esta corretamente marcado como demo/mock, mas ainda nao persiste aprovacoes/rejeicoes.
- [ ] O backend FastAPI de validacao contem muitos TODOs e ainda nao esta integrado ao banco oficial.
- [ ] Ha sinais de encoding inconsistente em arquivos exibidos no terminal.
- [ ] Alguns arquivos `*-en.json` contem trechos em portugues ou traducao mista.
- [ ] Ha pequenas diferencas de quantidade entre alguns pares PT/EN.
- [ ] Existem duplicacoes entre `src/` e `public/`; e necessario tratar `src/` como fonte e `public/` como build.

## Falta Fazer

- [x] Atualizar `docs/ROUTES_AND_INTEGRATIONS.md` para refletir a API Express real.
- [x] Criar comando e documentacao oficial para rodar frontend + API + PGlite juntos.
- [x] Criar seed dos JSONs para PGlite.
- [x] Criar testes de integracao para endpoints Express.
- [ ] Criar testes e2e para fluxos principais do usuario.
- [ ] Implementar endpoints reais para validacao de questoes pendentes.
- [ ] Persistir status de validacao, validador, data e motivo de rejeicao.
- [x] Remover mocks do painel de validacao ou deixar claramente como modo demo.
- [ ] Decidir arquitetura final: Express, FastAPI ou backend unificado.
- [ ] Auditar qualidade das questoes e traducoes.
- [ ] Gerar relatorio de duplicidades e semelhancas por certificacao.
- [ ] Definir padrao final de campos de questao.
- [ ] Revisar acessibilidade do app.
- [ ] Revisar responsividade mobile em navegadores reais.
- [ ] Implementar testes adaptativos por dominio e dificuldade.
- [ ] Ligar recomendacoes aos dominios fracos calculados pelo backend.
- [ ] Criar autenticacao ou identidade anonima sincronizada.
- [ ] Preparar ranking comunitario com privacidade.
- [ ] Planejar deploy de API e banco fora do ambiente local.
- [ ] Criar observabilidade minima para backend.
- [ ] Documentar arquitetura AWS alvo e estimativa de custos.

## Comandos De Verificacao

- [x] `npm test -- --runInBand`
- [x] `npm test -- __tests__/api.integration.test.js --runInBand`
- [x] `npm run lint` (0 erros, 72 warnings de `console`)
- [x] `npm run format:check`
- [x] `npm run build`
- [x] `npm run db:seed` validado com `NODE_ENV=test` e `DB_DATA_DIR=memory://`
- [x] `npm run db:seed` validado localmente apos configurar `DB_DATA_DIR`
- [ ] Teste manual do app em `public/`
- [ ] Teste manual da API em `http://127.0.0.1:3001/api/health`

## Observacoes

- O build deve ser executado apos alteracoes em `src/`, `validation/` ou `data/` para sincronizar `public/`.
- A contagem atual dos JSONs principais em `data/` e: CLF-C02 402 PT / 402 EN, SAA-C03 295 PT / 293 EN, DVA-C02 287 PT / 287 EN, AIF-C01 290 PT / 289 EN.
- Seed em memoria leu 2.545 registros, importou 2.423 e ignorou 122 duplicados pela chave natural `certification + domain + question_text`.
- `format:check` foi corrigido com caminhos CSS explicitos no `package.json` para evitar falha de glob no Windows.
- `DB_DATA_DIR` e obrigatorio fora de `NODE_ENV=test`; use `.env` local ou defina `$env:DB_DATA_DIR=".pglite-data"` no PowerShell.
