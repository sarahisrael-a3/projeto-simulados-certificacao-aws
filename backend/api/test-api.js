#!/usr/bin/env node

/**
 * API Integration Tests
 * Tests all main endpoints
 * Run with: node backend/api/test-api.js (while API is running on port 3001)
 */

const BASE_URL = 'http://127.0.0.1:3001/api';

let testsPassed = 0;
let testsFailed = 0;

// Helper for HTTP requests
async function request(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    throw error;
  }
}

// Helper for assertions
function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    testsPassed++;
  } else {
    console.log(`  ❌ ${message}`);
    testsFailed++;
  }
}

// Main test suite
async function runTests() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🧪 API Integration Tests');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // ===== TEST 1: Health Check =====
    console.log('1️⃣  Testing Health Check');
    const healthRes = await request('GET', '/health');
    assert(healthRes.status === 200, 'Health check returns 200');
    assert(healthRes.data.success === true, 'Health check returns success true');

    // ===== TEST 2: Get Questions =====
    console.log('\n2️⃣  Testing GET /questions');
    const questionsRes = await request('GET', '/questions?limit=5&offset=0');
    assert(questionsRes.status === 200, 'GET questions returns 200');
    assert(Array.isArray(questionsRes.data.data), 'Questions data is array');

    // ===== TEST 3: Create User =====
    console.log('\n3️⃣  Testing POST /users');
    const userRes = await request('POST', '/users', {});
    assert(userRes.status === 201, 'POST user returns 201');
    assert(userRes.data.data.id !== undefined, 'User has ID');
    const testUserId = userRes.data.data.id;
    console.log(`     (Created user: ${userRes.data.data.anonymous_name})`);

    // ===== TEST 4: Get User Stats =====
    console.log('\n4️⃣  Testing GET /users/:id/stats');
    const statsRes = await request('GET', `/users/${testUserId}/stats`);
    assert(statsRes.status === 200, 'GET user stats returns 200');
    assert(statsRes.data.data.user_id === testUserId, 'Stats belong to correct user');

    // ===== TEST 5: Start Quiz =====
    console.log('\n5️⃣  Testing POST /quiz/start');
    const quizStartRes = await request('POST', '/quizzes/start', {
      user_id: testUserId,
      certification: 'CLF-C02',
      num_questions: 3,
    });
    
    // If no questions in DB, expect 400
    if (quizStartRes.status === 400 && quizStartRes.data.message.includes('No questions')) {
      assert(true, 'POST quiz start correctly returns 400 when no questions exist');
      console.log('     (Skipping quiz tests - no questions in DB)');
    } else {
      assert(quizStartRes.status === 201, 'POST quiz start returns 201');
      assert(quizStartRes.data.data.quiz_id !== undefined, 'Quiz has ID');
      const testQuizId = quizStartRes.data.data.quiz_id;
      const numQuestions = quizStartRes.data.data.questions.length;
      console.log(`     (Created quiz with ${numQuestions} questions)`);

      // ===== TEST 6: Record Answer =====
      if (numQuestions > 0) {
        console.log('\n6️⃣  Testing POST /quiz/:id/answer');
        const question = quizStartRes.data.data.questions[0];
        const answerRes = await request('POST', `/quizzes/${testQuizId}/answer`, {
          question_id: question.id,
          user_answer: ['A'],
          is_correct: true,
          time_secs: 30,
        });
        assert(answerRes.status === 200, 'POST answer returns 200');
        assert(answerRes.data.success === true, 'Answer recorded successfully');
      } else {
        console.log('\n6️⃣  Skipping answer test (no questions in DB)');
      }

      // ===== TEST 7: Get Quiz Results =====
      console.log('\n7️⃣  Testing GET /quiz/:id/results');
      const resultsRes = await request('GET', `/quizzes/${testQuizId}/results`);
      assert(resultsRes.status === 200, 'GET quiz results returns 200');
      assert(resultsRes.data.data.quiz_id === testQuizId, 'Results belong to correct quiz');
    }

    // ===== TEST 8: Get Leaderboard =====
    console.log('\n8️⃣  Testing GET /leaderboard');
    const leaderboardRes = await request('GET', '/leaderboard?limit=10');
    assert(leaderboardRes.status === 200, 'GET leaderboard returns 200');
    assert(Array.isArray(leaderboardRes.data.data), 'Leaderboard is array');

    // ===== TEST 9: Get Weak Domains =====
    console.log('\n9️⃣  Testing GET /users/:id/weak-domains');
    const weakDomainsRes = await request('GET', `/users/${testUserId}/weak-domains`);
    assert(weakDomainsRes.status === 200, 'GET weak domains returns 200');
    assert(Array.isArray(weakDomainsRes.data.data.weak_domains), 'Weak domains is array');

    // ===== TEST 10: 404 Handler =====
    console.log('\n🔟 Testing 404 Handler');
    const notFoundRes = await request('GET', '/nonexistent');
    assert(notFoundRes.status === 404, '404 handler returns 404');
    assert(notFoundRes.data.success === false, '404 handler returns success false');

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
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
console.log('⏳ Waiting for API to be ready...');
setTimeout(() => {
  runTests().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}, 1000);
