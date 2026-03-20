/**
 * APP.JS - Lógica Principal da Aplicação
 * Gerencia o fluxo completo do simulador com análise de dados avançada e gamificação.
 */

// ============================================================================
// 1. ESTADO GLOBAL E CONFIGURAÇÃO
// ============================================================================

let appState = {
  currentCertification: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  answers: [],
  score: 0,
  domainScores: {},
  serviceScores: {}, // Rastreio analítico por Serviço AWS (Ex: S3, EC2)
  tagScores: {},     // Rastreio analítico por Conceitos Técnicos (Ex: Criptografia)
  timerInterval: null,
  timeRemaining: 15 * 60,
  quizMode: 'exam',
  flaggedQuestions: [],
  isPaused: false
};

const CONFIG = {
  QUIZ_DURATION: 15 * 60,
  QUESTIONS_PER_QUIZ: 10,
  PASSING_SCORE: 70,
  STORAGE_KEY_PREFIX: 'aws_sim_'
};

// ============================================================================
// 2. INICIALIZAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initializeRadarChart();
  loadLastScore();
  updateHistoryDisplay();
  checkMistakes();
  renderGamification();
  
  const certSelect = document.getElementById('certification-select');
  if (certSelect) {
    certSelect.addEventListener('change', () => {
      loadLastScore();
      checkMistakes();
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
// 4. LÓGICA DO QUIZ
// ============================================================================

async function startQuiz() {
  const certSelect = document.getElementById('certification-select');
  const quantitySelect = document.getElementById('question-quantity');
  const difficultySelect = document.getElementById('difficulty-level');
  const quizMode = document.getElementById('mode-study')?.checked ? 'study' : 'exam';

  const selectedCertId = certSelect ? certSelect.value : 'clf-c02';
  const quantity = quantitySelect ? parseInt(quantitySelect.value) : CONFIG.QUESTIONS_PER_QUIZ;

  const startBtn = document.getElementById('btn-start-quiz');
  
  try {
    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>A carregar...';

    const response = await fetch(`data/${selectedCertId}.json`);
    if (!response.ok) throw new Error('Falha ao carregar banco de dados.');
    let questionsData = await response.json();

    const difficulty = difficultySelect ? difficultySelect.value : 'all';
    if (difficulty !== 'all') {
      questionsData = questionsData.filter(q => q.difficulty === difficulty);
    }

    if (questionsData.length === 0) {
      alert('Nenhuma questão encontrada com estes filtros.');
      return;
    }

    appState.questions = shuffleArray(questionsData)
      .slice(0, Math.min(quantity, questionsData.length))
      .map(q => shuffleQuestionOptions(q));
      
    appState.currentCertification = certificationPaths[selectedCertId];
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.answers = [];
    appState.serviceScores = {}; 
    appState.tagScores = {};
    appState.quizMode = quizMode;
    appState.isPaused = false;
    
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
    console.error('Erro:', error);
  } finally {
    startBtn.disabled = false;
    startBtn.innerHTML = 'Iniciar Simulação <i class="fa-solid fa-arrow-right ml-2"></i>';
  }
}

function loadQuestion() {
  const question = appState.questions[appState.currentQuestionIndex];
  if (!question) return;
  
  document.getElementById('options-container').style.display = 'flex';
  document.getElementById('question-category').textContent = getDomainName(question.domain);
  document.getElementById('question-text').textContent = question.question;
  document.getElementById('current-q-num').textContent = appState.currentQuestionIndex + 1;
  document.getElementById('total-q-num').textContent = appState.questions.length;
  
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) progressBar.style.width = `${((appState.currentQuestionIndex + 1) / appState.questions.length) * 100}%`;
  
  renderOptions(question);
  updateFlagUI();
  
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
  
  question.options.forEach((option, index) => {
    const card = document.createElement('div');
    card.className = 'option-card p-4 rounded-lg flex items-start gap-3';
    card.setAttribute('data-index', index);
    card.innerHTML = `
      <div class="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-gray-500">${String.fromCharCode(65 + index)}</div>
      <div class="flex-grow text-gray-700 dark:text-gray-200">${option}</div>
    `;
    card.onclick = () => selectOption(index);
    container.appendChild(card);
  });
}

function selectOption(index) {
  if (appState.isPaused) return;
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
  
  appState.answers.push({ 
    questionId: question.id, domain: question.domain, isCorrect: isCorrect,
    question: question.question, selectedAnswer: appState.selectedAnswer,
    correctAnswer: question.correct, explanation: question.explanation
  });
  
  if (isCorrect) appState.score++;
  
  // 1. Rastreio por Domínio
  if (!appState.domainScores[question.domain]) appState.domainScores[question.domain] = { total: 0, correct: 0 };
  appState.domainScores[question.domain].total++;
  if (isCorrect) appState.domainScores[question.domain].correct++;

  // 2. Rastreio por Serviço (Proteção contra campos inexistentes)
  if (question.service) {
    if (!appState.serviceScores[question.service]) appState.serviceScores[question.service] = { total: 0, correct: 0 };
    appState.serviceScores[question.service].total++;
    if (isCorrect) appState.serviceScores[question.service].correct++;
  }

  // 3. Rastreio por Tags (Proteção contra campos inexistentes)
  if (question.tags && Array.isArray(question.tags)) {
    question.tags.forEach(tag => {
      if (!appState.tagScores[tag]) appState.tagScores[tag] = { total: 0, correct: 0 };
      appState.tagScores[tag].total++;
      if (isCorrect) appState.tagScores[tag].correct++;
    });
  }
  
  document.querySelectorAll('.option-card').forEach((card, idx) => {
    card.classList.add('disabled');
    if (idx === question.correct) card.classList.add('correct');
    else if (idx === appState.selectedAnswer && !isCorrect) card.classList.add('incorrect');
  });
  
  // CONFIGURAÇÃO DA CAIXA DE EXPLICAÇÃO DINÂMICA
  const expBox = document.getElementById('explanation-box');
  const expTitle = expBox.querySelector('h4');
  const expText = document.getElementById('explanation-text');

  if (isCorrect) {
    expBox.className = "mt-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300";
    expTitle.innerHTML = '<i class="fa-solid fa-check-circle"></i> Resposta Correta!';
    expTitle.className = "font-bold text-green-800 dark:text-green-300 mb-1 flex items-center gap-2";
  } else {
    expBox.className = "mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300";
    expTitle.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Resposta Incorreta';
    expTitle.className = "font-bold text-red-800 dark:text-red-300 mb-1 flex items-center gap-2";
  }

  expText.textContent = question.explanation;
  expBox.classList.remove('hidden');
  document.getElementById('btn-submit').classList.add('hidden');
  
  if (appState.currentQuestionIndex === appState.questions.length - 1) {
    document.getElementById('btn-finish').classList.remove('hidden');
  } else {
    document.getElementById('btn-next').classList.remove('hidden');
  }
  updateScoreDisplay();
  updateRadarChart();
}

// ============================================================================
// 5. TEMPORIZADOR E PAUSA
// ============================================================================

function startTimer() {
  let timerDisplay = document.getElementById('timer-display');
  if (!timerDisplay) {
    const scoreDisplay = document.getElementById('score-display');
    timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.className = 'bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 transition-colors';
    scoreDisplay.parentElement.insertBefore(timerDisplay, scoreDisplay);
  }
  
  timerDisplay.innerHTML = `
    <button id="btn-pause-timer" onclick="togglePause()" class="text-white hover:text-yellow-300 transition-colors outline-none mr-1">
      <i id="pause-icon" class="fa-solid fa-pause"></i>
    </button>
    <i class="fa-solid fa-clock text-blue-400"></i>
    <span id="timer-text" class="min-w-[45px] inline-block text-right">15:00</span>
  `;
  
  timerDisplay.classList.remove('hidden');
  appState.isPaused = false;
  appState.timerInterval = setInterval(timerTick, 1000);
}

function timerTick() {
  appState.timeRemaining--;
  const min = Math.floor(appState.timeRemaining / 60);
  const sec = appState.timeRemaining % 60;
  document.getElementById('timer-text').textContent = `${min}:${sec.toString().padStart(2, '0')}`;
  if (appState.timeRemaining <= 0) finishQuiz();
}

function togglePause() {
  if (appState.quizMode !== 'exam' || appState.timeRemaining <= 0) return;
  appState.isPaused = !appState.isPaused;
  const pauseIcon = document.getElementById('pause-icon');
  const qText = document.getElementById('question-text');
  
  if (appState.isPaused) {
    clearInterval(appState.timerInterval);
    pauseIcon.className = 'fa-solid fa-play';
    qText.dataset.original = qText.textContent;
    qText.innerHTML = '<i class="fa-solid fa-mug-hot text-orange-400"></i> Simulado Pausado';
    document.getElementById('options-container').style.display = 'none';
  } else {
    appState.timerInterval = setInterval(timerTick, 1000);
    pauseIcon.className = 'fa-solid fa-pause';
    qText.textContent = qText.dataset.original;
    document.getElementById('options-container').style.display = 'flex';
  }
}

// ============================================================================
// 6. ANALÍTICA E PERSISTÊNCIA
// ============================================================================

function saveQuizResult() {
  const certId = appState.currentCertification.id;
  const result = {
    certificationId: certId,
    date: new Date().toISOString(),
    score: appState.score,
    total: appState.questions.length,
    percentage: (appState.score / appState.questions.length) * 100,
    domainScores: appState.domainScores,
    serviceScores: appState.serviceScores,
    tagScores: appState.tagScores,
    answers: appState.answers
  };
  
  localStorage.setItem(`${CONFIG.STORAGE_KEY_PREFIX}last_${certId}`, JSON.stringify(result));
  updateMistakesDatabase(certId, result.answers);
  updateGamification(result);
  
  const history = getQuizHistory();
  history.push(result);
  if (history.length > 20) history.shift();
  localStorage.setItem(`${CONFIG.STORAGE_KEY_PREFIX}history`, JSON.stringify(history));
}

function updateRadarChart() {
  if (!window.radarChartInstance || !appState.currentCertification) return;
  const history = getQuizHistory().filter(h => h.certificationId === appState.currentCertification.id);
  
  if (history.length > 0) {
    const cumulative = {};
    appState.currentCertification.domains.forEach(d => cumulative[d.id] = { t: 0, c: 0 });
    history.forEach(res => {
      Object.entries(res.domainScores).forEach(([id, s]) => {
        if (cumulative[id]) { cumulative[id].t += s.total; cumulative[id].c += s.correct; }
      });
    });
    const data = appState.currentCertification.domains.map(d => {
      const s = cumulative[d.id];
      return s.t > 0 ? (s.c / s.t) * 100 : 0;
    });
    window.radarChartInstance.data.datasets[0].data = data;
    window.radarChartInstance.data.datasets[0].label = 'Perfil de Conhecimento (%)';
  } else {
    const data = appState.currentCertification.domains.map(d => {
      const s = appState.domainScores[d.id];
      return s && s.total > 0 ? (s.correct / s.total) * 100 : 0;
    });
    window.radarChartInstance.data.datasets[0].data = data;
  }
  window.radarChartInstance.update();
}

function showResultsScreen() {
  const total = appState.questions.length;
  const pct = (appState.score / total) * 100;
  document.getElementById('final-score-percent').textContent = `${pct.toFixed(0)}%`;
  document.getElementById('final-correct').textContent = appState.score;
  document.getElementById('final-incorrect').textContent = total - appState.score;
  
  const weakDomains = [];
  Object.entries(appState.domainScores).forEach(([id, score]) => {
    const dPct = score.total > 0 ? (score.correct / score.total) * 100 : 0;
    if (dPct < 70 && score.total > 0) weakDomains.push(getDomainName(id));
  });

  const rec = document.getElementById('recommendation-text');
  if (weakDomains.length > 0) {
    rec.innerHTML = `
      <div class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded text-left shadow-sm">
        <p class="font-bold text-red-700 dark:text-red-400 mb-1 text-base">Onde melhorar (Domínios):</p>
        <p class="text-sm">Foque nos conceitos de: <strong>${weakDomains.join(', ')}</strong>.</p>
      </div>
    `;
  } else {
    rec.textContent = "🎉 Desempenho excelente em todos os domínios!";
  }
  showScreen('results');
}

// ============================================================================
// 7. UTILITÁRIOS E GAMIFICAÇÃO
// ============================================================================

function resetAppState() {
  if (appState.timerInterval) clearInterval(appState.timerInterval);
  appState = {
    currentCertification: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    domainScores: {},
    serviceScores: {},
    tagScores: {},
    timerInterval: null,
    timeRemaining: CONFIG.QUIZ_DURATION,
    isPaused: false
  };
}

function shuffleArray(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function shuffleQuestionOptions(question) {
  let opts = question.options.map((text, i) => ({ 
    text: text.replace(/^[a-eA-E][\.\)\-]\s*/, ''), 
    isCorrect: i === question.correct 
  }));
  opts = shuffleArray(opts);
  return { ...question, options: opts.map(o => o.text), correct: opts.findIndex(o => o.isCorrect) };
}

function getDomainName(id) { return appState.currentCertification?.domains.find(d => d.id === id)?.name || id; }

function updateScoreDisplay() { 
  const disp = document.getElementById('score-display');
  if(disp) disp.textContent = `${appState.score} / ${appState.answers.length}`; 
}

function getQuizHistory() { return JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_KEY_PREFIX}history`) || "[]"); }

function initTheme() { if (localStorage.getItem('aws_sim_theme') === 'dark') document.documentElement.classList.add('dark'); }

function nextQuestion() { appState.currentQuestionIndex++; loadQuestion(); }

function finishQuiz() { stopTimer(); saveQuizResult(); updateHistoryDisplay(); showResultsScreen(); }

function stopTimer() { if (appState.timerInterval) clearInterval(appState.timerInterval); document.getElementById('timer-display')?.classList.add('hidden'); }

function updateFlagUI() { 
  const btn = document.getElementById('btn-flag'); 
  if (btn) btn.style.color = appState.flaggedQuestions?.includes(appState.currentQuestionIndex) ? '#f97316' : '#9ca3af'; 
}

function checkMistakes() {
  const certId = document.getElementById('certification-select')?.value;
  if (!certId) return;
  const mistakes = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_KEY_PREFIX}mistakes_${certId}`) || "[]");
  const btn = document.getElementById('btn-practice-mistakes');
  const count = document.getElementById('mistakes-count');
  if (mistakes.length > 0 && btn) { btn.classList.remove('hidden'); count.textContent = mistakes.length; }
  else if (btn) btn.classList.add('hidden');
}

