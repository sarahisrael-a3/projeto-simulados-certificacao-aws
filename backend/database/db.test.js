/**
 * @jest-environment node
 */

import { mkdtemp, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
  calculateStats,
  closeDatabase,
  createQuizHistory,
  createUser,
  deleteQuestion,
  executeQuery,
  getDatabase,
  getAnswersByQuiz,
  getQuestionById,
  getQuestions,
  getQuestionsByDomain,
  getQuizById,
  getQuizHistory,
  getUserStats,
  getWeakDomains,
  initializeDatabase,
  insertQuestion,
  normalizeCertification,
  recordAnswer,
  searchQuestions,
  updateQuestion,
} from './db.js';

describe('PGlite database lifecycle', () => {
  let persistentDataDir;
  const originalDataDir = process.env.DB_DATA_DIR;

  beforeEach(async () => {
    await closeDatabase();
    delete process.env.DB_DATA_DIR;
  });

  afterEach(async () => {
    await closeDatabase();

    if (persistentDataDir) {
      await rm(persistentDataDir, { recursive: true, force: true });
      persistentDataDir = null;
    }

    if (originalDataDir === undefined) {
      delete process.env.DB_DATA_DIR;
    } else {
      process.env.DB_DATA_DIR = originalDataDir;
    }
  });

  test('initializes an isolated in-memory database in the test environment', async () => {
    const database = await initializeDatabase({ environment: 'test' });

    expect(database).toBe(getDatabase());
    expect(database.dataDir).toBe('memory://');
    expect(globalThis.TextEncoder).toBeDefined();
  });

  test('applies the schema during initialization', async () => {
    const database = await initializeDatabase({ environment: 'test' });
    const result = await database.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

    expect(result.rows).toEqual([{ table_name: 'users' }]);
  });

  test('reuses the active instance without applying initialization twice', async () => {
    const firstInitialization = initializeDatabase({ environment: 'test' });
    const secondInitialization = initializeDatabase({ environment: 'test' });
    const [firstDatabase, secondDatabase] = await Promise.all([
      firstInitialization,
      secondInitialization,
    ]);

    expect(secondDatabase).toBe(firstDatabase);

    await firstDatabase.exec('CREATE TABLE lifecycle_marker (id INTEGER PRIMARY KEY);');
    await firstDatabase.exec('INSERT INTO lifecycle_marker (id) VALUES (1);');

    const reusedDatabase = await initializeDatabase({ environment: 'test' });
    const result = await reusedDatabase.query('SELECT COUNT(*)::int AS count FROM lifecycle_marker');

    expect(reusedDatabase).toBe(firstDatabase);
    expect(result.rows[0].count).toBe(1);
  });

  test('closes the active instance and clears the global reference', async () => {
    const database = await initializeDatabase({ environment: 'test' });

    await closeDatabase();

    expect(database.closed).toBe(true);
    expect(() => getDatabase()).toThrow('Database not initialized');
  });

  test('uses a configured dataDir and preserves data after reopening', async () => {
    persistentDataDir = await mkdtemp(join(tmpdir(), 'aws-simulator-pglite-'));

    const firstDatabase = await initializeDatabase({
      dataDir: persistentDataDir,
      environment: 'test',
    });
    await firstDatabase.exec('CREATE TABLE persistence_marker (value TEXT NOT NULL);');
    await firstDatabase.exec("INSERT INTO persistence_marker (value) VALUES ('preserved');");
    await closeDatabase();

    const reopenedDatabase = await initializeDatabase({
      dataDir: persistentDataDir,
      environment: 'test',
    });
    const result = await reopenedDatabase.query('SELECT value FROM persistence_marker');

    expect(reopenedDatabase.dataDir).toBe(persistentDataDir);
    expect(result.rows).toEqual([{ value: 'preserved' }]);
  });

  test('uses DB_DATA_DIR from the environment outside tests', async () => {
    persistentDataDir = await mkdtemp(join(tmpdir(), 'aws-simulator-pglite-env-'));
    process.env.DB_DATA_DIR = persistentDataDir;

    const database = await initializeDatabase({ environment: 'development' });

    expect(database.dataDir).toBe(persistentDataDir);
  });

  test('requires persistent configuration outside the test environment', async () => {
    await expect(
      initializeDatabase({ environment: 'development' }),
    ).rejects.toThrow('DB_DATA_DIR is required outside the test environment');
  });

  test('normalizes certification IDs centrally', () => {
    expect(normalizeCertification('clf-c02')).toBe('CLF-C02');
    expect(normalizeCertification(' saa-c03 ')).toBe('SAA-C03');
  });
});

