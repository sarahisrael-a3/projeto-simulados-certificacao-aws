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
const VALID_CERTIFICATIONS = new Set([
  'CLF-C02',
  'SAA-C03',
  'SAP-C02',
  'DVA-C02',
  'SOA-C02',
  'DOP-C02',
  'ANS-C01',
  'DAS-C01',
  'MLS-C01',
  'SCS-C02',
  'PAS-C01',
  'AIF-C01',
]);
const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const DEFAULT_QUESTION_LIMIT = 10;
const DEFAULT_SEARCH_LIMIT = 20;
const DEFAULT_HISTORY_LIMIT = 10;
const DEFAULT_WEAK_DOMAIN_THRESHOLD = 70;
const MAX_QUESTION_LIMIT = 100;

loadEnvironment({ quiet: true });

let db = null;
let initializationPromise = null;
let closePromise = null;
let schemaSql = null;

function isDebugEnabled() {
  return process.env.DEBUG === 'true' || process.env.DB_DEBUG === 'true';
}

function debugQuery(query, params) {
  if (!isDebugEnabled()) {
    return;
  }

  console.log('[database:query]', query.replace(/\s+/g, ' ').trim(), params);
}

function rowsFromResult(result) {
  return Array.isArray(result) ? result : result.rows || [];
}