function updateHistoryDisplay() {
  const historyList = document.getElementById('history-list');
  if (!historyList) return;
  const history = getQuizHistory();
  if (history.length === 0) { historyList.innerHTML = '<p class="text-sm text-gray-500 italic">Nenhum simulado realizado ainda.</p>'; return; }
  historyList.innerHTML = history.slice(-5).reverse().map(result => {
    const date = new Date(result.date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
    const passed = result.percentage >= CONFIG.PASSING_SCORE;
    return `<div class="aws-card p-2 mb-2 flex justify-between items-center shadow-sm border border-gray-100 dark:border-slate-700 transition-all"><div class="flex items-center gap-2"><i class="fa-solid ${passed ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'}"></i><span class="text-xs text-gray-500">${date}</span></div><span class="font-bold text-gray-700 dark:text-gray-200">${result.percentage.toFixed(0)}%</span></div>`;
  }).join('');
}

function initializeRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;
  window.radarChartInstance = new Chart(ctx, { type: 'radar', data: { labels: ['Conceitos', 'Segurança', 'Tecnologia', 'Faturamento'], datasets: [{ label: 'Desempenho (%)', data: [0, 0, 0, 0], backgroundColor: 'rgba(255, 153, 0, 0.2)', borderColor: 'rgba(255, 153, 0, 1)', borderWidth: 2 }] }, options: { scales: { r: { beginAtZero: true, max: 100 } } } });
}

