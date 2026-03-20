/**
 * APP.JS - Lógica Principal da Aplicação
 * Gerencia o fluxo completo do simulador: seleção de certificação, quiz, 
 * análise de desempenho, persistência de dados e geração de relatórios.
 */

// ============================================================================
// 1. ESTADO GLOBAL DA APLICAÇÃO
// ============================================================================

let appState = {
  currentCertification: null,    // Certificação selecionada
  questions: [],                 // Questões do quiz atual
  currentQuestionIndex: 0,       // Índice da questão atual
  selectedAnswer: null,          // Resposta selecionada pelo utilizador
  answers: [],                   // Histórico de respostas
  score: 0,                      // Pontuação atual
  domainScores: {},              // Pontuação por domínio
  quizStartTime: null,           // Timestamp de início do quiz
  timerInterval: null,           // Referência do intervalo do timer
  timeRemaining: 15 * 60,        // Tempo restante em segundos
  quizMode: 'exam',              // 'exam' ou 'study'
  flaggedQuestions: []           // Questões marcadas para revisão
};

// ============================================================================
// 2. CONSTANTES DE CONFIGURAÇÃO
// ============================================================================

const CONFIG = {
  QUIZ_DURATION: 15 * 60,        // Duração padrão em segundos
  QUESTIONS_PER_QUIZ: 10,        // Número padrão de questões
  PASSING_SCORE: 70,             // % mínima para aprovação
  STORAGE_KEY_PREFIX: 'aws_sim_' // Prefixo para localStorage
};

// ============================================================================
// 3. INICIALIZAÇÃO DA APLICAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initializeRadarChart();
  loadLastScore();
  updateHistoryDisplay();
  checkMistakes(); // Verifica se há erros salvos para mostrar o botão na home
  
  const certSelect = document.getElementById('certification-select');
  if (certSelect) {
    certSelect.addEventListener('change', () => {
      loadLastScore();
      checkMistakes(); // Atualiza visibilidade do botão de erros ao trocar cert
    });
  }
});

// ============================================================================
// 4. GESTÃO DE ECRÃS E NAVEGAÇÃO
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
  checkMistakes(); // Garante atualização ao voltar
  updateDynamicInsight('Comece o simulado para que a IA mapeie seu perfil de conhecimento.');
}

// ============================================================================
// 5. GESTÃO DO QUIZ E QUESTÕES
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
        q.domain.toLowerCase().includes(filterText) ||
        (q.explanation && q.explanation.toLowerCase().includes(filterText))
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
    alert('Erro ao iniciar simulado.');
  } finally {
    startBtn.disabled = false;
    startBtn.innerHTML = 'Iniciar Simulação <i class="fa-solid fa-arrow-right ml-2"></i>';
  }
}

/**
 * Modo Revisão: Pratica apenas questões erradas anteriormente
 */
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
    const progress = ((appState.currentQuestionIndex + 1) / appState.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
  
  updateFlagUI();
  renderOptions(question);
  
  appState.selectedAnswer = null;
  document.getElementById('btn-submit').disabled = true;
  document.getElementById('explanation-box').classList.add('hidden');
  document.getElementById('btn-next').classList.add('hidden');
  document.getElementById('btn-finish').classList.add('hidden');
  document.getElementById('btn-submit').classList.remove('hidden');
}

function renderOptions(question) {
  const container = document.getElementById('options-container');
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  
  question.options.forEach((option, index) => {
    const optionCard = document.createElement('div');
    optionCard.className = 'option-card p-4 rounded-lg flex items-start gap-3';
    optionCard.setAttribute('data-index', index);
    
    optionCard.innerHTML = `
      <div class="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-gray-500">${String.fromCharCode(65 + index)}</div>
      <div class="flex-grow text-gray-700">${option}</div>
    `;
    
    optionCard.addEventListener('click', () => selectOption(index));
    fragment.appendChild(optionCard);
  });
  container.appendChild(fragment);
}

function selectOption(index) {
  document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
  const selectedCard = document.querySelector(`[data-index="${index}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
    appState.selectedAnswer = index;
    document.getElementById('btn-submit').disabled = false;
  }
}

function submitAnswer() {
  if (appState.selectedAnswer === null) return;
  
  const question = appState.questions[appState.currentQuestionIndex];
  const isCorrect = appState.selectedAnswer === question.correct;
  
  appState.answers.push({
    questionId: question.id,
    domain: question.domain,
    question: question.question,
    selectedAnswer: appState.selectedAnswer,
    correctAnswer: question.correct,
    isCorrect: isCorrect,
    explanation: question.explanation
  });
  
  if (isCorrect) appState.score++;
  if (!appState.domainScores[question.domain]) appState.domainScores[question.domain] = { total: 0, correct: 0 };
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
  const isLast = appState.currentQuestionIndex === appState.questions.length - 1;
  if (isLast) document.getElementById('btn-finish').classList.remove('hidden');
  else document.getElementById('btn-next').classList.remove('hidden');
  
  updateScoreDisplay();
  updateRadarChart();
  updateDynamicInsight();
}

/**
 * Próxima questão com animação de transição UX
 */
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
// 6. PERSISTÊNCIA E LÓGICA DE ERROS
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
    timeSpent: CONFIG.QUIZ_DURATION - appState.timeRemaining,
    quizMode: appState.quizMode,
    flaggedQuestions: appState.flaggedQuestions
  };
  
  try {
    localStorage.setItem(`${CONFIG.STORAGE_KEY_PREFIX}last_${certId}`, JSON.stringify(result));
    
    // Atualiza base de questões erradas
    updateMistakesDatabase(certId, result.answers);
    
    const history = getQuizHistory();
    history.push(result);
    if (history.length > 10) history.shift();
    localStorage.setItem(`${CONFIG.STORAGE_KEY_PREFIX}history`, JSON.stringify(history));
  } catch (error) {
    console.error('Erro ao salvar:', error);
  }
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
// 7. RELATÓRIOS E UI (CHART, THEME, UTILS)
// ============================================================================

function generatePerformanceReport() {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return alert('Ative pop-ups.');
  
  const total = appState.questions.length;
  const pct = (appState.score / total) * 100;
  
  // Lógica simplificada para exemplo, use seu template HTML completo aqui
  const reportHTML = `<html><body style="font-family: sans-serif;">
    <h1>Relatório: ${appState.currentCertification.name}</h1>
    <p>Pontuação: ${pct.toFixed(0)}% (${appState.score}/${total})</p>
    <button onclick="window.print()">Imprimir PDF</button>
  </body></html>`;
  
  printWindow.document.write(reportHTML);
  printWindow.document.close();
}

// Funções originais mantidas
function initializeRadarChart() { /* ... implementação Chart.js ... */ }
function updateRadarChart() { /* ... atualização Chart.js ... */ }
function initTheme() { /* ... lógica Dark Mode ... */ }
function toggleDarkMode() { /* ... alternância Dark Mode ... */ }
function resetAppState() {
  if (appState.timerInterval) clearInterval(appState.timerInterval);
  appState = {
    currentCertification: null, questions: [], currentQuestionIndex: 0,
    selectedAnswer: null, answers: [], score: 0, domainScores: {},
    timerInterval: null, timeRemaining: CONFIG.QUIZ_DURATION,
    quizMode: 'exam', flaggedQuestions: []
  };
}

// Utilitários
function shuffleArray(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function getDomainName(id) { return certificationPaths['clf-c02'].domains.find(d => d.id === id)?.name || id; }
function updateScoreDisplay() { document.getElementById('score-display').textContent = `${appState.score} / ${appState.answers.length}`; }