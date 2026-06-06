/**
 * @jest-environment node
 */

import { mkdtemp, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
  closeDatabase,
  deleteQuestion,
  getDatabase,
  getQuestionById,
  getQuestions,
  getQuestionsByDomain,
  initializeDatabase,
  insertQuestion,
  normalizeCertification,
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