function reinitializeRadarChart() { if (!window.radarChartInstance || !appState.currentCertification) return; const labels = appState.currentCertification.domains.map(d => d.name); window.radarChartInstance.data.labels = labels; window.radarChartInstance.data.datasets[0].data = labels.map(() => 0); window.radarChartInstance.update(); }

function loadLastScore() {
  const selectedCertId = document.getElementById('certification-select')?.value || 'clf-c02';
  const data = localStorage.getItem(`${CONFIG.STORAGE_KEY_PREFIX}last_${selectedCertId}`);
  if (data && document.getElementById('last-score-banner')) {
    const res = JSON.parse(data);
    document.getElementById('last-score-banner').innerHTML = `<i class="fa-solid fa-history mr-2 text-blue-400"></i> Última pontuação: <strong>${res.percentage.toFixed(0)}%</strong> - ${new Date(res.date).toLocaleDateString()}`;
    document.getElementById('last-score-banner').classList.remove('hidden');
  }
}

function renderGamification() {
  const gami = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_KEY_PREFIX}gamification`) || '{"streak":0,"badges":[]}');
  const streakEl = document.getElementById('streak-counter');
  if (streakEl) streakEl.textContent = gami.streak;
  const container = document.getElementById('badges-container');
  if (container && gami.badges.length > 0) {
    const colors = { blue: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700', yellow: 'bg-yellow-100 text-yellow-700', orange: 'bg-orange-100 text-orange-700', green: 'bg-green-100 text-green-700' };
    container.innerHTML = gami.badges.map(b => `<div class="${colors[b.color]} px-2 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1 transition-transform hover:scale-105"><i class="fa-solid ${b.icon}"></i>${b.name}</div>`).join('');
  }
}

function updateGamification(result) {
  let gami = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_KEY_PREFIX}gamification`) || '{"lastDate":null,"streak":0,"todayCount":0,"badges":[]}');
  const today = new Date().toISOString().split('T')[0]; 
  let newBadges = [];
  if (gami.lastDate === today) gami.todayCount++;
  else {
    if (gami.lastDate) {
      const diff = Math.ceil(Math.abs(new Date(today) - new Date(gami.lastDate)) / (1000 * 60 * 60 * 24));
      gami.streak = (diff === 1) ? gami.streak + 1 : 1;
    } else gami.streak = 1;
    gami.todayCount = 1;
    gami.lastDate = today;
  }
  const addBadge = (id, name, icon, color) => {
    if (!gami.badges.find(b => b.id === id)) { gami.badges.push({ id, name, icon, color }); newBadges.push(name); }
  };
  addBadge('first_step', 'Primeiro Passo', 'fa-shoe-prints', 'blue');
  if (gami.todayCount >= 3) addBadge('marathon', 'Maratonista', 'fa-person-running', 'purple');
  if (result.percentage === 100) addBadge('perfect', 'Gabarito', 'fa-star', 'yellow');
  if (gami.streak >= 3) addBadge('streak_3', 'Em Chamas', 'fa-fire', 'orange');
  localStorage.setItem(`${CONFIG.STORAGE_KEY_PREFIX}gamification`, JSON.stringify(gami));
  renderGamification();
  if (newBadges.length > 0) setTimeout(() => alert(`🏆 Novas Medalhas Desbloqueadas: ${newBadges.join(', ')}`), 1000);
}

function updateDynamicInsight(msg) { const el = document.getElementById('dynamic-insight'); if (el) el.textContent = msg; }