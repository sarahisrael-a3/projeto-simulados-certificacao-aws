/**
 * PGLite Database Connection Module
 * Handles database initialization and configuration
 */

import { PGlite } from '@electric-sql/pglite';

let db = null;

/**
 * Initialize database connection
 * @param {Object} options - Configuration options
 * @returns {Promise<PGlite>} Database instance
 */
export async function initializeDatabase(options = {}) {
  if (db) {
    console.log('Database already initialized');
    return db;
  }

  try {
    db = await PGlite.create({
      dataDir: options.dataDir || undefined,
    });

    console.log('✓ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
    throw error;
  }
}

/**
 * Get database instance
 * @returns {PGlite} Database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 * @returns {Promise<void>}
 */
export async function closeDatabase() {
  if (db) {
    try {
      await db.close();
      db = null;
      console.log('✓ Database connection closed');
    } catch (error) {
      console.error('✗ Error closing database:', error.message);
      throw error;
    }
  }
}

/**
 * Execute raw SQL query
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function executeQuery(query, params = []) {
  const database = getDatabase();
  try {
    const result = await database.query(query, params);
    // PGLite retorna um objeto com rows, precisamos extrair
    return Array.isArray(result) ? result : result.rows || [];
  } catch (error) {
    console.error('✗ Query execution failed:', error.message);
    throw error;
  }
}

/**
 * Execute SQL without returning results
 * @param {string} sql - SQL statement
 * @returns {Promise<void>}
 */
export async function executeSql(sql) {
  const database = getDatabase();
  try {
    await database.exec(sql);
  } catch (error) {
    console.error('✗ SQL execution failed:', error.message);
    throw error;
  }
}

export default {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  executeQuery,
  executeSql,
};