describe('Question CRUD operations', () => {
  beforeEach(async () => {
    await closeDatabase();
    delete process.env.DB_DATA_DIR;
    await initializeDatabase({ environment: 'test' });
  });

  afterEach(async () => {
    await closeDatabase();
  });

  function validQuestion(overrides = {}) {
    return {
      certification: 'clf-c02',
      domain: 'seguranca',
      difficulty: 'medium',
      question_text: 'Which AWS service helps manage user permissions for workloads?',
      options: ['Amazon EC2', 'AWS IAM', 'Amazon S3', 'AWS Lambda'],
      correct_answer: [1],
      explanation: 'AWS IAM manages identities and permissions for AWS resources.',
      reference_url: 'https://aws.amazon.com/iam/',
      tags: ['iam', 'security'],
      ...overrides,
    };
  }

  async function insertQuestionWithText(questionText, overrides = {}) {
    return insertQuestion(validQuestion({
      question_text: questionText,
      ...overrides,
    }));
  }

  test('inserts a valid question and normalizes certification', async () => {
    const question = await insertQuestion(validQuestion());

    expect(question.id).toBeDefined();
    expect(question.certification).toBe('CLF-C02');
    expect(question.domain).toBe('seguranca');
    expect(question.options).toEqual(['Amazon EC2', 'AWS IAM', 'Amazon S3', 'AWS Lambda']);
    expect(question.correct_answer).toEqual([1]);
  });

  test('rejects invalid question payloads with clear errors', async () => {
    await expect(
      insertQuestion(validQuestion({ options: ['Only one option'] })),
    ).rejects.toThrow('options must be an array with at least 2 items');

    await expect(
      insertQuestion(validQuestion({ correct_answer: [99] })),
    ).rejects.toThrow('correct_answer[0] must reference a valid option index');

    await expect(
      insertQuestion(validQuestion({ difficulty: 'expert' })),
    ).rejects.toThrow('difficulty must be one of: easy, medium, hard');

    await expect(
      insertQuestion(validQuestion({ certification: 'XYZ-000' })),
    ).rejects.toThrow('Invalid certification: XYZ-000');
  });

  test('fetches a question by ID and returns null for a missing ID', async () => {
    const inserted = await insertQuestion(validQuestion());

    const found = await getQuestionById(inserted.id);
    const missing = await getQuestionById(randomUUID());

    expect(found.id).toBe(inserted.id);
    expect(missing).toBeNull();
  });

  test('lists questions by certification with lowercase input', async () => {
    await insertQuestion(validQuestion({ certification: 'clf-c02' }));
    await insertQuestion(validQuestion({
      certification: 'SAA-C03',
      domain: 'design-performance',
      question_text: 'Which AWS feature improves architecture performance for reads?',
    }));

    const questions = await getQuestions('clf-c02');

    expect(questions).toHaveLength(1);
    expect(questions[0].certification).toBe('CLF-C02');
  });

  test('filters questions by domain and difficulty', async () => {
    await insertQuestionWithText(
      'Which AWS service stores objects for compliance audit reports?',
      { domain: 'seguranca', difficulty: 'easy' },
    );
    await insertQuestionWithText(
      'Which AWS service improves cost visibility for monthly invoices?',
      { domain: 'faturamento', difficulty: 'hard' },
    );

    const byDomain = await getQuestions({ certification: 'CLF-C02', domain: 'seguranca' });
    const byDifficulty = await getQuestions('CLF-C02', undefined, 'hard');

    expect(byDomain).toHaveLength(1);
    expect(byDomain[0].domain).toBe('seguranca');
    expect(byDifficulty).toHaveLength(1);
    expect(byDifficulty[0].difficulty).toBe('hard');
  });

  test('gets questions by certification and domain', async () => {
    await insertQuestionWithText(
      'Which AWS service helps evaluate IAM permissions before production use?',
      { domain: 'seguranca' },
    );
    await insertQuestionWithText(
      'Which AWS billing feature helps forecast future costs?',
      { domain: 'faturamento' },
    );

    const questions = await getQuestionsByDomain('clf-c02', 'seguranca');

    expect(questions).toHaveLength(1);
    expect(questions[0].domain).toBe('seguranca');
  });

  test('searches questions by text', async () => {
    await insertQuestionWithText(
      'Which AWS database service provides DynamoDB single-digit millisecond latency?',
      { domain: 'tecnologia', tags: ['dynamodb'] },
    );
    await insertQuestionWithText(
      'Which AWS service tracks monthly billing anomalies?',
      { domain: 'faturamento' },
    );

    const results = await searchQuestions('DynamoDB', 10);

    expect(results).toHaveLength(1);
    expect(results[0].question_text).toContain('DynamoDB');
  });

  test('paginates questions with safe limit and offset', async () => {
    const inserted = [];
    inserted.push(await insertQuestionWithText('Question one about AWS IAM and permissions?'));
    inserted.push(await insertQuestionWithText('Question two about AWS IAM and permissions?'));
    inserted.push(await insertQuestionWithText('Question three about AWS IAM and permissions?'));

    const firstPage = await getQuestions('CLF-C02', undefined, undefined, { limit: 2, offset: 0 });
    const secondPage = await getQuestions('CLF-C02', undefined, undefined, { limit: 2, offset: 2 });
    const capped = await getQuestions('CLF-C02', undefined, undefined, { limit: 999, offset: -5 });

    expect(inserted).toHaveLength(3);
    expect(firstPage).toHaveLength(2);
    expect(secondPage).toHaveLength(1);
    expect(firstPage.map((question) => question.id)).not.toContain(secondPage[0].id);
    expect(capped).toHaveLength(3);
  });

  test('updates a question and validates updated answers', async () => {
    const inserted = await insertQuestion(validQuestion());

    const updated = await updateQuestion(inserted.id, {
      difficulty: 'hard',
      question_text: 'Which AWS identity service should be used for permission management?',
      options: ['Amazon RDS', 'AWS IAM', 'Amazon VPC'],
      correct_answer: [1],
    });

    expect(updated.id).toBe(inserted.id);
    expect(updated.difficulty).toBe('hard');
    expect(updated.options).toEqual(['Amazon RDS', 'AWS IAM', 'Amazon VPC']);

    await expect(
      updateQuestion(inserted.id, { correct_answer: [9] }),
    ).rejects.toThrow('correct_answer[0] must reference a valid option index');
  });

  test('returns null when updating a missing question', async () => {
    const result = await updateQuestion(randomUUID(), { difficulty: 'hard' });

    expect(result).toBeNull();
  });

  test('soft deletes a question and hides it from reads', async () => {
    const inserted = await insertQuestion(validQuestion());

    const deleted = await deleteQuestion(inserted.id);
    const fetched = await getQuestionById(inserted.id);
    const listed = await getQuestions('CLF-C02');
    const missingDelete = await deleteQuestion(randomUUID());

    expect(deleted.id).toBe(inserted.id);
    expect(fetched).toBeNull();
    expect(listed).toHaveLength(0);
    expect(missingDelete).toBeNull();
  });
});