async function queryRows(executor, query, params = []) {
  debugQuery(query, params);
  const result = await executor.query(query, params);
  return rowsFromResult(result);
}

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
    return await queryRows(database, query, params);
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

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeRequiredString(value, fieldName, { minLength = 1 } = {}) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  const normalized = value.trim();
  if (normalized.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} character(s)`);
  }

  return normalized;
}

function normalizeOptionalString(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return normalizeRequiredString(value, fieldName);
}

function normalizeLimit(value, defaultLimit = DEFAULT_QUESTION_LIMIT) {
  const numericValue = Number.parseInt(value ?? defaultLimit, 10);

  if (!Number.isFinite(numericValue) || numericValue < 1) {
    return defaultLimit;
  }

  return Math.min(numericValue, MAX_QUESTION_LIMIT);
}

function normalizeOffset(value) {
  const numericValue = Number.parseInt(value ?? 0, 10);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return 0;
  }

  return numericValue;
}

function validateCertification(certification, { required = false } = {}) {
  if (certification === undefined || certification === null || certification === '') {
    if (required) {
      throw new Error('certification is required');
    }
    return undefined;
  }

  const normalized = normalizeCertificationId(
    normalizeRequiredString(certification, 'certification'),
  );

  if (!VALID_CERTIFICATIONS.has(normalized)) {
    throw new Error(`Invalid certification: ${certification}`);
  }

  return normalized;
}

function validateDifficulty(difficulty, { required = false } = {}) {
  if (difficulty === undefined || difficulty === null || difficulty === '') {
    if (required) {
      throw new Error('difficulty is required');
    }
    return undefined;
  }

  const normalized = normalizeRequiredString(difficulty, 'difficulty');
  if (!VALID_DIFFICULTIES.has(normalized)) {
    throw new Error('difficulty must be one of: easy, medium, hard');
  }

  return normalized;
}

function normalizeTags(tags) {
  if (tags === undefined || tags === null) {
    return [];
  }

  if (!Array.isArray(tags)) {
    throw new Error('tags must be an array');
  }

  return tags.map((tag, index) => normalizeRequiredString(tag, `tags[${index}]`));
}

function normalizeOptions(options) {
  if (!Array.isArray(options) || options.length < 2) {
    throw new Error('options must be an array with at least 2 items');
  }

  return options.map((option, index) => {
    if (typeof option === 'string') {
      return normalizeRequiredString(option, `options[${index}]`);
    }

    if (isPlainObject(option)) {
      const normalizedOption = { ...option };
      if ('id' in normalizedOption) {
        normalizedOption.id = normalizeRequiredString(
          String(normalizedOption.id),
          `options[${index}].id`,
        );
      }
      normalizedOption.text = normalizeRequiredString(
        normalizedOption.text,
        `options[${index}].text`,
      );
      return normalizedOption;
    }

    throw new Error(`options[${index}] must be a string or an object`);
  });
}

function normalizeCorrectAnswer(correctAnswer, options) {
  const answers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

  if (answers.length === 0 || answers.some((answer) => answer === undefined || answer === null)) {
    throw new Error('correct_answer must contain at least one answer');
  }

  const optionIds = options
    .filter((option) => isPlainObject(option) && option.id)
    .map((option) => option.id);

  answers.forEach((answer, index) => {
    if (typeof answer === 'number') {
      if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
        throw new Error(`correct_answer[${index}] must reference a valid option index`);
      }
      return;
    }

    if (typeof answer === 'string') {
      if (optionIds.length > 0 && optionIds.includes(answer)) {
        return;
      }
      throw new Error(`correct_answer[${index}] must reference a valid option id`);
    }

    throw new Error(`correct_answer[${index}] must be a number or string`);
  });

  return answers;
}

function normalizeQuestionInput(questionData, { partial = false } = {}) {
  if (!isPlainObject(questionData)) {
    throw new Error('questionData must be an object');
  }

  const normalized = {};
  const certification = questionData.certification;
  const domain = questionData.domain;
  const difficulty = questionData.difficulty;
  const questionText = questionData.question_text ?? questionData.question;
  const correctAnswer = questionData.correct_answer ?? questionData.correct;

  if (!partial || certification !== undefined) {
    normalized.certification = validateCertification(certification, { required: !partial });
  }

  if (!partial || domain !== undefined) {
    normalized.domain = normalizeRequiredString(domain, 'domain');
  }

  if (!partial || difficulty !== undefined) {
    normalized.difficulty = validateDifficulty(difficulty, { required: !partial });
  }

  if (!partial || questionText !== undefined) {
    normalized.question_text = normalizeRequiredString(
      questionText,
      'question_text',
      { minLength: 10 },
    );
  }

  if (!partial || questionData.options !== undefined) {
    normalized.options = normalizeOptions(questionData.options);
  }

  if (!partial || correctAnswer !== undefined) {
    if (normalized.options) {
      normalized.correct_answer = normalizeCorrectAnswer(correctAnswer, normalized.options);
    } else {
      normalized.correct_answer = Array.isArray(correctAnswer)
        ? correctAnswer
        : [correctAnswer];
    }
  }

  if (!partial || questionData.explanation !== undefined) {
    normalized.explanation = normalizeRequiredString(questionData.explanation, 'explanation');
  }

  if (questionData.reference_url !== undefined || questionData.reference !== undefined || !partial) {
    normalized.reference_url = normalizeOptionalString(
      questionData.reference_url ?? questionData.reference,
      'reference_url',
    );
  }

  if (questionData.tags !== undefined || !partial) {
    normalized.tags = normalizeTags(questionData.tags);
  }

  return Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== undefined),
  );
}

async function normalizeQuestionUpdate(updates, existingQuestion) {
  const candidate = {
    ...existingQuestion,
    ...updates,
    correct_answer: updates.correct_answer ?? updates.correct ?? existingQuestion.correct_answer,
    question_text: updates.question_text ?? updates.question ?? existingQuestion.question_text,
  };
  const normalizedCandidate = normalizeQuestionInput(candidate);
  const allowedFields = new Set([
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
  ]);
  const normalizedUpdates = {};

  Object.keys(updates).forEach((key) => {
    const storageKey = key === 'question'
      ? 'question_text'
      : key === 'correct'
        ? 'correct_answer'
        : key;

    if (!allowedFields.has(storageKey)) {
      return;
    }

    if (storageKey in normalizedCandidate) {
      normalizedUpdates[storageKey] = normalizedCandidate[storageKey];
    } else {
      normalizedUpdates[storageKey] = updates[key];
    }
  });

  if (Object.keys(normalizedUpdates).length === 0) {
    throw new Error('No valid fields to update');
  }

  return normalizedUpdates;
}

function normalizeQuestionFilters(certificationOrFilters, domain, difficulty, options) {
  if (isPlainObject(certificationOrFilters)) {
    return {
      certification: certificationOrFilters.certification,
      domain: certificationOrFilters.domain,
      difficulty: certificationOrFilters.difficulty,
      limit: certificationOrFilters.limit,
      offset: certificationOrFilters.offset,
    };
  }

  return {
    certification: certificationOrFilters,
    domain,
    difficulty,
    limit: options?.limit,
    offset: options?.offset,
  };
}

function escapeLikePattern(value) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

/**
 * Get all active questions with optional filters and pagination.
 * Supports both getQuestions({ ...filters }) and
 * getQuestions(certification, domain, difficulty, options).
 * @param {Object|string} certificationOrFilters - Filter object or certification code
 * @param {string} [domain] - Filter by domain slug
 * @param {string} [difficulty] - Filter by difficulty level ('easy', 'medium', 'hard')
 * @param {Object} [options] - Pagination options
 * @param {number} [options.limit] - Max results (default: 10, max: 100)
 * @param {number} [options.offset] - Pagination offset (default: 0)
 * @returns {Promise<Array>} Array of questions
 */
export async function getQuestions(certificationOrFilters = {}, domain, difficulty, options = {}) {
  const filters = normalizeQuestionFilters(certificationOrFilters, domain, difficulty, options);
  const normalizedCertification = validateCertification(filters.certification);
  const normalizedDomain = filters.domain
    ? normalizeRequiredString(filters.domain, 'domain')
    : undefined;
  const normalizedDifficulty = validateDifficulty(filters.difficulty);
  const limit = normalizeLimit(filters.limit, DEFAULT_QUESTION_LIMIT);
  const offset = normalizeOffset(filters.offset);

  let query = 'SELECT * FROM questions WHERE is_active = TRUE';
  const params = [];
  let paramIndex = 1;

  if (normalizedCertification) {
    query += ` AND certification = $${paramIndex++}`;
    params.push(normalizedCertification);
  }

  if (normalizedDomain) {
    query += ` AND domain = $${paramIndex++}`;
    params.push(normalizedDomain);
  }

  if (normalizedDifficulty) {
    query += ` AND difficulty = $${paramIndex++}`;
    params.push(normalizedDifficulty);
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
  normalizeRequiredString(questionId, 'questionId');
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
 * Search questions by text query.
 * @param {string} searchTerm - Term to search in question text, explanation, or domain
 * @param {number} limit - Max results (default: 20, max: 100)
 * @returns {Promise<Array>} Array of matching questions
 */
export async function searchQuestions(searchTerm, limit = 20) {
  const normalizedSearchTerm = normalizeRequiredString(searchTerm, 'searchTerm');
  const normalizedLimit = normalizeLimit(limit, DEFAULT_SEARCH_LIMIT);
  const pattern = `%${escapeLikePattern(normalizedSearchTerm)}%`;
  const query = `
    SELECT * FROM questions 
    WHERE is_active = TRUE 
    AND (
      question_text ILIKE $1 ESCAPE '\\'
      OR explanation ILIKE $1 ESCAPE '\\'
      OR domain ILIKE $1 ESCAPE '\\'
    )
    ORDER BY created_at DESC
    LIMIT $2
  `;

  try {
    return await executeQuery(query, [pattern, normalizedLimit]);
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
  const normalizedQuestion = normalizeQuestionInput(questionData);
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
  } = normalizedQuestion;

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
  normalizeRequiredString(questionId, 'questionId');

  if (!isPlainObject(updates)) {
    throw new Error('questionData must be an object');
  }

  const existingQuestion = await getQuestionById(questionId);
  if (!existingQuestion) {
    return null;
  }

  const filteredUpdates = await normalizeQuestionUpdate(updates, existingQuestion);

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
    const params = [
      ...Object.entries(filteredUpdates).map(([key, value]) => {
        if (key === 'options' || key === 'correct_answer') {
          return JSON.stringify(value);
        }
        return value;
      }),
      questionId,
    ];
    const result = await executeQuery(query, params);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('✗ Error updating question:', error.message);
    throw error;
  }
}

/**
 * Get questions by certification and domain.
 * @param {string} certification - Certification code
 * @param {string} domain - Domain slug
 * @param {Object} options - Pagination options
 * @returns {Promise<Array>} Array of questions
 */
export async function getQuestionsByDomain(certification, domain, options = {}) {
  const normalizedCertification = validateCertification(certification, { required: true });
  const normalizedDomain = normalizeRequiredString(domain, 'domain');

  return getQuestions(normalizedCertification, normalizedDomain, undefined, options);
}

/**
 * Soft delete (deactivate) a question
 * @param {string} questionId - UUID of question to deactivate
 * @returns {Promise<Object|null>} Deactivated question or null if not found
 */
export async function deleteQuestion(questionId) {
  normalizeRequiredString(questionId, 'questionId');
  const query = 'UPDATE questions SET is_active = FALSE WHERE id = $1 AND is_active = TRUE RETURNING *';

  try {
    const result = await executeQuery(query, [questionId]);
    return result.length > 0 ? result[0] : null;
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

function normalizePositiveInteger(value, fieldName) {
  const numericValue = Number.parseInt(value, 10);

  if (!Number.isFinite(numericValue) || numericValue < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return numericValue;
}

function normalizeNonNegativeInteger(value, fieldName, defaultValue = 0) {
  const candidate = value ?? defaultValue;
  const numericValue = Number.parseInt(candidate, 10);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new Error(`${fieldName} must be a non-negative number`);
  }

  return numericValue;
}

function normalizePercentage(value, fieldName) {
  const numericValue = Number.parseFloat(value);

  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 100) {
    throw new Error(`${fieldName} must be between 0 and 100`);
  }

  return Number(numericValue.toFixed(2));
}

function normalizePlainObject(value, fieldName, defaultValue = {}) {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (!isPlainObject(value)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return value;
}

function normalizeStringArray(value, fieldName, defaultValue = []) {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map((item, index) => normalizeRequiredString(item, `${fieldName}[${index}]`));
}

function normalizeThreshold(value = DEFAULT_WEAK_DOMAIN_THRESHOLD) {
  const numericValue = Number.parseFloat(value ?? DEFAULT_WEAK_DOMAIN_THRESHOLD);

  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 100) {
    throw new Error('threshold must be between 0 and 100');
  }

  return numericValue;
}

function normalizeAnswerPayload(value, fieldName = 'userAnswer') {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName} is required`);
  }

  const answers = Array.isArray(value) ? value : [value];
  if (answers.length === 0) {
    throw new Error(`${fieldName} must contain at least one answer`);
  }

  return answers.map((answer, index) => {
    if (typeof answer === 'number') {
      if (!Number.isInteger(answer)) {
        throw new Error(`${fieldName}[${index}] must be a string or integer`);
      }
      return answer;
    }

    if (typeof answer === 'string') {
      return normalizeRequiredString(answer, `${fieldName}[${index}]`);
    }

    throw new Error(`${fieldName}[${index}] must be a string or integer`);
  });
}

