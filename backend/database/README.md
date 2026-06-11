# Database Layer

Este documento descreve a camada de banco em `backend/database/db.js`.
Ela usa PGlite para oferecer uma interface PostgreSQL local/persistente para o
backend, com o mesmo schema principal usado pelos testes.

## Visao Geral

`backend/database/db.js` centraliza:

- inicializacao e encerramento da instancia PGlite;
- aplicacao do `backend/database/schema.sql`;
- funcoes publicas para questoes, usuarios, historico de quiz, respostas,
  gamificacao, leaderboard e estatisticas;
- normalizacao de entradas comuns, como certificacoes AWS (`clf-c02` vira
  `CLF-C02`);
- validacoes antes de gravar dados criticos.

No roadmap do Epico 2, esta camada substitui o uso direto de JSON em fluxos que
precisam de persistencia. Arquivos JSON ainda podem existir como fallback,
referencia ou seed futuro, mas a camada de banco ja esta preparada para guardar
e consultar dados persistentes.

## Inicializacao

### `initializeDatabase(options = {})`

Inicializa a instancia PGlite e aplica o schema.

```javascript
import { initializeDatabase } from './backend/database/db.js';

await initializeDatabase({
  dataDir: '.pglite/aws-simulator',
  environment: 'development',
});
```

Regras de configuracao:

- `options.dataDir` tem prioridade sobre `DB_DATA_DIR`.
- `options.environment` tem prioridade sobre `NODE_ENV`.
- se `dataDir` for relativo, ele e resolvido a partir do `process.cwd()`;
- `memory://` e permitido apenas quando o ambiente e `test`;
- fora de `NODE_ENV=test`, `DB_DATA_DIR` ou `options.dataDir` e obrigatorio;
- chamadas concorrentes de inicializacao reutilizam a mesma promise;
- se ja existir uma instancia ativa, ela e reutilizada.

### `getDatabase()`

Retorna a instancia PGlite ativa.

```javascript
import { getDatabase } from './backend/database/db.js';

const db = getDatabase();
const result = await db.query('SELECT COUNT(*)::int AS total FROM questions');
```

Se o banco ainda nao foi inicializado, a funcao lanca:

```text
Database not initialized. Call initializeDatabase() first.
```

### `closeDatabase()`

Fecha a instancia ativa e limpa a referencia global.

```javascript
import { closeDatabase } from './backend/database/db.js';

await closeDatabase();
```

## Ambientes

### Teste

Em `NODE_ENV=test`, quando nenhum `dataDir` e informado, o banco usa
`memory://`.

```javascript
await initializeDatabase({ environment: 'test' });
```

Esse modo e usado pelos testes unitarios de `backend/database/db.test.js`.

### Desenvolvimento

Em desenvolvimento, configure `DB_DATA_DIR` para persistir os dados localmente.

```bash
NODE_ENV=development
DB_DATA_DIR=.pglite/aws-simulator
```

### Producao

Fora de teste, sempre configure um diretorio persistente.

```bash
NODE_ENV=production
DB_DATA_DIR=/var/lib/aws-simulator/pglite
```

## Variaveis de Ambiente

### `DB_DATA_DIR`

Diretorio usado pelo PGlite para persistencia.

- obrigatorio fora de `NODE_ENV=test`;
- pode ser absoluto ou relativo;
- pode ser substituido por `initializeDatabase({ dataDir })`.

### `NODE_ENV`

Define o ambiente padrao.

- `test`: permite `memory://`;
- `development` ou `production`: exige persistencia.

### `DEBUG` e `DB_DEBUG`

Quando `DEBUG=true` ou `DB_DEBUG=true`, queries executadas pela camada sao
logadas no console.

## Schema e Extensoes PGlite

O arquivo `backend/database/schema.sql` declara:

- `pgcrypto`, usado por `gen_random_uuid()`;
- `pg_trgm`, usado para suporte a indices de busca textual;
- enums PostgreSQL, como `certification_type`, `difficulty_level` e
  `session_type`;
- tabelas, indices, triggers e views.

No caminho principal de `initializeDatabase()`, o schema e carregado por
`loadSchema()` antes de ser executado no PGlite. Essa funcao transforma partes
nao suportadas diretamente pelo PGlite usado no projeto:

- remove comandos `CREATE EXTENSION IF NOT EXISTS ...`;
- substitui indice GIN de tags por um indice simples compativel com PGlite.

Ambientes ou scripts que executarem o `schema.sql` diretamente em uma instancia
PGlite precisam carregar as extensoes contrib `pgcrypto` e `pg_trgm` antes de
chamar `db.exec(schemaSql)`.

## Tabelas Principais

### `users`

Usuarios anonimos do simulador.

Campos importantes:

- `id`: UUID;
- `anonymous_name`: nome anonimo unico;
- `created_at` e `updated_at`.

### `questions`

Questoes dos simulados.

Campos importantes:

