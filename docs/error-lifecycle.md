# Task 3.1 / Issue #39 - Origem Dos Erros Na Revisao

Atualizado em: 2026-06-26

## Contexto

A issue #39 faz parte do Epico 3 (#38), "Revisao de erros completa". A primeira rodada documentou a origem dos erros. A rodada atual implementa a base local persistida para erros reais do usuario, sem montar ainda o quiz real de revisao.

## Escopo

Incluido:

- Mapear onde as respostas erradas existem hoje.
- Documentar gravacao, leitura e limpeza.
- Definir a fonte de verdade atual e a recomendada para a proxima task.
- Implementar persistencia local dedicada para erros pendentes.
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

A fonte real atual do fluxo local e o `localStorage`, centralizada em `StorageManager`.

Os erros pendentes agora usam uma chave dedicada:

- `aws_sim_mistakes`: mapa por certificacao e questao, escrito por `storageManager.recordMistake()`.

Estrutura resumida:

```json
{
  "clf-c02": {
    "question-id": {
      "questionId": "question-id",
      "certification": "clf-c02",
      "domain": "cloud",
      "question": "...",
      "options": ["...", "..."],
      "selectedAnswer": 0,
      "selectedAnswerText": "...",
      "correctAnswer": 1,
      "correctAnswerText": "...",
      "wrongCount": 2,
      "firstWrongAt": "2026-06-26T00:00:00.000Z",
      "lastWrongAt": "2026-06-26T00:10:00.000Z",
      "source": "simulation",
      "attemptId": "attempt_...",
      "quizId": "local_quiz_...",
      "resolved": false
    }
  }
}
```

Dados complementares continuam existindo em:

- `aws_sim_history`: historico de sessoes finalizadas salvo por `StorageManager.saveQuizResult()`. Cada sessao contem `answers`, e cada resposta tem `isCorrect`.
- `aws_sim_quiz_answers_<quizId>`: log por quiz salvo diretamente por `quizManager._saveAnswerLocally()`, quando existe `quizManager.currentQuizId` e a questao tem `id`.

### Fonte recomendada para a Task 3.2

Para a proxima task, a fonte de verdade recomendada continua sendo localStorage, por compatibilidade com a arquitetura local-first:

- base de leitura: `aws_sim_mistakes`;
- acesso centralizado: `storageManager.js`;
- criterio de pendencia: registros em `aws_sim_mistakes[certId]`;
- identificador: `question.id`/`question_id`, quando houver; fallback deterministico por `domain + question`.

`aws_sim_history` segue importante para relatorios e auditoria, mas nao deve ser a fonte primaria da lista de erros pendentes.

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
3. Se a resposta estiver errada, `syncMistakeRecord()` chama `storageManager.recordMistake()`.
4. `recordMistake()` grava ou atualiza `aws_sim_mistakes[certId][questionId]`.
5. Se a mesma questao for errada novamente na mesma certificacao, `wrongCount` e incrementado e `lastWrongAt` atualizado.
6. Se existir `quizManager.currentQuizId` e a questao tiver `id`, `quizManager.recordAnswer()` tambem e chamado.
7. `quizManager.recordAnswer()` sempre tenta gravar uma copia local em `aws_sim_quiz_answers_<quizId>`.
8. Se a API estiver disponivel e o quiz nao for `local_`, a resposta tambem e enviada para `POST /api/quiz/:id/answer`.

Observacao: no fluxo JSON/local, quando a questao nao tem `id`, `recordMistake()` usa fallback deterministico por dominio + texto da questao. Isso permite deduplicar sem depender do backend.

### Gravacao ao finalizar

1. `finishQuiz()` chama `saveQuizResult()`.
2. `saveQuizResult()` chama `engine.getFinalResults()`.
3. O resultado final contem `answers`, `domainScores`, `weakDomains`, `score`, `total`, `percentage` e `certId`.
4. `storageManager.saveQuizResult()` salva:
   - `aws_sim_last_<certId>` com o ultimo resultado completo daquela certificacao;
   - `aws_sim_history` com a sessao no historico.

`aws_sim_history` continua registrando a sessao finalizada, mas a lista de erros pendentes ja nao depende da finalizacao do quiz.

### Leitura atual

O fluxo visual de revisao ainda nao monta um quiz de erros, mas a base ja pode ser lida por `storageManager.getMistakes(certId)`.

O que existe:

- `public/index.html` tem botoes `btn-practice-mistakes` e `btn-clear-mistakes`, exibidos quando ha erros pendentes na certificacao atual.
- `wireUIActions()` liga esses botoes a `startMistakesQuiz()` e `clearMistakes()`.
- `startMistakesQuiz()` ainda apenas exibe a mensagem traduzida `mistakes_feature_coming`.
- `clearMistakes()` remove `aws_sim_mistakes[certId]`, atualiza contador/botoes e nao apaga historico, gamificacao ou relatorios.

Portanto, a revisao de erros esta com persistencia real, mas ainda nao inicia quiz nem busca perguntas para execucao.

### Limpeza/remocao atual

Existe limpeza real de erros pendentes por certificacao.

Fluxos existentes:

- `storageManager.removeMistake(questionOrId, certId)` remove uma questao pendente.
- `storageManager.clearMistakes(certId)` remove os erros pendentes de uma certificacao.
- `storageManager.clearMistakes()` remove toda a chave `aws_sim_mistakes`.
- `storageManager.clearHistory()` remove `aws_sim_history`, mas isso limpa todo o historico de sessoes, nao apenas erros.
- `storageManager.clearAll()` remove todas as chaves com prefixo `aws_sim_`.

Ao acertar uma questao em modo `review` ou `mistakes-review`, `syncMistakeRecord()` chama `removeMistake()`. O modo `mistakes-review` ainda sera usado pela proxima task quando o quiz real de erros for implementado.

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
5. Verificar em DevTools > Application > Local Storage que `aws_sim_mistakes` contem a questao errada.
6. Clicar em "Praticar Questoes Erradas".
7. Confirmar que o quiz de revisao inicia apenas com erros da certificacao atual.
8. Acertar a questao em revisao.
9. Voltar ao inicio.
10. Confirmar que a questao saiu da lista de erros pendentes.
11. Confirmar que o botao de praticar erros fica oculto ou com contador zero.

## Riscos e bugs encontrados

- `startMistakesQuiz()` ainda nao le dados nem inicia quiz.
- Erros antigos ficariam presos para sempre se a Task 3.2 apenas acumulasse dados sem regra de resolucao.
- Os JSONs principais podem nao ter `id` estavel de questao; a implementacao atual usa fallback por dominio + texto, que pode mudar se o enunciado for editado.
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

1. Implementar `startMistakesQuiz()` consumindo `storageManager.getMistakes(certId)`.
2. Montar o quiz real apenas com questoes pendentes da certificacao atual.
3. Usar modo `mistakes-review` para remover erro ao acertar sem confundir com simulado normal.
4. Definir UX quando uma questao pendente nao puder mais ser encontrada nos JSONs.
5. Planejar sincronizacao futura com `answers`, sem bloquear o fluxo local.
6. Planejar sincronizacao futura com `answers`, sem bloquear o fluxo local.