function answerComparisonKey(value) {
  return normalizeAnswerPayload(value, 'answer')
    .map((answer) => String(answer))
    .sort();
}

function answersMatch(userAnswer, correctAnswer) {
  const userKeys = answerComparisonKey(userAnswer);
  const correctKeys = answerComparisonKey(correctAnswer);

  return userKeys.length === correctKeys.length
    && userKeys.every((answer, index) => answer === correctKeys[index]);
}

function normalizeQuizHistoryInput(userIdOrData, certification, answersOrMetadata) {
  const source = isPlainObject(userIdOrData)
    ? { ...userIdOrData }
    : {
        ...(isPlainObject(answersOrMetadata) ? answersOrMetadata : {}),
        user_id: userIdOrData,
        certification,
      };

  const answers = Array.isArray(answersOrMetadata)
    ? answersOrMetadata
    : Array.isArray(source.answers)
      ? source.answers
      : undefined;

  const userId = normalizeRequiredString(source.user_id ?? source.userId, 'userId');
  const normalizedCertification = validateCertification(source.certification, { required: true });
  const totalQuestions = normalizePositiveInteger(
    source.total_questions ?? source.totalQuestions ?? answers?.length,
    'total_questions',
  );
  const score = normalizeNonNegativeInteger(source.score, 'score', 0);

  if (score > totalQuestions) {
    throw new Error('score cannot be greater than total_questions');
  }

  const percentage = source.percentage === undefined || source.percentage === null
    ? Number(((score / totalQuestions) * 100).toFixed(2))
    : normalizePercentage(source.percentage, 'percentage');

  return {
    user_id: userId,
    certification: normalizedCertification,
    score,
    total_questions: totalQuestions,
    percentage,
    time_spent_secs: normalizeNonNegativeInteger(
      source.time_spent_secs ?? source.timeSpentSecs,
      'time_spent_secs',
      0,
    ),
    domain_scores: normalizePlainObject(source.domain_scores ?? source.domainScores, 'domain_scores'),
    weak_domains: normalizeStringArray(source.weak_domains ?? source.weakDomains, 'weak_domains'),
  };
}

