/**
 * APP.JS - Lógica Principal da Aplicação
 * Gerencia o fluxo completo do simulador: seleção de certificação, quiz, 
 * análise de desempenho, persistência de dados e geração de relatórios.
 */

// ============================================================================
// 1. ESTADO GLOBAL DA APLICAÇÃO
// ============================================================================

let appState = {
  currentCertification: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  answers: [],
  score: 0,
  domainScores: {},
  quizStartTime: null,
  timerInterval: null,
  timeRemaining: 15 * 60,
  quizMode: 'exam',
  flaggedQuestions: []
};

const CONFIG = {
  QUIZ_DURATION: 15 * 60,
  QUESTIONS_PER_QUIZ: 10,
  PASSING_SCORE: 70,
  STORAGE_KEY_PREFIX: 'aws_sim_'
};

// ============================================================================
// 2. INICIALIZAÇÃO DA APLICAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initializeRadarChart();
  loadLastScore();
  updateHistoryDisplay();
  checkMistakes(); // Verifica erros ao carregar a página
  
  const certSelect = document.getElementById('certification-select');
  if (certSelect) {
    certSelect.addEventListener('change', () => {
      loadLastScore();
      checkMistakes(); // Atualiza botão ao trocar de certificação
    });
  }
});

// ============================================================================
// 3. GESTÃO DE ECRÃS E NAVEGAÇÃO
// ============================================================================

function showScreen(screenName) {
  const screens = {
    start: document.getElementById('screen-start'),
    quiz: document.getElementById('screen-quiz'),
    results: document.getElementById('screen-results')
  };
  
  Object.values(screens).forEach(screen => {
    if (screen) {
      screen.classList.add('hidden');
      screen.classList.remove('flex', 'flex-col');
    }
  });
  
  const targetScreen = screens[screenName];
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('flex', 'flex-col', 'fade-in');
  }
}

function goHome() {
  resetAppState();
  showScreen('start');
  updateScoreDisplay();
  checkMistakes();
  updateDynamicInsight('Comece o simulado para que a IA mapeie seu perfil de conhecimento.');
}

// ============================================================================
// 4. GESTÃO DO QUIZ E LOGICA DE QUESTÕES
// ============================================================================

async function startQuiz() {
  const certSelect = document.getElementById('certification-select');
  const quantitySelect = document.getElementById('question-quantity');
  const difficultySelect = document.getElementById('difficulty-level');
  const topicFilterInput = document.getElementById('topic-filter');
  
  const selectedCertId = certSelect ? certSelect.value : 'clf-c02';
  const quantity = quantitySelect ? parseInt(quantitySelect.value) : CONFIG.QUESTIONS_PER_QUIZ;
  const difficulty = difficultySelect ? difficultySelect.value : 'all';
  const filterText = topicFilterInput ? topicFilterInput.value.toLowerCase().trim() : '';
  const quizMode = document.getElementById('mode-study')?.checked ? 'study' : 'exam';

  const startBtn = document.getElementById('btn-start-quiz');
  
  try {
    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>A preparar...';

    const response = await fetch(`data/${selectedCertId}.json`);
    if (!response.ok) throw new Error('Falha ao carregar banco de dados.');
    let questionsData = await response.json();

    if (difficulty !== 'all') {
      questionsData = questionsData.filter(q => q.difficulty === difficulty);
    }

    if (filterText) {
      questionsData = questionsData.filter(q => 
        q.question.toLowerCase().includes(filterText) || 
        q.domain.toLowerCase().includes(filterText)
      );
    }

    if (questionsData.length === 0) {
      alert('Nenhuma questão encontrada com estes filtros.');
      return;
    }

    appState.questions = shuffleArray(questionsData).slice(0, Math.min(quantity, questionsData.length));
    appState.currentCertification = certificationPaths[selectedCertId];
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.answers = [];
    appState.flaggedQuestions = [];
    appState.quizMode = quizMode;
    
    appState.domainScores = {};
    appState.currentCertification.domains.forEach(d => {
      appState.domainScores[d.id] = { total: 0, correct: 0 };
    });

    appState.timeRemaining = quantity * 90; 

    showScreen('quiz');
    if (quizMode === 'exam') startTimer();
    reinitializeRadarChart();
    loadQuestion();
    updateScoreDisplay();

  } catch (error) {
    console.error('Erro ao iniciar:', error);
  } finally {
    startBtn.disabled = false;
    startBtn.innerHTML = 'Iniciar Simulação <i class="fa-solid fa-arrow-right ml-2"></i>';
  }
}

