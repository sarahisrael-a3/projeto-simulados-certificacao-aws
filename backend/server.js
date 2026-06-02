#!/usr/bin/env node

/**
 * PGLite Development Server
 * Starts the database for local development
 */

import { initializeDatabase, closeDatabase } from './database/db.js';

/**
 * Handle graceful shutdown
 */
async function gracefulShutdown() {
  console.log('\n⏹ Shutting down server...');
  try {
    await closeDatabase();
    console.log('✓ Server stopped gracefully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error during shutdown:', error.message);
    process.exit(1);
  }
}

/**
 * Main server initialization
 */
async function startServer() {
  try {
    console.log('🚀 Starting PGLite Database Server...\n');

    // Initialize database
    const db = await initializeDatabase({
      dataDir: process.env.DB_DATA_DIR || undefined,
    });

    console.log('\n✓ Server is ready');
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📝 Database API available for imports`);
    console.log('\nPress Ctrl+C to stop the server\n');

    // Keep the server running
    await new Promise((resolve) => {
      process.on('SIGINT', () => resolve());
      process.on('SIGTERM', () => resolve());
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start the server
startServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