function normalizeRecordAnswerInput(quizIdOrData, questionId, userAnswer, timeSecs) {
  const source = isPlainObject(quizIdOrData)
    ? quizIdOrData
    : {
        quiz_id: quizIdOrData,
        question_id: questionId,
        user_answer: userAnswer,
        time_secs: timeSecs,
      };

  return {
    quiz_id: normalizeRequiredString(source.quiz_id ?? source.quizId, 'quizId'),
    question_id: normalizeRequiredString(source.question_id ?? source.questionId, 'questionId'),
    user_answer: normalizeAnswerPayload(source.user_answer ?? source.userAnswer, 'userAnswer'),
    time_secs: normalizeNonNegativeInteger(source.time_secs ?? source.timeSecs, 'timeSecs', 0),
  };
}

function buildQuizSummary(totalQuestions, answerRows, threshold = DEFAULT_WEAK_DOMAIN_THRESHOLD) {
  const score = answerRows.filter((answer) => answer.is_correct).length;
  const denominator = Math.max(totalQuestions, 1);
  const percentage = Number(((score / denominator) * 100).toFixed(2));
  const timeSpentSecs = answerRows.reduce(
    (sum, answer) => sum + Number(answer.time_secs || 0),
    0,
  );
  const domainScores = {};

  answerRows.forEach((answer) => {
    if (!answer.domain) {
      return;
    }

    if (!domainScores[answer.domain]) {
      domainScores[answer.domain] = { score: 0, correct: 0, total: 0 };
    }

    domainScores[answer.domain].total += 1;
    if (answer.is_correct) {
      domainScores[answer.domain].score += 1;
      domainScores[answer.domain].correct += 1;
    }
  });

  const weakDomains = Object.entries(domainScores)
    .filter(([, stats]) => stats.total > 0 && ((stats.correct / stats.total) * 100) < threshold)
    .map(([domain]) => domain);

  return {
    score,
    percentage,
    time_spent_secs: timeSpentSecs,
    domain_scores: domainScores,
    weak_domains: weakDomains,
  };
}