async function startMistakesQuiz() {
  const certId = document.getElementById('certification-select').value;
  const mistakesIds = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_KEY_PREFIX}mistakes_${certId}`) || "[]");

  try {
    const response = await fetch(`data/${certId}.json`);
    const questionsData = await response.json();
    
    appState.questions = shuffleArray(questionsData.filter(q => mistakesIds.includes(q.id)));
    appState.currentCertification = certificationPaths[certId];
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.answers = [];
    appState.quizMode = 'study'; 
    
    showScreen('quiz');
    reinitializeRadarChart();
    loadQuestion();
    updateScoreDisplay();
  } catch (error) {
    console.error('Erro ao carregar revisão:', error);
  }
}

function loadQuestion() {
  const question = appState.questions[appState.currentQuestionIndex];
  if (!question) return;
  
  document.getElementById('question-category').textContent = getDomainName(question.domain);
  document.getElementById('question-text').textContent = question.question;
  document.getElementById('current-q-num').textContent = appState.currentQuestionIndex + 1;
  document.getElementById('total-q-num').textContent = appState.questions.length;
  
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${((appState.currentQuestionIndex + 1) / appState.questions.length) * 100}%`;
  }
  
  updateFlagUI();
  renderOptions(question);
  
  appState.selectedAnswer = null;
  document.getElementById('btn-submit').disabled = true;
  document.getElementById('explanation-box').classList.add('hidden');
  document.getElementById('btn-next').classList.add('hidden');
  document.getElementById('btn-finish').classList.add('hidden');
}

function renderOptions(question) {
  const container = document.getElementById('options-container');
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  
  question.options.forEach((option, index) => {
    const card = document.createElement('div');
    card.className = 'option-card p-4 rounded-lg flex items-start gap-3';
    card.setAttribute('data-index', index);
    card.innerHTML = `
      <div class="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-gray-500">${String.fromCharCode(65 + index)}</div>
      <div class="flex-grow text-gray-700">${option}</div>
    `;
    card.addEventListener('click', () => selectOption(index));
    fragment.appendChild(card);
  });
  container.appendChild(fragment);
}

function selectOption(index) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`[data-index="${index}"]`);
  if (card) {
    card.classList.add('selected');
    appState.selectedAnswer = index;
    document.getElementById('btn-submit').disabled = false;
  }
}

function submitAnswer() {
  if (appState.selectedAnswer === null) return;
  const question = appState.questions[appState.currentQuestionIndex];
  const isCorrect = appState.selectedAnswer === question.correct;
  
  appState.answers.push({ questionId: question.id, domain: question.domain, isCorrect });
  if (isCorrect) appState.score++;
  
  appState.domainScores[question.domain].total++;
  if (isCorrect) appState.domainScores[question.domain].correct++;
  
  document.querySelectorAll('.option-card').forEach((card, index) => {
    card.classList.add('disabled');
    if (index === question.correct) card.classList.add('correct');
    else if (index === appState.selectedAnswer && !isCorrect) card.classList.add('incorrect');
  });
  
  document.getElementById('explanation-text').textContent = question.explanation;
  document.getElementById('explanation-box').classList.remove('hidden');
  document.getElementById('btn-submit').classList.add('hidden');
  
  if (appState.currentQuestionIndex === appState.questions.length - 1) {
    document.getElementById('btn-finish').classList.remove('hidden');
  } else {
    document.getElementById('btn-next').classList.remove('hidden');
  }
  updateScoreDisplay();
  updateRadarChart();
}

function nextQuestion() {
  const quizScreen = document.getElementById('screen-quiz');
  quizScreen.classList.add('slide-out');
  
  setTimeout(() => {
    appState.currentQuestionIndex++;
    loadQuestion();
    quizScreen.classList.remove('slide-out');
    quizScreen.classList.add('slide-in');
    setTimeout(() => quizScreen.classList.remove('slide-in'), 300);
  }, 300);
}

function finishQuiz() {
  stopTimer();
  saveQuizResult(); 
  updateHistoryDisplay(); 
  showResultsScreen();
  showScreen('results');
}

