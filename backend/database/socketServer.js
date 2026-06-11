/**
 * PGLite Socket Server
 * Provides network access to the PGLite database
 */

import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { getDatabase } from './db.js';

const DEFAULT_PORT = 5432;
const DEFAULT_HOST = '127.0.0.1';

let server = null;

/**
 * Start socket server for database access
 * @param {Object} options - Server configuration
 * @param {number} options.port - Port to listen on
 * @param {string} options.host - Host to bind to
 * @returns {Promise<void>}
 */
export async function startSocketServer(options = {}) {
  const port = options.port || DEFAULT_PORT;
  const host = options.host || DEFAULT_HOST;

  if (server) {
    console.log(`Socket server already running on ${host}:${port}`);
    return;
  }

  try {
    const db = getDatabase();

    server = new PGLiteSocketServer({
      db,
      port,
      host,
    });

    await server.start();
    console.log(`✓ Socket server started on ${host}:${port}`);
  } catch (error) {
    console.error(`✗ Failed to start socket server:`, error.message);
    throw error;
  }
}

/**
 * Stop socket server
 * @returns {Promise<void>}
 */
export async function stopSocketServer() {
  if (server) {
    try {
      await server.stop();
      server = null;
      console.log('✓ Socket server stopped');
    } catch (error) {
      console.error('✗ Error stopping socket server:', error.message);
      throw error;
    }
  }
}

/**
 * Get server instance
 * @returns {PGLiteSocketServer|null}
 */
export function getSocketServer() {
  return server;
}

export default {
  startSocketServer,
  stopSocketServer,
  getSocketServer,
};