/**
 * Create a new quiz history record
 * Supports createQuizHistory({ ...quizData }) and
 * createQuizHistory(userId, certification, answersOrMetadata).
 * @returns {Promise<Object|null>} Created quiz history record
 */
export async function createQuizHistory(userIdOrData, certification, answersOrMetadata) {
  const {
    user_id,
    certification: normalizedCertification,
    score,
    total_questions,
    percentage,
    time_spent_secs,
    domain_scores,
    weak_domains,
  } = normalizeQuizHistoryInput(userIdOrData, certification, answersOrMetadata);

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
      normalizedCertification,
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
export async function getQuizHistory(userId, limit = DEFAULT_HISTORY_LIMIT, offset = 0) {
  const normalizedUserId = normalizeRequiredString(userId, 'userId');
  const normalizedLimit = normalizeLimit(limit, DEFAULT_HISTORY_LIMIT);
  const normalizedOffset = normalizeOffset(offset);
  const query = `
    SELECT * FROM quiz_history 
    WHERE user_id = $1 
    ORDER BY completed_at DESC 
    LIMIT $2 OFFSET $3
  `;

  try {
    return await executeQuery(query, [normalizedUserId, normalizedLimit, normalizedOffset]);
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
  normalizeRequiredString(quizId, 'quizId');
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
 * Supports recordAnswer({ ...answerData }) and
 * recordAnswer(quizId, questionId, userAnswer, timeSecs).
 * is_correct from callers is intentionally ignored; correctness is computed
 * against questions.correct_answer on the backend.
 * @returns {Promise<Object|null>} Recorded answer
 */
export async function recordAnswer(quizIdOrData, questionId, userAnswer, timeSecs) {
  const {
    quiz_id,
    question_id,
    user_answer,
    time_secs,
  } = normalizeRecordAnswerInput(quizIdOrData, questionId, userAnswer, timeSecs);

  try {
    const quiz = await getQuizById(quiz_id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    const question = await getQuestionById(question_id);
    if (!question) {
      throw new Error('Question not found');
    }

    const isCorrect = answersMatch(user_answer, question.correct_answer);
    const database = getDatabase();

    return await database.transaction(async (transaction) => {
      const insertedAnswers = await queryRows(transaction, `
        INSERT INTO answers (quiz_id, question_id, user_answer, is_correct, time_secs)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        quiz_id,
        question_id,
        JSON.stringify(user_answer),
        isCorrect,
        time_secs,
      ]);
      const answer = insertedAnswers[0] || null;

      const answerRows = await queryRows(transaction, `
        SELECT a.is_correct, a.time_secs, q.domain
        FROM answers a
        LEFT JOIN questions q ON q.id = a.question_id
        WHERE a.quiz_id = $1
      `, [quiz_id]);
      const summary = buildQuizSummary(quiz.total_questions, answerRows);

      await queryRows(transaction, `
        UPDATE quiz_history
        SET score = $1,
            percentage = $2,
            time_spent_secs = $3,
            domain_scores = $4,
            weak_domains = $5
        WHERE id = $6
        RETURNING *
      `, [
        summary.score,
        summary.percentage,
        summary.time_spent_secs,
        JSON.stringify(summary.domain_scores),
        summary.weak_domains,
        quiz_id,
      ]);

      return {
        ...answer,
        is_correct: isCorrect,
        explanation: question.explanation,
        correct_answer: question.correct_answer,
      };
    });
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
  normalizeRequiredString(quizId, 'quizId');
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
 * Calculate aggregate quiz statistics for a user.
 * @param {string} userId - UUID of the user
 * @returns {Promise<Object>} Aggregated user quiz statistics
 */
export async function calculateStats(userId) {
  const normalizedUserId = normalizeRequiredString(userId, 'userId');
  const query = `
    SELECT
      COUNT(*)::int AS total_quizzes,
      COALESCE(AVG(percentage), 0)::float AS avg_score,
      COALESCE(MAX(percentage), 0)::float AS best_score,
      COALESCE(SUM(time_spent_secs), 0)::int AS total_time_secs,
      COUNT(DISTINCT certification)::int AS certifications_practiced,
      COALESCE(SUM(total_questions), 0)::int AS total_questions,
      COALESCE(SUM(score), 0)::int AS correct_answers
    FROM quiz_history
    WHERE user_id = $1
  `;

  try {
    const result = await executeQuery(query, [normalizedUserId]);
    const stats = result[0] || {};
    const totalQuestions = Number(stats.total_questions || 0);
    const correctAnswers = Number(stats.correct_answers || 0);

    return {
      user_id: normalizedUserId,
      total_quizzes: Number(stats.total_quizzes || 0),
      avg_score: Number(stats.avg_score || 0),
      best_score: Number(stats.best_score || 0),
      total_time_secs: Number(stats.total_time_secs || 0),
      certifications_practiced: Number(stats.certifications_practiced || 0),
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      accuracy: totalQuestions > 0
        ? Number(((correctAnswers / totalQuestions) * 100).toFixed(2))
        : 0,
    };
  } catch (error) {
    console.error('✗ Error calculating user stats:', error.message);
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
export async function getWeakDomains(userId, threshold = DEFAULT_WEAK_DOMAIN_THRESHOLD) {
  const normalizedUserId = normalizeRequiredString(userId, 'userId');
  const normalizedThreshold = normalizeThreshold(threshold);
  const query = `
    SELECT
      q.domain,
      COUNT(*)::int AS total_questions,
      SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::int AS correct_answers
    FROM answers a
    JOIN quiz_history qh ON qh.id = a.quiz_id
    JOIN questions q ON q.id = a.question_id
    WHERE qh.user_id = $1
    GROUP BY q.domain
    HAVING COUNT(*) > 0
    ORDER BY q.domain ASC
  `;

  try {
    const rows = await executeQuery(query, [normalizedUserId]);

    return rows
      .map((row) => ({
        domain: row.domain,
        accuracy: Number(((row.correct_answers / row.total_questions) * 100).toFixed(2)),
        total_questions: Number(row.total_questions),
        correct_answers: Number(row.correct_answers),
      }))
      .filter((row) => row.accuracy < normalizedThreshold)
      .sort((a, b) => a.accuracy - b.accuracy);
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
  getQuestionsByDomain,
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
  calculateStats,
  calculateQuizStats,
  // Leaderboard & Stats
  getLeaderboard,
  getUserStats,
  getWeakDomains,
};