// ============================================================================
// 5. PERSISTÊNCIA E LOGICA DE ERROS
// ============================================================================

function saveQuizResult() {
  const certId = appState.currentCertification.id;
  const result = {
    certificationId: certId,
    certificationName: appState.currentCertification.name,
    date: new Date().toISOString(),
    score: appState.score,
    total: appState.questions.length,
    percentage: (appState.score / appState.questions.length) * 100,
    domainScores: appState.domainScores,
    answers: appState.answers,
    quizMode: appState.quizMode
  };
  
  localStorage.setItem(`${CONFIG.STORAGE_KEY_PREFIX}last_${certId}`, JSON.stringify(result));
  updateMistakesDatabase(certId, result.answers); // Atualiza os erros
  
  const history = getQuizHistory();
  history.push(result);
  if (history.length > 10) history.shift();
  localStorage.setItem(`${CONFIG.STORAGE_KEY_PREFIX}history`, JSON.stringify(history));
}

function updateMistakesDatabase(certId, answers) {
  const storageKey = `${CONFIG.STORAGE_KEY_PREFIX}mistakes_${certId}`;
  let mistakes = JSON.parse(localStorage.getItem(storageKey) || "[]");
  
  answers.forEach(ans => {
    if (!ans.isCorrect) {
      if (!mistakes.includes(ans.questionId)) mistakes.push(ans.questionId);
    } else {
      mistakes = mistakes.filter(id => id !== ans.questionId);
    }
  });
  localStorage.setItem(storageKey, JSON.stringify(mistakes));
}

function checkMistakes() {
  const certId = document.getElementById('certification-select')?.value;
  if (!certId) return;
  const mistakes = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_KEY_PREFIX}mistakes_${certId}`) || "[]");
  const btn = document.getElementById('btn-practice-mistakes');
  const count = document.getElementById('mistakes-count');
  
  if (mistakes.length > 0 && btn && count) {
    btn.classList.remove('hidden');
    count.textContent = mistakes.length;
  } else if (btn) {
    btn.classList.add('hidden');
  }
}

// ============================================================================
// 6. UI, GRÁFICOS E UTILITÁRIOS
// ============================================================================

function initializeRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;
  window.radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Conceitos Cloud', 'Segurança', 'Tecnologia', 'Faturamento'],
      datasets: [{
        label: 'Desempenho (%)',
        data: [0, 0, 0, 0],
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
        borderColor: 'rgba(255, 153, 0, 1)',
        borderWidth: 2
      }]
    },
    options: { scales: { r: { beginAtZero: true, max: 100 } } }
  });
}

function reinitializeRadarChart() {
  if (!window.radarChartInstance || !appState.currentCertification) return;
  const labels = appState.currentCertification.domains.map(d => d.name);
  window.radarChartInstance.data.labels = labels;
  window.radarChartInstance.data.datasets[0].data = labels.map(() => 0);
  window.radarChartInstance.update();
}

function updateRadarChart() {
  if (!window.radarChartInstance || !appState.currentCertification) return;
  const data = appState.currentCertification.domains.map(domain => {
    const scores = appState.domainScores[domain.id];
    return scores && scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
  });
  window.radarChartInstance.data.datasets[0].data = data;
  window.radarChartInstance.update();
}

function initTheme() {
  const saved = localStorage.getItem('aws_sim_theme');
  if (saved === 'dark') document.documentElement.classList.add('dark');
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('aws_sim_theme', isDark ? 'dark' : 'light');
}

function resetAppState() {
  if (appState.timerInterval) clearInterval(appState.timerInterval);
  appState = {
    currentCertification: null, questions: [], currentQuestionIndex: 0,
    selectedAnswer: null, answers: [], score: 0, domainScores: {},
    timerInterval: null, timeRemaining: CONFIG.QUIZ_DURATION,
    quizMode: 'exam', flaggedQuestions: []
  };
}

// Auxiliares
function shuffleArray(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function getDomainName(id) { 
  const domain = appState.currentCertification?.domains.find(d => d.id === id);
  return domain ? domain.name : id; 
}
function updateScoreDisplay() { 
  document.getElementById('score-display').textContent = `${appState.score} / ${appState.answers.length}`; 
}
function startTimer() { /* Lógica de timer original */ }
function stopTimer() { if (appState.timerInterval) clearInterval(appState.timerInterval); }