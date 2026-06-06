/**
 * @jest-environment node
 */

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
  closeDatabase,
  getDatabase,
  initializeDatabase,
  normalizeCertification,
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
