# 🗄️ PGLite Setup - Guia Rápido

## ✅ O que foi instalado

### Pacotes NPM
- `@electric-sql/pglite` - Motor de banco de dados PostgreSQL em memória/local
- `@electric-sql/pglite-socket` - Acesso remoto via socket

### Arquivos Criados

```
backend/
├── database/
│   ├── db.js              ← Módulo principal de conexão
│   ├── socketServer.js    ← Servidor socket (futuro)
│   ├── example.js         ← Exemplo completo de uso
│   └── README.md          ← Documentação detalhada
└── server.js              ← Script para iniciar o servidor
```

### Scripts adicionados ao `package.json`
```json
"db:start": "node backend/server.js",
"db:dev": "NODE_ENV=development node backend/server.js"
```

## 🚀 Como Começar

### Terminal 1: Iniciar o servidor

```bash
npm run db:start
```

Você verá:
```
🚀 Starting PGLite Database Server...
✓ Database initialized successfully
✓ Server is ready
⚙️  Environment: development
📝 Database API available for imports
Press Ctrl+C to stop the server
```

### Terminal 2: Usar o banco

#### Opção A - Testar com o exemplo
```bash
node backend/database/example.js
```

#### Opção B - Usar em seu código
```javascript
import { initializeDatabase, executeQuery, executeSql } from './backend/database/db.js';

// Inicializar
await initializeDatabase();

// Criar tabela
await executeSql(`
  CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
  );
`);

// Inserir
const result = await executeQuery(
  'INSERT INTO questions (title) VALUES ($1) RETURNING *',
  ['Minha pergunta']
);

// Buscar
const questions = await executeQuery('SELECT * FROM questions');
console.log(questions);
```

## 📚 API Rápida

| Função | Uso |
|--------|-----|
| `initializeDatabase()` | Inicializa o banco |
| `getDatabase()` | Retorna instância |
| `executeQuery(sql, params)` | Executa query com retorno |
| `executeSql(sql)` | Executa SQL puro |
| `closeDatabase()` | Fecha conexão |

## 🔧 Variáveis de Ambiente (Opcional)

```bash
# .env ou command line
DB_DATA_DIR=/caminho/para/dados      # Para persistência
NODE_ENV=development                  # Ambiente
```

## ✨ Características

- ✅ Sem dependências externas (funciona offline)
- ✅ Rápido (em memória)
- ✅ Suporte a PostgreSQL SQL completo
- ✅ Queries parametrizadas (seguro)
- ✅ Extensão `vector` para embeddings
- ✅ Fácil de testar
- ✅ Shutdown gracioso

## 📖 Documentação Completa

Veja `backend/database/README.md` para:
- Exemplos detalhados
- Troubleshooting
- Configurações avançadas
- Próximos passos

## 🐛 Problemas Comuns

**"Database not initialized"**
→ Chame `initializeDatabase()` primeiro

**"Port 5432 in use"**
→ Use `DB_PORT=5433 npm run db:start`

**"Dados sumiram"**
→ Configure `DB_DATA_DIR` para persistência

## 🎯 Próximos Passos

1. [ ] Criar schema completo do projeto
2. [ ] Integrar com rotas da API
3. [ ] Adicionar seed data para testes
4. [ ] Configurar migrations automáticas
5. [ ] Adicionar validações ao banco

---

**Status**: ✅ Pronto para usar!

Para dúvidas, veja `backend/database/README.md`