describe('Quiz history and answers operations', () => {
  beforeEach(async () => {
    await closeDatabase();
    delete process.env.DB_DATA_DIR;
    await initializeDatabase({ environment: 'test' });
  });

  afterEach(async () => {
    await closeDatabase();
  });

  async function createTestUser() {
    return createUser(`QuizUser#${randomUUID()}`);
  }

  function validQuestion(overrides = {}) {
    return {
      certification: 'clf-c02',
      domain: 'seguranca',
      difficulty: 'medium',
      question_text: 'Which AWS service manages identity and access permissions?',
      options: [
        { id: 'A', text: 'Amazon EC2' },
        { id: 'B', text: 'AWS IAM' },
        { id: 'C', text: 'Amazon S3' },
        { id: 'D', text: 'Amazon CloudWatch' },
      ],
      correct_answer: ['B'],
      explanation: 'AWS IAM manages identities and access permissions.',
      reference_url: 'https://aws.amazon.com/iam/',
      tags: ['iam', 'security'],
      ...overrides,
    };
  }

  async function createQuizForUser(overrides = {}) {
    const user = await createTestUser();
    const quiz = await createQuizHistory({
      user_id: user.id,
      certification: 'clf-c02',
      score: 0,
      total_questions: 2,
      percentage: 0,
      ...overrides,
    });

    return { user, quiz };
  }

  test('creates quiz history, normalizes certification, and fetches by ID', async () => {
    const user = await createTestUser();
    const quiz = await createQuizHistory(user.id, 'clf-c02', { total_questions: 3 });
    const fetched = await getQuizById(quiz.id);

    expect(quiz.id).toBeDefined();
    expect(quiz.user_id).toBe(user.id);
    expect(quiz.certification).toBe('CLF-C02');
    expect(quiz.total_questions).toBe(3);
    expect(fetched.id).toBe(quiz.id);
  });

  test('fetches quiz history by user with pagination', async () => {
    const user = await createTestUser();
    await createQuizHistory(user.id, 'CLF-C02', { total_questions: 1 });
    await createQuizHistory(user.id, 'CLF-C02', { total_questions: 1 });
    await createQuizHistory(user.id, 'CLF-C02', { total_questions: 1 });

    const firstPage = await getQuizHistory(user.id, 2, 0);
    const secondPage = await getQuizHistory(user.id, 2, 2);

    expect(firstPage).toHaveLength(2);
    expect(secondPage).toHaveLength(1);
  });

  test('records a correct answer calculated by the backend', async () => {
    const { quiz } = await createQuizForUser({ total_questions: 1 });
    const question = await insertQuestion(validQuestion());

    const answer = await recordAnswer({
      quiz_id: quiz.id,
      question_id: question.id,
      user_answer: ['B'],
      is_correct: false,
      time_secs: 12,
    });
    const updatedQuiz = await getQuizById(quiz.id);

    expect(answer.is_correct).toBe(true);
    expect(answer.explanation).toBe(question.explanation);
    expect(answer.correct_answer).toEqual(['B']);
    expect(updatedQuiz.score).toBe(1);
    expect(Number(updatedQuiz.percentage)).toBe(100);
    expect(updatedQuiz.time_spent_secs).toBe(12);
  });

  test('records an incorrect answer calculated by the backend', async () => {
    const { quiz } = await createQuizForUser({ total_questions: 1 });
    const question = await insertQuestion(validQuestion());

    const answer = await recordAnswer(quiz.id, question.id, ['A'], 8);
    const updatedQuiz = await getQuizById(quiz.id);

    expect(answer.is_correct).toBe(false);
    expect(updatedQuiz.score).toBe(0);
    expect(Number(updatedQuiz.percentage)).toBe(0);
  });

  test('does not trust is_correct sent by the caller', async () => {
    const { quiz } = await createQuizForUser({ total_questions: 1 });
    const question = await insertQuestion(validQuestion());

    const answer = await recordAnswer({
      quiz_id: quiz.id,
      question_id: question.id,
      user_answer: ['A'],
      is_correct: true,
      time_secs: 3,
    });

    expect(answer.is_correct).toBe(false);
  });

  test('fetches answers for a quiz in answer order', async () => {
    const { quiz } = await createQuizForUser({ total_questions: 2 });
    const firstQuestion = await insertQuestion(validQuestion());
    const secondQuestion = await insertQuestion(validQuestion({
      question_text: 'Which AWS storage service is object based and highly durable?',
      domain: 'tecnologia',
      options: [
        { id: 'A', text: 'Amazon EBS' },
        { id: 'B', text: 'Amazon S3' },
        { id: 'C', text: 'Amazon EFS' },
      ],
      correct_answer: ['B'],
      explanation: 'Amazon S3 is object storage designed for durability.',
    }));

    await recordAnswer(quiz.id, firstQuestion.id, ['B'], 5);
    await recordAnswer(quiz.id, secondQuestion.id, ['A'], 7);

    const answers = await getAnswersByQuiz(quiz.id);

    expect(answers).toHaveLength(2);
    expect(answers[0].question_id).toBe(firstQuestion.id);
    expect(answers[1].question_id).toBe(secondQuestion.id);
  });

  test('calculates user stats and weak domains from recorded answers', async () => {
    const { user, quiz } = await createQuizForUser({ total_questions: 2 });
    const securityQuestion = await insertQuestion(validQuestion({ domain: 'seguranca' }));
    const billingQuestion = await insertQuestion(validQuestion({
      question_text: 'Which AWS tool is used to inspect monthly billing anomalies?',
      domain: 'faturamento',
      options: [
        { id: 'A', text: 'AWS Cost Anomaly Detection' },
        { id: 'B', text: 'AWS IAM' },
        { id: 'C', text: 'Amazon EC2' },
      ],
      correct_answer: ['A'],
      explanation: 'AWS Cost Anomaly Detection identifies unusual spend patterns.',
    }));

    await recordAnswer(quiz.id, securityQuestion.id, ['B'], 5);
    await recordAnswer(quiz.id, billingQuestion.id, ['B'], 9);

    const stats = await calculateStats(user.id);
    const weakDomains = await getWeakDomains(user.id, 70);

    expect(stats.total_quizzes).toBe(1);
    expect(stats.total_questions).toBe(2);
    expect(stats.correct_answers).toBe(1);
    expect(stats.accuracy).toBe(50);
    expect(weakDomains).toEqual([
      {
        domain: 'faturamento',
        accuracy: 0,
        total_questions: 1,
        correct_answers: 0,
      },
    ]);
  });

  test('validates required quiz and answer inputs', async () => {
    const user = await createTestUser();
    const { quiz } = await createQuizForUser({ user_id: user.id, total_questions: 1 });
    const question = await insertQuestion(validQuestion());

    await expect(
      createQuizHistory('', 'CLF-C02', { total_questions: 1 }),
    ).rejects.toThrow('userId must be at least 1 character');

    await expect(
      createQuizHistory(user.id, 'invalid-cert', { total_questions: 1 }),
    ).rejects.toThrow('Invalid certification: invalid-cert');

    await expect(
      recordAnswer(quiz.id, question.id, undefined, 1),
    ).rejects.toThrow('userAnswer is required');

    await expect(
      recordAnswer(quiz.id, question.id, ['B'], -1),
    ).rejects.toThrow('timeSecs must be a non-negative number');
  });

  test('errors for missing quiz or question without leaving partial state', async () => {
    const { quiz } = await createQuizForUser({ total_questions: 1 });
    const question = await insertQuestion(validQuestion());

    await expect(
      recordAnswer(randomUUID(), question.id, ['B'], 1),
    ).rejects.toThrow('Quiz not found');

    await expect(
      recordAnswer(quiz.id, randomUUID(), ['B'], 1),
    ).rejects.toThrow('Question not found');

    const answers = await getAnswersByQuiz(quiz.id);
    const unchangedQuiz = await getQuizById(quiz.id);

    expect(answers).toHaveLength(0);
    expect(unchangedQuiz.score).toBe(0);
  });

  test('keeps user_stats aggregates from multiplying quiz and focus rows', async () => {
    const user = await createTestUser();
    await createQuizHistory({
      user_id: user.id,
      certification: 'CLF-C02',
      score: 1,
      total_questions: 1,
      percentage: 100,
      time_spent_secs: 30,
    });
    await createQuizHistory({
      user_id: user.id,
      certification: 'SAA-C03',
      score: 0,
      total_questions: 1,
      percentage: 0,
      time_spent_secs: 40,
    });
    await executeQuery(
      `INSERT INTO focus_sessions (user_id, minutes, session_type, session_date)
       VALUES ($1, 10, 'focus', CURRENT_DATE), ($1, 20, 'focus', CURRENT_DATE)`,
      [user.id],
    );

    const stats = await getUserStats(user.id);

    expect(Number(stats.total_quizzes)).toBe(2);
    expect(Number(stats.total_time_secs)).toBe(70);
    expect(Number(stats.total_focus_minutes)).toBe(30);
  });
});
