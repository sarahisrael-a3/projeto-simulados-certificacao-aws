# Task 3.1 / Issue #39 - Origem Dos Erros Na Revisao

Atualizado em: 2026-06-26

## Contexto

A issue #39 faz parte do Epico 3 (#38), "Revisao de erros completa". Esta task nao implementa o quiz de erros. Ela documenta a origem atual dos erros, a fonte de verdade recomendada e os riscos que a Task 3.2 deve respeitar antes de implementar a revisao real.

## Escopo

Incluido:

- Mapear onde as respostas erradas existem hoje.
- Documentar gravacao, leitura e limpeza.
- Definir a fonte de verdade atual e a recomendada para a proxima task.
- Descrever um teste manual esperado para o fluxo errar -> revisar -> acertar -> sair da lista.
- Registrar riscos tecnicos.

Fora do escopo:

- Implementar `startMistakesQuiz()`.
- Criar quiz de erros.
- Alterar arquitetura.
- Corrigir bugs de produto encontrados.

## Arquivos analisados

- `src/frontend/js/app.js`
- `src/frontend/js/quizEngine.js`
- `src/frontend/js/quizManager.js`
- `src/frontend/js/storageManager.js`
- `src/frontend/js/recommendations/studyNow.js`
- `src/services/api.js`
- `backend/api/routes/quizzes.js`
- `backend/database/db.js`
- `backend/database/schema.sql`
- `__tests__/storageManager.test.js`
- `__tests__/quizEngine.test.js`
- `__tests__/api.integration.test.js`
- `__tests__/apiService.test.js`
- `__tests__/buttonHandlers.test.js`
- `public/index.html`
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/CHECKLIST.md`
- `docs/EPICOS-E-TASKS.md`

## Fonte de verdade definida

### Fonte atual

A fonte real atual do fluxo local e o `localStorage`.

Na pratica, os erros existem em dois lugares locais:

- `aws_sim_history`: historico de sessoes finalizadas salvo por `StorageManager.saveQuizResult()`. Cada sessao contem `answers`, e cada resposta tem `isCorrect`.
- `aws_sim_quiz_answers_<quizId>`: log por quiz salvo diretamente por `quizManager._saveAnswerLocally()`, quando existe `quizManager.currentQuizId` e a questao tem `id`.

Nao existe hoje uma chave dedicada como `aws_sim_mistakes`, nem uma lista persistida de "erros pendentes de revisao".

### Fonte recomendada para a Task 3.2

Para a proxima task, a fonte de verdade recomendada continua sendo localStorage, por compatibilidade com a arquitetura local-first:

- base de leitura: `aws_sim_history`;
- acesso centralizado: `storageManager.js`;
- criterio de pendencia: respostas com `isCorrect === false`, filtradas por `certId`;
- identificador minimo recomendado: `certId + question.id`, quando houver `id`; fallback temporario: `certId + domain + question`.

O log `aws_sim_quiz_answers_<quizId>` nao deve ser a fonte principal da revisao nesta fase, porque depende de `question.id`. Os JSONs principais em `data/*.json` nao possuem `id` estavel nas questoes, entao esse log pode simplesmente nao existir no fallback local.

### Fonte futura possivel

A tabela `answers` no PGlite/backend e a fonte futura natural para respostas por questao, mas ainda nao deve ser tratada como fonte real do fluxo de revisao de erros.

Motivo:

- o backend e opcional no frontend;
- o app precisa continuar funcionando offline/local-first;
- nao ha endpoint de "erros pendentes";
- nao ha fluxo de resolucao/remocao de erros no backend;
- a UI de revisao de erros nao consome a tabela `answers`.

## Ciclo de vida atual

### Gravacao durante o quiz

1. O usuario confirma uma resposta em `submitAnswer()`.
2. `QuizEngine.submitAnswer()` calcula `isCorrect` no frontend e adiciona a resposta em `engine.state.answers`.
3. Se existir `quizManager.currentQuizId` e a questao tiver `id`, `quizManager.recordAnswer()` e chamado.
4. `quizManager.recordAnswer()` sempre tenta gravar uma copia local em `aws_sim_quiz_answers_<quizId>`.
5. Se a API estiver disponivel e o quiz nao for `local_`, a resposta tambem e enviada para `POST /api/quiz/:id/answer`.
6. No backend, `backend/database/db.js` calcula a corretude contra `questions.correct_answer` e grava em `answers`.

Observacao: no fluxo JSON/local, as questoes principais nao possuem `id`, entao o passo 3 pode nao acontecer. Ainda assim, a resposta fica em `engine.state.answers` ate a finalizacao.

### Gravacao ao finalizar

1. `finishQuiz()` chama `saveQuizResult()`.
2. `saveQuizResult()` chama `engine.getFinalResults()`.
3. O resultado final contem `answers`, `domainScores`, `weakDomains`, `score`, `total`, `percentage` e `certId`.
4. `storageManager.saveQuizResult()` salva:
   - `aws_sim_last_<certId>` com o ultimo resultado completo daquela certificacao;
   - `aws_sim_history` com a sessao no historico.

Hoje, `aws_sim_history` e o registro local mais completo e consistente para reconstruir erros depois de uma sessao finalizada.

### Leitura atual

O fluxo de revisao de erros nao le erros hoje.

O que existe:

- `public/index.html` tem botoes `btn-practice-mistakes` e `btn-clear-mistakes`, ambos inicialmente ocultos.
- `wireUIActions()` liga esses botoes a `startMistakesQuiz()` e `clearMistakes()`.
- `startMistakesQuiz()` apenas exibe a mensagem traduzida `mistakes_feature_coming`.
- `clearMistakes()` apenas mostra confirmacao, alerta sucesso e esconde botoes; nao remove dados do `localStorage`.

Portanto, a revisao de erros esta parcial/apenas com estado vazio amigavel. Ela nao inicia quiz, nao busca perguntas erradas e nao remove erros acertados.

### Limpeza/remocao atual

Nao existe limpeza real de erros.

Fluxos existentes:

- `clearMistakes()` nao remove nenhuma chave do `localStorage`.
- `storageManager.clearHistory()` remove `aws_sim_history`, mas isso limpa todo o historico de sessoes, nao apenas erros.
- `storageManager.clearAll()` remove todas as chaves com prefixo `aws_sim_`.

## Comportamento esperado para a revisao

Quando a Task 3.2 implementar a revisao real:

1. Uma resposta errada deve entrar na lista de erros pendentes.
2. A lista deve ser filtrada por certificacao (`certId`).
3. A mesma questao nao deve aparecer duplicada para a mesma certificacao.
4. Ao acertar a questao em modo revisao de erros, ela deve sair da lista de pendentes.
5. Ao errar novamente em modo revisao, ela deve permanecer pendente.
6. Ao limpar erros, apenas a lista de erros pendentes deve ser removida, sem apagar todo o historico do usuario.
7. Se nao houver erros, a UI deve manter estado vazio claro e nao iniciar quiz sem dados.

## Cenario manual de teste esperado

1. Selecionar uma certificacao, por exemplo CLF-C02.
2. Iniciar um simulado curto.
3. Errar uma questao conhecida.
4. Finalizar o simulado.
5. Verificar que a questao errada aparece como pendente na fonte local definida para erros.
6. Clicar em "Praticar Questoes Erradas".
7. Confirmar que o quiz de revisao inicia apenas com erros da certificacao atual.
8. Acertar a questao em revisao.
9. Voltar ao inicio.
10. Confirmar que a questao saiu da lista de erros pendentes.
11. Confirmar que o botao de praticar erros fica oculto ou com contador zero.

## Riscos e bugs encontrados

- Nao ha lista dedicada de erros pendentes.
- `startMistakesQuiz()` ainda nao le dados nem inicia quiz.
- `clearMistakes()` informa sucesso sem apagar dados reais.
- Erros antigos ficariam presos para sempre se a Task 3.2 apenas acumulasse dados sem regra de resolucao.
- Os JSONs principais nao possuem `id` estavel de questao, entao a remocao por erro precisa de fallback consistente.
- A mesma questao pode ser registrada varias vezes se a lista futura nao fizer deduplicacao por certificacao e identificador de questao.
- O historico local e a tabela `answers` podem divergir quando a API estiver indisponivel ou quando a questao nao tiver `id`.
- O log `aws_sim_quiz_answers_<quizId>` nao e filtrado por certificacao dentro da propria chave; a certificacao precisa vir do quiz/sessao associada.
- Nao ha endpoint backend para listar erros pendentes nem para marcar erro como resolvido.
- A tabela `answers` registra respostas individuais, mas ainda nao participa da UI de revisao de erros.
- Testes atuais cobrem motor de quiz, storage e ciclo de API, mas nao cobrem registro, listagem, limpeza ou resolucao de erros pendentes.

## Impacto na Task 3.2

A Task 3.2 deve implementar a revisao de erros respeitando esta decisao:

- manter o fluxo local-first;
- centralizar leitura/escrita em `storageManager.js`;
- nao depender de API para funcionar;
- filtrar por `certId`;
- deduplicar questoes erradas;
- definir regra explicita de remocao ao acertar;
- manter estado vazio quando nao houver erros;
- tratar ausencia de `question.id` nos JSONs.

Se a Task 3.2 optar por usar backend, antes sera necessario criar contrato de API para:

- listar erros pendentes por usuario e certificacao;
- marcar erro como resolvido;
- deduplicar respostas por questao;
- reconciliar estado local/offline com PGlite.

## Proximos passos

1. Criar helpers no `StorageManager` para listar, contar, limpar e resolver erros pendentes.
2. Definir identificador estavel para questoes sem `id`.
3. Implementar `startMistakesQuiz()` consumindo a fonte local definida.
4. Implementar remocao ao acertar em revisao.
5. Adicionar testes unitarios para errar -> revisar -> acertar -> sair da lista.
6. Planejar sincronizacao futura com `answers`, sem bloquear o fluxo local.
