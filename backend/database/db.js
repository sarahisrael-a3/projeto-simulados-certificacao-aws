/**
 * PGLite Database Connection Module
 * Handles database initialization and configuration
 */

import { PGlite } from '@electric-sql/pglite';
import { config as loadEnvironment } from 'dotenv';
import { readFileSync } from 'fs';
import { dirname, isAbsolute, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { normalizeCertificationId } from './normalizers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, 'schema.sql');
const MEMORY_DATA_DIR = 'memory://';

loadEnvironment({ quiet: true });

let db = null;
let initializationPromise = null;
let closePromise = null;
let schemaSql = null;

function resolveDatabaseOptions(options = {}) {
  const environment = options.environment || process.env.NODE_ENV || 'development';
  const configuredDataDir = options.dataDir || process.env.DB_DATA_DIR;

  if (configuredDataDir) {
    const dataDir = configuredDataDir === MEMORY_DATA_DIR || isAbsolute(configuredDataDir)
      ? configuredDataDir
      : resolve(process.cwd(), configuredDataDir);

    if (dataDir === MEMORY_DATA_DIR && environment !== 'test') {
      throw new Error(
        'In-memory PGlite is restricted to tests. Configure DB_DATA_DIR for this environment.',
      );
    }

    return {
      dataDir,
      environment,
      mode: dataDir === MEMORY_DATA_DIR ? 'memory' : 'persistent',
    };
  }

  if (environment === 'test') {
    return {
      dataDir: MEMORY_DATA_DIR,
      environment,
      mode: 'memory',
    };
  }

  throw new Error(
    'DB_DATA_DIR is required outside the test environment. '
    + 'Set it in .env or pass initializeDatabase({ dataDir }).',
  );
}

function loadSchema() {
  if (schemaSql) {
    return schemaSql;
  }

  let schema = readFileSync(SCHEMA_PATH, 'utf-8');

  schema = schema.replace(
    /CREATE EXTENSION IF NOT EXISTS.*?;/gi,
    '-- Extension not supported in PGlite\n',
  );
  schema = schema.replace(
    /CREATE INDEX IF NOT EXISTS.*?USING GIN.*?;/gi,
    '-- GIN index not supported in PGlite\n'
    + 'CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions(tags);\n',
  );

  schemaSql = schema;
  return schemaSql;
}

/**
 * Initialize database connection
 * @param {Object} options - Configuration options
 * @param {string} [options.dataDir] - Persistent directory or memory:// in tests
 * @param {string} [options.environment] - Overrides NODE_ENV
 * @returns {Promise<PGlite>} Database instance
 */
export async function initializeDatabase(options = {}) {
  if (db && !db.closed) {
    console.log('[database] Reusing active PGlite instance');
    return db;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    const databaseOptions = resolveDatabaseOptions(options);
    let database = null;

    console.log(
      `[database] Initializing PGlite in ${databaseOptions.mode} mode `
      + `(${databaseOptions.environment})`,
    );

    try {
      database = await PGlite.create({ dataDir: databaseOptions.dataDir });
      console.log('[database] PGlite instance ready');

      await database.exec(loadSchema());
      console.log('[database] Schema applied successfully');

      db = database;
      return db;
    } catch (error) {
      if (database && !database.closed) {
        await database.close().catch(() => {});
      }
      db = null;
      console.error('[database] Initialization failed:', error.message);
      throw error;
    }
  })();

  try {
    return await initializationPromise;
  } finally {
    initializationPromise = null;
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
  if (closePromise) {
    return closePromise;
  }

  closePromise = (async () => {
    if (initializationPromise) {
      await initializationPromise;
    }

    const activeDatabase = db;
    db = null;

    if (activeDatabase && !activeDatabase.closed) {
      await activeDatabase.close();
      console.log('[database] PGlite instance closed');
    }
  })();

  try {
    await closePromise;
  } catch (error) {
    console.error('[database] Close failed:', error.message);
    throw error;
  } finally {
    closePromise = null;
  }
}

/**
 * Normalize an AWS certification ID for PostgreSQL enum values.
 * @param {string} certification - Certification ID
 * @returns {string} Normalized certification ID
 */
export function normalizeCertification(certification) {
  return normalizeCertificationId(certification);
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

// ============================================================================
// QUESTIONS - CRUD Operations
// ============================================================================

/**
 * Get all active questions with optional filters and pagination
 * @param {Object} filters - Filter criteria
 * @param {string} filters.certification - Filter by certification code (e.g., 'CLF-C02')
 * @param {string} filters.domain - Filter by domain slug
 * @param {string} filters.difficulty - Filter by difficulty level ('easy', 'medium', 'hard')
 * @param {number} filters.limit - Max results (default: 10)
 * @param {number} filters.offset - Pagination offset (default: 0)
 * @returns {Promise<Array>} Array of questions
 */
export async function getQuestions(filters = {}) {
  const {
    certification,
    domain,
    difficulty,
    limit = 10,
    offset = 0,
  } = filters;

  let query = 'SELECT * FROM questions WHERE is_active = TRUE';
  const params = [];
  let paramIndex = 1;

  if (certification) {
    query += ` AND certification = $${paramIndex++}`;
    params.push(normalizeCertificationId(certification));
  }

  if (domain) {
    query += ` AND domain = $${paramIndex++}`;
    params.push(domain);
  }

  if (difficulty) {
    query += ` AND difficulty = $${paramIndex++}`;
    params.push(difficulty);
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(limit, offset);

  try {
    return await executeQuery(query, params);
  } catch (error) {
    console.error('✗ Error fetching questions:', error.message);
    throw error;
  }
}

/**
 * Get a single question by ID
 * @param {string} questionId - UUID of the question
 * @returns {Promise<Object|null>} Question object or null if not found
 */
export async function getQuestionById(questionId) {
  const query = 'SELECT * FROM questions WHERE id = $1 AND is_active = TRUE';

  try {
    const result = await executeQuery(query, [questionId]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error fetching question by ID:', error.message);
    throw error;
  }
}

/**
 * Search questions by text query (full-text search)
 * @param {string} searchTerm - Term to search in question text
 * @param {number} limit - Max results (default: 20)
 * @returns {Promise<Array>} Array of matching questions
 */
export async function searchQuestions(searchTerm, limit = 20) {
  const query = `
    SELECT * FROM questions 
    WHERE is_active = TRUE 
    AND to_tsvector('portuguese', question_text) @@ plainto_tsquery('portuguese', $1)
    LIMIT $2
  `;

  try {
    return await executeQuery(query, [searchTerm, limit]);
  } catch (error) {
    console.error('✗ Error searching questions:', error.message);
    throw error;
  }
}

/**
 * Insert a new question
 * @param {Object} questionData - Question data
 * @param {string} questionData.certification - Certification code
 * @param {string} questionData.domain - Domain slug
 * @param {string} questionData.difficulty - Difficulty level
 * @param {string} questionData.question_text - Question text
 * @param {Array} questionData.options - Array of option objects [{id, text}, ...]
 * @param {Array} questionData.correct_answer - Array of correct answer IDs
 * @param {string} questionData.explanation - Explanation text
 * @param {string} questionData.reference_url - Reference URL (optional)
 * @param {Array} questionData.tags - Array of tags (optional)
 * @returns {Promise<Object>} Inserted question with ID
 */
export async function insertQuestion(questionData) {
  const {
    certification,
    domain,
    difficulty,
    question_text,
    options,
    correct_answer,
    explanation,
    reference_url = null,
    tags = [],
  } = questionData;

  const query = `
    INSERT INTO questions (
      certification, domain, difficulty, question_text,
      options, correct_answer, explanation, reference_url, tags, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
    RETURNING *
  `;

  try {
    const result = await executeQuery(query, [
      normalizeCertificationId(certification),
      domain,
      difficulty,
      question_text,
      JSON.stringify(options),
      JSON.stringify(correct_answer),
      explanation,
      reference_url,
      tags,
    ]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error inserting question:', error.message);
    throw error;
  }
}

/**
 * Update an existing question
 * @param {string} questionId - UUID of question to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated question or null if not found
 */
export async function updateQuestion(questionId, updates) {
  const allowedFields = [
    'certification',
    'domain',
    'difficulty',
    'question_text',
    'options',
    'correct_answer',
    'explanation',
    'reference_url',
    'tags',
    'validated_by',
    'validated_at',
  ];

  // Filter to allow only safe fields
  const filteredUpdates = {};
  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = key === 'certification'
        ? normalizeCertificationId(updates[key])
        : updates[key];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    throw new Error('No valid fields to update');
  }

  // Build dynamic query
  const setClause = Object.keys(filteredUpdates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const query = `
    UPDATE questions 
    SET ${setClause}
    WHERE id = $${Object.keys(filteredUpdates).length + 1}
    RETURNING *
  `;

  try {
    const params = [...Object.values(filteredUpdates), questionId];
    const result = await executeQuery(query, params);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error updating question:', error.message);
    throw error;
  }
}

/**
 * Soft delete (deactivate) a question
 * @param {string} questionId - UUID of question to deactivate
 * @returns {Promise<void>}
 */
export async function deleteQuestion(questionId) {
  const query = 'UPDATE questions SET is_active = FALSE WHERE id = $1';

  try {
    await executeQuery(query, [questionId]);
  } catch (error) {
    console.error('✗ Error deleting question:', error.message);
    throw error;
  }
}

// ============================================================================
// USERS - CRUD Operations
// ============================================================================

/**
 * Create a new anonymous user
 * @param {string} anonymousName - Unique anonymous name for the user
 * @returns {Promise<Object|null>} Created user object
 */
export async function createUser(anonymousName) {
  const query = 'INSERT INTO users (anonymous_name) VALUES ($1) RETURNING *';

  try {
    const result = await executeQuery(query, [anonymousName]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error creating user:', error.message);
    throw error;
  }
}

/**
 * Get user by ID
 * @param {string} userId - UUID of the user
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserById(userId) {
  const query = 'SELECT * FROM users WHERE id = $1';

  try {
    const result = await executeQuery(query, [userId]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error fetching user:', error.message);
    throw error;
  }
}

/**
 * Get user by anonymous name
 * @param {string} anonymousName - Anonymous name of the user
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserByName(anonymousName) {
  const query = 'SELECT * FROM users WHERE anonymous_name = $1';

  try {
    const result = await executeQuery(query, [anonymousName]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error fetching user by name:', error.message);
    throw error;
  }
}

// ============================================================================
// GAMIFICATION - CRUD Operations
// ============================================================================

/**
 * Get or create gamification record for a user
 * @param {string} userId - UUID of the user
 * @returns {Promise<Object|null>} Gamification record
 */
export async function getGamification(userId) {
  const query = 'SELECT * FROM gamification WHERE user_id = $1';

  try {
    const result = await executeQuery(query, [userId]);
    if (result.length === 0) {
      // Create default gamification record if doesn't exist
      const insertQuery = `
        INSERT INTO gamification (user_id)
        VALUES ($1)
        RETURNING *
      `;
      const insertResult = await executeQuery(insertQuery, [userId]);
      return insertResult.length > 0 ? insertResult[0] : null;
    }
    return result[0];
  } catch (error) {
    console.error('✗ Error fetching gamification:', error.message);
    throw error;
  }
}

/**
 * Update gamification data for a user
 * @param {string} userId - UUID of the user
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated gamification record
 */
export async function updateGamification(userId, updates) {
  const allowedFields = [
    'total_quizzes',
    'best_score',
    'current_streak',
    'longest_streak',
    'last_date',
    'badges',
    'completed_stages',
    'unlocked_stages',
    'labs_completed',
    'xp_points',
  ];

  const filteredUpdates = {};
  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    throw new Error('No valid fields to update');
  }

  const setClause = Object.keys(filteredUpdates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const query = `
    UPDATE gamification 
    SET ${setClause}
    WHERE user_id = $${Object.keys(filteredUpdates).length + 1}
    RETURNING *
  `;

  try {
    const params = [...Object.values(filteredUpdates), userId];
    const result = await executeQuery(query, params);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error updating gamification:', error.message);
    throw error;
  }
}

// ============================================================================
// QUIZ HISTORY - CRUD Operations
// ============================================================================

/**
 * Create a new quiz history record
 * @param {Object} quizData - Quiz data
 * @param {string} quizData.user_id - UUID of the user
 * @param {string} quizData.certification - Certification code
 * @param {number} quizData.score - Number of correct answers
 * @param {number} quizData.total_questions - Total questions in quiz
 * @param {number} quizData.percentage - Percentage score (0-100)
 * @param {number} quizData.time_spent_secs - Time spent in seconds
 * @param {Object} quizData.domain_scores - Scores by domain (optional)
 * @param {Array} quizData.weak_domains - Domains with low scores (optional)
 * @returns {Promise<Object|null>} Created quiz history record
 */
export async function createQuizHistory(quizData) {
  const {
    user_id,
    certification,
    score,
    total_questions,
    percentage,
    time_spent_secs = 0,
    domain_scores = {},
    weak_domains = [],
  } = quizData;

  const query = `
    INSERT INTO quiz_history (
      user_id, certification, score, total_questions, percentage,
      time_spent_secs, domain_scores, weak_domains
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  try {
    const result = await executeQuery(query, [
      user_id,
      normalizeCertificationId(certification),
      score,
      total_questions,
      percentage,
      time_spent_secs,
      JSON.stringify(domain_scores),
      weak_domains,
    ]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error creating quiz history:', error.message);
    throw error;
  }
}

/**
 * Get quiz history for a user
 * @param {string} userId - UUID of the user
 * @param {number} limit - Max results (default: 10)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Array>} Array of quiz history records
 */
export async function getQuizHistory(userId, limit = 10, offset = 0) {
  const query = `
    SELECT * FROM quiz_history 
    WHERE user_id = $1 
    ORDER BY completed_at DESC 
    LIMIT $2 OFFSET $3
  `;

  try {
    return await executeQuery(query, [userId, limit, offset]);
  } catch (error) {
    console.error('✗ Error fetching quiz history:', error.message);
    throw error;
  }
}

/**
 * Get a specific quiz result
 * @param {string} quizId - UUID of the quiz history record
 * @returns {Promise<Object|null>} Quiz history record or null
 */
export async function getQuizById(quizId) {
  const query = 'SELECT * FROM quiz_history WHERE id = $1';

  try {
    const result = await executeQuery(query, [quizId]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error fetching quiz:', error.message);
    throw error;
  }
}

/**
 * Record a user's answer to a question
 * @param {Object} answerData - Answer data
 * @param {string} answerData.quiz_id - UUID of the quiz history record
 * @param {string} answerData.question_id - UUID of the question
 * @param {Array} answerData.user_answer - User's answer(s)
 * @param {boolean} answerData.is_correct - Whether answer is correct
 * @param {number} answerData.time_secs - Time spent on this question
 * @returns {Promise<Object|null>} Recorded answer
 */
export async function recordAnswer(answerData) {
  const {
    quiz_id,
    question_id,
    user_answer,
    is_correct,
    time_secs = 0,
  } = answerData;

  const query = `
    INSERT INTO answers (quiz_id, question_id, user_answer, is_correct, time_secs)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  try {
    const result = await executeQuery(query, [
      quiz_id,
      question_id,
      JSON.stringify(user_answer),
      is_correct,
      time_secs,
    ]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error recording answer:', error.message);
    throw error;
  }
}

/**
 * Get all answers for a specific quiz
 * @param {string} quizId - UUID of the quiz history record
 * @returns {Promise<Array>} Array of answers
 */
export async function getAnswersByQuiz(quizId) {
  const query = 'SELECT * FROM answers WHERE quiz_id = $1 ORDER BY answered_at ASC';

  try {
    return await executeQuery(query, [quizId]);
  } catch (error) {
    console.error('✗ Error fetching answers:', error.message);
    throw error;
  }
}

// ============================================================================
// LEADERBOARD - Read Operations
// ============================================================================

/**
 * Get the top users by XP points
 * @param {number} limit - Number of top users to return (default: 100)
 * @returns {Promise<Array>} Array of leaderboard entries
 */
export async function getLeaderboard(limit = 100) {
  const query = 'SELECT * FROM leaderboard LIMIT $1';

  try {
    return await executeQuery(query, [limit]);
  } catch (error) {
    console.error('✗ Error fetching leaderboard:', error.message);
    throw error;
  }
}

// ============================================================================
// USER STATISTICS - Read Operations
// ============================================================================

/**
 * Get comprehensive statistics for a user
 * @param {string} userId - UUID of the user
 * @returns {Promise<Object|null>} User statistics record
 */
export async function getUserStats(userId) {
  const query = 'SELECT * FROM user_stats WHERE user_id = $1';

  try {
    const result = await executeQuery(query, [userId]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error fetching user stats:', error.message);
    throw error;
  }
}

/**
 * Calculate quiz result statistics
 * @param {string} quizId - UUID of the quiz history record
 * @returns {Promise<Object>} Statistics object with score, percentage, etc.
 */
export async function calculateQuizStats(quizId) {
  try {
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    const answers = await getAnswersByQuiz(quizId);
    const correctCount = answers.filter((a) => a.is_correct).length;
    const totalTime = answers.reduce((sum, a) => sum + (a.time_secs || 0), 0);

    return {
      quiz_id: quizId,
      certification: quiz.certification,
      total_questions: quiz.total_questions,
      correct_answers: correctCount,
      score: quiz.score,
      percentage: quiz.percentage,
      time_spent_secs: totalTime || quiz.time_spent_secs,
      completed_at: quiz.completed_at,
    };
  } catch (error) {
    console.error('✗ Error calculating quiz stats:', error.message);
    throw error;
  }
}

/**
 * Get weak domains for a user (domains where accuracy < 70%)
 * @param {string} userId - UUID of the user
 * @param {number} threshold - Accuracy threshold percentage (default: 70)
 * @returns {Promise<Array>} Array of domain names with low scores
 */
export async function getWeakDomains(userId, threshold = 70) {
  try {
    const quizzes = await getQuizHistory(userId, 100, 0);
    
    // Aggregate domain performance
    const domainStats = {};

    for (const quiz of quizzes) {
      const domainScores = quiz.domain_scores || {};
      Object.entries(domainScores).forEach(([domain, stats]) => {
        if (!domainStats[domain]) {
          domainStats[domain] = { total: 0, correct: 0, attempts: 0 };
        }
        domainStats[domain].total += stats.total || 0;
        domainStats[domain].correct += stats.score || 0;
        domainStats[domain].attempts += 1;
      });
    }

    // Filter weak domains
    const weakDomains = [];
    Object.entries(domainStats).forEach(([domain, stats]) => {
      if (stats.total > 0) {
        const accuracy = (stats.correct / stats.total) * 100;
        if (accuracy < threshold) {
          weakDomains.push({
            domain,
            accuracy: Math.round(accuracy),
            total_questions: stats.total,
            correct_answers: stats.correct,
          });
        }
      }
    });

    return weakDomains.sort((a, b) => a.accuracy - b.accuracy);
  } catch (error) {
    console.error('✗ Error calculating weak domains:', error.message);
    throw error;
  }
}

export default {
  // Core functions
  initializeDatabase,
  getDatabase,
  closeDatabase,
  executeQuery,
  executeSql,
  // Questions
  getQuestions,
  getQuestionById,
  searchQuestions,
  insertQuestion,
  updateQuestion,
  deleteQuestion,
  // Users
  createUser,
  getUserById,
  getUserByName,
  // Gamification
  getGamification,
  updateGamification,
  // Quiz History
  createQuizHistory,
  getQuizHistory,
  getQuizById,
  recordAnswer,
  getAnswersByQuiz,
  calculateQuizStats,
  // Leaderboard & Stats
  getLeaderboard,
  getUserStats,
  getWeakDomains,
};
