#!/usr/bin/env node

/**
 * Minimal test suite for db.js
 * Tests core CRUD operations and data integrity
 * Run with: node backend/database/db.test.js
 */

import {
  initializeDatabase,
  closeDatabase,
  // Questions
  getQuestions,
  getQuestionById,
  insertQuestion,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  // Users
  createUser,
  getUserById,
  getUserByName,
  // Gamification
  getGamification,
  updateGamification,
  // Quiz
  createQuizHistory,
  getQuizHistory,
  getQuizById,
  recordAnswer,
  getAnswersByQuiz,
  calculateQuizStats,
  // Leaderboard
  getLeaderboard,
  getUserStats,
  getWeakDomains,
} from './db.js';

// Test counter
let testsPassed = 0;
let testsFailed = 0;

// Helper function to assert
function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    testsPassed++;
  } else {
    console.log(`  ❌ ${message}`);
    testsFailed++;
  }
}

// Test suite
async function runTests() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🧪 Database (db.js) Test Suite');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // ===== TEST 1: Initialization =====
    console.log('1️⃣  Testing Database Initialization');
    const db = await initializeDatabase();
    assert(db !== null, 'Database initialized successfully');

    // ===== TEST 2: Create User =====
    console.log('\n2️⃣  Testing User Creation');
    const userName = `TestUser_${Date.now()}`;
    const user = await createUser(userName);
    assert(user !== null, 'User created');
    assert(user.id !== undefined, 'User has ID');
    assert(user.anonymous_name === userName, 'User name is correct');
    const testUserId = user.id;

    // ===== TEST 3: Get User =====
    console.log('\n3️⃣  Testing User Retrieval');
    const fetchedUser = await getUserById(testUserId);
    assert(fetchedUser !== null, 'User fetched by ID');
    assert(fetchedUser.id === testUserId, 'Fetched user ID matches');

    const userByName = await getUserByName(userName);
    assert(userByName !== null, 'User fetched by name');
    assert(userByName.id === testUserId, 'Fetched user by name matches');

    // ===== TEST 4: Get Questions =====
    console.log('\n4️⃣  Testing Question Retrieval');
    const questions = await getQuestions({ limit: 5 });
    assert(Array.isArray(questions), 'Questions returned as array');
    console.log(`     (Found ${questions.length} questions in database)`);

    // ===== TEST 5: Get Question by ID =====
    if (questions.length > 0) {
      console.log('\n5️⃣  Testing Single Question Retrieval');
      const questionId = questions[0].id;
      const question = await getQuestionById(questionId);
      assert(question !== null, 'Question fetched by ID');
      assert(question.id === questionId, 'Question ID matches');
    } else {
      console.log('\n5️⃣  Skipping Single Question Test (no questions in DB)');
    }

    // ===== TEST 6: Gamification =====
    console.log('\n6️⃣  Testing Gamification');
    const gamification = await getGamification(testUserId);
    assert(gamification !== null, 'Gamification record retrieved');
    assert(gamification.user_id === testUserId, 'Gamification belongs to user');
    assert(gamification.xp_points === 0, 'Initial XP is 0');

    // ===== TEST 7: Update Gamification =====
    console.log('\n7️⃣  Testing Gamification Update');
    const updatedGamification = await updateGamification(testUserId, {
      xp_points: 100,
      total_quizzes: 5,
    });
    assert(updatedGamification !== null, 'Gamification updated');
    assert(updatedGamification.xp_points === 100, 'XP points updated to 100');
    assert(updatedGamification.total_quizzes === 5, 'Total quizzes updated to 5');

    // ===== TEST 8: Create Quiz History =====
    console.log('\n8️⃣  Testing Quiz History Creation');
    const quizData = {
      user_id: testUserId,
      certification: 'CLF-C02',
      score: 8,
      total_questions: 10,
      percentage: 80.00,
      time_spent_secs: 600,
      domain_scores: { seguranca: { score: 4, total: 5 } },
      weak_domains: [],
    };
    const quiz = await createQuizHistory(quizData);
    assert(quiz !== null, 'Quiz history created');
    assert(quiz.score === 8, 'Quiz score is correct');
    assert(parseFloat(quiz.percentage) === 80.00, 'Quiz percentage is correct');
    const testQuizId = quiz.id;

    // ===== TEST 9: Get Quiz History =====
    console.log('\n9️⃣  Testing Quiz History Retrieval');
    const quizHistory = await getQuizHistory(testUserId);
    assert(Array.isArray(quizHistory), 'Quiz history returned as array');
    assert(quizHistory.length > 0, 'Quiz history contains records');

    // ===== TEST 10: Get Specific Quiz =====
    console.log('\n🔟 Testing Specific Quiz Retrieval');
    const fetchedQuiz = await getQuizById(testQuizId);
    assert(fetchedQuiz !== null, 'Quiz fetched by ID');
    assert(fetchedQuiz.id === testQuizId, 'Quiz ID matches');

    // ===== TEST 11: Record Answer =====
    if (questions.length > 0) {
      console.log('\n1️⃣1️⃣  Testing Answer Recording');
      const answerData = {
        quiz_id: testQuizId,
        question_id: questions[0].id,
        user_answer: ['A'],
        is_correct: true,
        time_secs: 45,
      };
      const answer = await recordAnswer(answerData);
      assert(answer !== null, 'Answer recorded');
      assert(answer.is_correct === true, 'Answer correctness recorded');
    }

    // ===== TEST 12: Get Answers by Quiz =====
    console.log('\n1️⃣2️⃣  Testing Answers Retrieval');
    const answers = await getAnswersByQuiz(testQuizId);
    assert(Array.isArray(answers), 'Answers returned as array');

    // ===== TEST 13: Calculate Quiz Stats =====
    console.log('\n1️⃣3️⃣  Testing Quiz Statistics Calculation');
    const stats = await calculateQuizStats(testQuizId);
    assert(stats !== null, 'Quiz stats calculated');
    assert(stats.quiz_id === testQuizId, 'Stats quiz ID matches');
    assert(parseFloat(stats.percentage) === 80.00, 'Stats percentage correct');

    // ===== TEST 14: Leaderboard =====
    console.log('\n1️⃣4️⃣  Testing Leaderboard');
    const leaderboard = await getLeaderboard(10);
    assert(Array.isArray(leaderboard), 'Leaderboard returned as array');
    console.log(`     (Leaderboard has ${leaderboard.length} entries)`);

    // ===== TEST 15: User Stats =====
    console.log('\n1️⃣5️⃣  Testing User Statistics');
    const userStats = await getUserStats(testUserId);
    assert(userStats !== null, 'User stats retrieved');
    if (userStats) {
      assert(userStats.user_id === testUserId, 'User stats belong to correct user');
    }

    // ===== TEST 16: Weak Domains =====
    console.log('\n1️⃣6️⃣  Testing Weak Domains Analysis');
    const weakDomains = await getWeakDomains(testUserId);
    assert(Array.isArray(weakDomains), 'Weak domains returned as array');

    // ===== TEST 17: Search Questions =====
    console.log('\n1️⃣7️⃣  Testing Question Search');
    const searchResults = await searchQuestions('AWS', 5);
    assert(Array.isArray(searchResults), 'Search results returned as array');
    console.log(`     (Found ${searchResults.length} search results)`);

    // ===== Cleanup =====
    console.log('\n🧹 Cleaning up...');
    await closeDatabase();
    console.log('✅ Database closed');

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    console.error(error.stack);
    testsFailed++;
  }

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 Test Summary');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📈 Total:  ${testsPassed + testsFailed}`);

  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${testsFailed} test(s) failed`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
