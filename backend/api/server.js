#!/usr/bin/env node

/**
 * Express REST API Server for AWS Certification Simulator
 * Runs on http://localhost:3001
 * Connects to PGLite database via backend/database/db.js
 */

import express from 'express';
import cors from 'cors';
import { initializeDatabase, closeDatabase } from '../database/db.js';
import questionsRoutes from './routes/questions.js';
import quizzesRoutes from './routes/quizzes.js';
import usersRoutes from './routes/users.js';

const app = express();
const API_PORT = 3001;
const API_HOST = '127.0.0.1';

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// ROUTES
// ============================================================================

// Question routes
app.use('/api/questions', questionsRoutes);

// Quiz/Quizzes routes (support both /api/quiz and /api/quizzes)
app.use('/api/quiz', quizzesRoutes);
app.use('/api/quizzes', quizzesRoutes);

// User routes (this handles /api/users and /api/leaderboard should be separate)
app.use('/api/users', usersRoutes);

// Leaderboard alias route
app.get('/api/leaderboard', async (req, res, next) => {
  try {
    const { limit = 100 } = req.query;
    const { getLeaderboard } = await import('../database/db.js');
    const leaderboard = await getLeaderboard(parseInt(limit));
    res.status(200).json({
      success: true,
      data: leaderboard,
      count: leaderboard.length,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// ERROR HANDLER
// ============================================================================

app.use((err, req, res, next) => {
  console.error(`✗ Error: ${err.message}`);
  
  // Default to 500 error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

/**
 * Handle graceful shutdown
 */
async function gracefulShutdown() {
  console.log('\n⏹ Shutting down API server...');
  try {
    await closeDatabase();
    console.log('✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error during shutdown:', error.message);
    process.exit(1);
  }
}

/**
 * Start the API server
 */
async function startServer() {
  try {
    console.log('🚀 Starting Express API Server...\n');

    // Initialize database
    console.log('📦 Initializing database...');
    await initializeDatabase({
      dataDir: process.env.DB_DATA_DIR || undefined,
    });
    console.log('✓ Database initialized');

    // Start Express server
    app.listen(API_PORT, API_HOST, () => {
      console.log(`\n✓ API Server running on http://${API_HOST}:${API_PORT}`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📝 API Documentation: http://${API_HOST}:${API_PORT}/api/health`);
      console.log('\nPress Ctrl+C to stop the server\n');
    });

    // Handle shutdown signals
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export default app;
