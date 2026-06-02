# PGLite Database Module

Este módulo fornece uma conexão simplificada com o PGLite, um PostgreSQL em memória/local.

## 📦 Estrutura

- `db.js` - Gerenciamento de conexão com o banco de dados
- `socketServer.js` - Servidor socket (uso futuro)
- `example.js` - Exemplo completo de uso
- `../server.js` - Script de inicialização do servidor

## 🚀 Como Usar

### 1. Instalar as dependências

```bash
npm install @electric-sql/pglite @electric-sql/pglite-socket
```

### 2. Iniciar o servidor

Em um terminal:

```bash
npm run db:start          # Produção
npm run db:dev           # Desenvolvimento
```

O servidor iniciará e ficará aguardando conexões.

### 3. Usar em outro script/aplicação

```javascript
import { initializeDatabase, executeQuery, executeSql } from './backend/database/db.js';

// Inicializar o banco (cria conexão)
await initializeDatabase();

// Executar queries
const users = await executeQuery('SELECT * FROM users WHERE id = $1', [1]);

// Executar SQL sem retorno
await executeSql('CREATE TABLE users (id SERIAL, name TEXT)');
```

### 4. Testar com o arquivo de exemplo

Com o servidor rodando, em outro terminal:

```bash
node backend/database/example.js
```

## 📝 API Disponível

### `initializeDatabase(options)`
Inicializa a conexão com o banco de dados.

```javascript
await initializeDatabase({
  dataDir: '/caminho/para/persistencia' // opcional
});
```

### `getDatabase()`
Retorna a instância do banco já inicializada.

```javascript
const db = getDatabase();
```

### `executeQuery(query, params)`
Executa uma query e retorna os resultados.

```javascript
const results = await executeQuery(
  'SELECT * FROM users WHERE id = $1',
  [123]
);
```

### `executeSql(sql)`
Executa SQL puro (para CREATE TABLE, ALTER, etc).

```javascript
await executeSql(`
  CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
```

### `closeDatabase()`
Fecha a conexão com o banco.

```javascript
await closeDatabase();
```

## 🔧 Variáveis de Ambiente

```bash
DB_DATA_DIR=/caminho/dados      # Diretório para persistência (opcional)
NODE_ENV=development            # Ambiente (default: development)
```

## 📚 Exemplos Práticos

### Criar tabela
```javascript
await executeSql(`
  CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
```

### Inserir dados
```javascript
const result = await executeQuery(
  'INSERT INTO questions (title, description, difficulty) VALUES ($1, $2, $3) RETURNING id, title',
  ['O que é AWS?', 'Explique...', 'iniciante']
);
console.log(result[0]); // { id: 1, title: 'O que é AWS?' }
```

### Buscar dados
```javascript
const questions = await executeQuery(
  'SELECT * FROM questions WHERE difficulty = $1',
  ['iniciante']
);
```

### Atualizar dados
```javascript
await executeQuery(
  'UPDATE questions SET description = $1 WHERE id = $2',
  ['Nova descrição', 1]
);
```

### Deletar dados
```javascript
await executeQuery(
  'DELETE FROM questions WHERE id = $1',
  [1]
);
```

## ⚙️ Características

✅ Banco em memória (rápido) com opção de persistência
✅ Suporte a extensão `vector` (para embeddings)
✅ Queries parametrizadas (seguro contra SQL injection)
✅ TypeScript-friendly (adicionar tipos conforme necessário)
✅ Shutdown gracioso
✅ Exemplos completos de uso

## 🐛 Troubleshooting

### "Database not initialized"
Certifique-se de chamar `initializeDatabase()` antes de usar `getDatabase()`

### Port 5432 já está em uso
Mude a porta com a variável de ambiente `DB_PORT=5433`

### Dados não persistem
Por padrão, o banco é em memória. Para persistência, configure `DB_DATA_DIR`

## 🔗 Próximos Passos

1. Integrar com as rotas da API (`backend/routes`)
2. Criar seed scripts para popular dados de teste
3. Adicionar migrations automáticas
4. Configurar pooling para produção
