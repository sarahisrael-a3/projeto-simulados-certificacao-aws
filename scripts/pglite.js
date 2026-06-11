#!/usr/bin/env bun

import { exec } from "child_process";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { readFileSync } from "fs";
// import { drizzle } from 'drizzle-orm/pglite'

const MIGRATION_PATH = `backend\database\schema.sql`;
const PORT = 5432;
const HOST = "127.0.0.1";

const db = await PGlite.create({
  // dataDir: "/tmp/pglite/hono"
  // extensions: { vector },
});

const server = new PGLiteSocketServer({
  db,
  port: PORT,
  host: HOST,
});
await server.start();

// await db.exec("CREATE EXTENSION IF NOT EXISTS vector;");

console.log(`Running migrations...`);

// await $`bun run db:push`.cwd(MIGRATION_PATH).quiet();
let migration_script = readFileSync(MIGRATION_PATH, {encoding:"utf-8"});

await db.exec(migration_script);

console.log(`Migrations completed.`);

console.log(`Server started on ${HOST}:${PORT}`);

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Stopping server...");
  await server.stop();
  await db.close();

  console.log("Server stopped and database closed");
  process.exit(0);
});