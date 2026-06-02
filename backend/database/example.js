/**
 * Exemplo de como usar o PGLite Database
 * Execute o servidor com: npm run db:start
 * Depois rode este arquivo com: node backend/database/example.js
 */

import { initializeDatabase, executeQuery, executeSql, getDatabase } from './db.js';

async function runExample() {
  try {
    console.log('📚 PGLite Database Example\n');

    // 1. Inicializar o banco
    console.log('1️⃣  Inicializando banco de dados...');
    const db = await initializeDatabase();
    console.log('✓ Banco inicializado\n');

    // 2. Criar uma tabela
    console.log('2️⃣  Criando tabela...');
    await executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Tabela criada\n');

    // 3. Inserir dados
    console.log('3️⃣  Inserindo dados...');
    const result1 = await executeQuery(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name',
      ['João Silva', 'joao@example.com']
    );
    console.log('✓ Usuário inserido:', result1[0], '\n');

    const result2 = await executeQuery(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name',
      ['Maria Santos', 'maria@example.com']
    );
    console.log('✓ Usuário inserido:', result2[0], '\n');

    // 4. Buscar dados
    console.log('4️⃣  Buscando todos os usuários...');
    const users = await executeQuery('SELECT * FROM users');
    console.log('✓ Usuários encontrados:');
    users.forEach((user) => {
      console.log(`  - ${user.name} (${user.email})`);
    });
    console.log();

    // 5. Buscar com filtro
    console.log('5️⃣  Buscando usuário específico...');
    const specific = await executeQuery(
      'SELECT * FROM users WHERE name = $1',
      ['João Silva']
    );
    console.log('✓ Resultado:', specific[0], '\n');

    // 6. Atualizar dados
    console.log('6️⃣  Atualizando usuário...');
    await executeQuery(
      'UPDATE users SET email = $1 WHERE name = $2',
      ['joao.novo@example.com', 'João Silva']
    );
    console.log('✓ Email atualizado\n');

    // 7. Deletar dados
    console.log('7️⃣  Deletando usuário...');
    await executeQuery(
      'DELETE FROM users WHERE name = $1',
      ['Maria Santos']
    );
    console.log('✓ Usuário deletado\n');

    // 8. Contar registros
    console.log('8️⃣  Contando registros...');
    const count = await executeQuery('SELECT COUNT(*) as total FROM users');
    console.log(`✓ Total de usuários: ${count[0].total}\n`);

    // 9. Criar tabela com tipos mais complexos
    console.log('9️⃣  Criando tabela de questões...');
    await executeSql(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        difficulty VARCHAR(20),
        topic VARCHAR(100),
        created_by_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Tabela de questões criada\n');

    // 10. Inserir questão com referência
    console.log('🔟 Inserindo questão...');
    const userResult = await executeQuery('SELECT id FROM users LIMIT 1');
    if (userResult.length > 0) {
      const question = await executeQuery(
        `INSERT INTO questions (title, description, difficulty, topic, created_by_id) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, title`,
        [
          'O que é AWS?',
          'Explique os serviços principais da Amazon Web Services',
          'iniciante',
          'AWS Fundamentals',
          userResult[0].id,
        ]
      );
      console.log('✓ Questão inserida:', question[0], '\n');
    }

    console.log('✅ Exemplo concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

runExample();
