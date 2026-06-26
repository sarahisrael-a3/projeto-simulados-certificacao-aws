# Correcao: finalizacao duplicada do simulado

Data: 2026-06-26

## Bug identificado

Ao clicar em "Ver Resultado"/"Finalizar Simulado", a mesma tentativa podia executar o fluxo de finalizacao mais de uma vez e inserir varias entradas iguais em "Ultimas Sessoes".

## Causa raiz

- O botao de finalizar nao mantinha uma trava persistente para a tentativa ja finalizada.
- `StorageManager.saveQuizResult()` sempre adicionava o resultado ao historico com `unshift`, sem verificar se a tentativa ja tinha sido salva.
- O card "O Meu Progresso" e badges dependiam mais do estado de gamificacao/trilha do que do historico real de sessoes concluidas.

## Arquivos alterados

- `src/frontend/js/app.js`
- `src/frontend/js/quizEngine.js`
- `src/frontend/js/storageManager.js`
- `public/js/app.js`
- `public/js/quizEngine.js`
- `public/js/storageManager.js`
- `__tests__/storageManager.test.js`
- `docs/CHECKLIST.md`

## Antes e depois

Antes:
- Cliques repetidos na finalizacao podiam gerar sessoes duplicadas.
- O historico aceitava a mesma tentativa mais de uma vez.
- Progresso e badges podiam ficar vazios mesmo com sessoes concluidas no historico.

Depois:
- Cada tentativa recebe `attemptId`.
- A finalizacao usa `isFinishing`/`hasFinished` e desabilita o botao durante o processamento.
- O historico ignora nova gravacao com o mesmo `attemptId`/`quizId`.
- Progresso, ofensiva e badges usam o historico salvo como fallback de verdade local.

## Testes executados

- `npm test -- --runInBand`: 9 suites, 85 testes passaram.
- `npm run build`: build concluido com sucesso e `public/` sincronizado.

## Observacao

Duplicatas antigas no `localStorage` nao foram apagadas automaticamente. A correcao impede novas duplicatas e calcula progresso por sessoes unicas quando ha identificadores suficientes.