- `certification`: enum de certificacao AWS;
- `domain`;
- `difficulty`;
- `question_text`;
- `options`;
- `correct_answer`;
- `explanation`;
- `tags`;
- `is_active`.

### `quiz_history`

Historico de tentativas de quiz.

Campos importantes:

- `user_id`;
- `certification`;
- `score`;
- `total_questions`;
- `percentage`;
- `time_spent_secs`;
- `domain_scores`;
- `weak_domains`.

### `answers`

Respostas registradas para cada quiz.

Campos importantes:

- `quiz_id`;
- `question_id`;
- `user_answer`;
- `is_correct`;
- `time_secs`.

`recordAnswer()` calcula `is_correct` no backend com base em
`questions.correct_answer`; o valor enviado pelo caller nao e confiado.

### `gamification`

Progresso e gamificacao do usuario.

Campos importantes:

- `total_quizzes`;
- `best_score`;
- `current_streak`;
- `longest_streak`;
- `badges`;
- `completed_stages`;
- `unlocked_stages`;
- `labs_completed`;
- `xp_points`.

### `focus_sessions`

Historico de sessoes de foco/Pomodoro.

Campos importantes:

- `user_id`;
- `minutes`;
- `session_type`;
- `session_date`.

### `domains`

Dominios e topicos por certificacao.

Campos importantes:

- `certification`;
- `name`;
- `slug`;
- `weight_percent`.

### Views

#### `leaderboard`

Ranking publico por XP. A camada `getLeaderboard()` ordena por `xp_points DESC`
e limita a quantidade retornada.

#### `user_stats`

Estatisticas consolidadas por usuario, combinando quiz e foco. A funcao
`getUserStats()` complementa essa view com dados de respostas e gamificacao.

## Funcoes Publicas

### Core

#### `initializeDatabase(options)`

Inicializa PGlite, aplica schema e retorna a instancia ativa.

#### `getDatabase()`

Retorna a instancia ativa. Lanca erro se o banco nao foi inicializado.

#### `closeDatabase()`

Fecha a instancia ativa.

#### `executeQuery(query, params = [])`

Executa query parametrizada e retorna array de linhas.

#### `executeSql(sql)`

Executa SQL sem retorno estruturado.

### Questoes

#### `getQuestions(certificationOrFilters = {}, domain, difficulty, options = {})`

Lista questoes ativas com filtros opcionais.

Aceita:

```javascript
await getQuestions('CLF-C02', 'seguranca', 'medium', { limit: 10, offset: 0 });
await getQuestions({ certification: 'clf-c02', domain: 'seguranca', limit: 10 });
```

Retorna array de questoes.

#### `getQuestionById(questionId)`

Busca questao ativa por UUID. Retorna a questao ou `null`.

#### `insertQuestion(questionData)`

Insere questao validada e normalizada. Retorna a questao criada.

#### `updateQuestion(questionId, updates)`

Atualiza campos permitidos de uma questao ativa. Retorna a questao atualizada ou
`null`.

#### `deleteQuestion(questionId)`

Faz soft delete, marcando `is_active = false`. Retorna a questao alterada ou
`null`.

#### `searchQuestions(searchTerm, limit = 20)`

Busca termo em `question_text`, `explanation` e `domain`. Escapa caracteres de
wildcard (`%` e `_`) para tratar busca literal.

#### `getQuestionsByDomain(certification, domain, options = {})`

Atalho para buscar questoes por certificacao e dominio.

### Quiz, Historico e Respostas

#### `createQuizHistory(userIdOrData, certification, answersOrMetadata)`

Cria registro de quiz. Suporta assinatura por argumentos ou objeto.

```javascript
await createQuizHistory(user.id, 'clf-c02', { total_questions: 3 });

await createQuizHistory({
  user_id: user.id,
  certification: 'CLF-C02',
  score: 1,
  total_questions: 3,
});
```

Retorna o quiz criado.

#### `getQuizHistory(userId, limit = 10, offset = 0)`

Lista historico do usuario com paginacao segura.

#### `getQuizById(quizId)`

Busca quiz por UUID. Retorna o quiz ou `null`.

#### `recordAnswer(quizIdOrData, questionId, userAnswer, timeSecs)`

Registra uma resposta e recalcula o resumo do quiz dentro de transacao.

Suporta:

```javascript
await recordAnswer(quiz.id, question.id, ['B'], 12);

await recordAnswer({
  quiz_id: quiz.id,
  question_id: question.id,
  user_answer: ['B'],
  time_secs: 12,
});
```

Retorna a resposta registrada com `is_correct`, `explanation` e
`correct_answer`.

#### `getAnswersByQuiz(quizId)`

Lista respostas de um quiz em ordem de registro.

#### `calculateStats(userId)`

Calcula estatisticas agregadas a partir de `quiz_history`, incluindo total de
quizzes, media, melhor score, tempo total, total de perguntas, acertos e
acuracia.

#### `getWeakDomains(userId, threshold = 70)`

Calcula dominios com acuracia abaixo do limiar informado.

### Usuarios

#### `createUser(anonymousName)`

Cria usuario anonimo. `anonymousName` e obrigatorio, unico e limitado a 100
caracteres.

Retorna o usuario criado.

#### `getUserById(userId)`

Busca usuario por UUID. Retorna o usuario ou `null`.

#### `getUserByName(anonymousName)`

Busca usuario por nome anonimo. Retorna o usuario ou `null`.

#### `updateUser(userId, data)`

Atualiza campos permitidos do usuario. Atualmente aceita `anonymousName` ou
`anonymous_name`.

Retorna o usuario atualizado ou `null`.

### Gamificacao, Leaderboard e Estatisticas

#### `getGamification(userId)`

Busca gamificacao do usuario. Se o usuario existe e ainda nao tem registro,
cria um registro padrao.

Lanca `User not found` quando o usuario nao existe.

#### `updateGamification(userId, data)`

Atualiza campos de gamificacao com validacao:

- valores numericos nao podem ser negativos;
- `best_score` precisa estar entre 0 e 100;
- `badges`, `completed_stages` e `unlocked_stages` precisam ser arrays de
  strings;
- `current_streak` nao pode ser maior que `longest_streak`.

Retorna o registro atualizado.

#### `getLeaderboard(limit = 100)`

Retorna usuarios no ranking por XP. O limite tem default seguro e teto de 100.

#### `getUserStats(userId)`

Retorna estatisticas completas do usuario, combinando:

- view `user_stats`;
- totais de respostas em `answers`;
- dados de `gamification`.

Lanca `User not found` quando o usuario nao existe.

## Exemplos de Uso

```javascript
import {
  closeDatabase,
  createQuizHistory,
  createUser,
  getQuestions,
  getUserStats,
  initializeDatabase,
  insertQuestion,
  recordAnswer,
} from './backend/database/db.js';

await initializeDatabase({
  dataDir: '.pglite/aws-simulator',
  environment: 'development',
});

const user = await createUser('CloudNinja#4821');

const question = await insertQuestion({
  certification: 'clf-c02',
  domain: 'seguranca',
  difficulty: 'medium',
  question_text: 'Which AWS service manages identities and permissions?',
  options: [
    { id: 'A', text: 'Amazon EC2' },
    { id: 'B', text: 'AWS IAM' },
    { id: 'C', text: 'Amazon S3' },
  ],
  correct_answer: ['B'],
  explanation: 'AWS IAM manages identities and permissions for AWS resources.',
  reference_url: 'https://aws.amazon.com/iam/',
  tags: ['iam', 'security'],
});

const questions = await getQuestions({
  certification: 'CLF-C02',
  domain: 'seguranca',
  limit: 10,
});

const quiz = await createQuizHistory(user.id, 'CLF-C02', {
  total_questions: questions.length || 1,
});

await recordAnswer(quiz.id, question.id, ['B'], 18);

const stats = await getUserStats(user.id);
console.log(stats);

await closeDatabase();
```

## Troubleshooting

### `DB_DATA_DIR is required outside the test environment`

Configure `DB_DATA_DIR` ou passe `initializeDatabase({ dataDir })` quando o
ambiente nao for `test`.

### `In-memory PGlite is restricted to tests`

`memory://` so e permitido em `NODE_ENV=test`. Em desenvolvimento ou producao,
use um diretorio persistente.

### Erro de enum de certificacao

Certificacoes precisam existir no enum `certification_type` definido no schema.
Exemplos validos incluem `CLF-C02`, `SAA-C03`, `SAP-C02`, `DVA-C02` e outros
presentes no schema.

### `clf-c02` vs `CLF-C02`

A camada normaliza certificacoes conhecidas para maiusculas. Assim, `clf-c02`
vira `CLF-C02` antes de gravar ou consultar.

### Alertas vermelhos no VS Code para `schema.sql`

O schema usa sintaxe PostgreSQL, incluindo enums, triggers, views, comentarios e
extensoes. Alguns plugins genericos de SQL podem sinalizar falsos positivos se
nao estiverem configurados para PostgreSQL.

### `pgcrypto` e `pg_trgm`

O schema declara `pgcrypto` e `pg_trgm`. O caminho principal em `db.js`
transforma comandos de extensao antes de executar no PGlite. Scripts externos
que executarem o schema diretamente em PGlite devem carregar as extensoes
contrib correspondentes antes de aplicar o schema.

### Schema transformado no PGlite

`loadSchema()` remove comandos `CREATE EXTENSION` e troca indice GIN por indice
simples compativel. Isso evita falhas no PGlite sem mudar o `schema.sql`.

### Como rodar testes do banco

```bash
npm test -- backend/database/db.test.js --runInBand
```

## Comandos Uteis

```bash
npm test -- backend/database/db.test.js --runInBand
npm test -- --runInBand
npm run lint
```
