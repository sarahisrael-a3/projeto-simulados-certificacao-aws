/**
 * timerManager.js - Gerencia timers do exame e das missões
 */

/**
 * Inicia o timer do exame.
 * @param {object} uiState - Estado da UI (timerInterval, timeRemaining, isPaused)
 * @param {Function} onTimeUp - Callback quando o tempo acaba
 */
export function startExamTimer(uiState, onTimeUp) {
  if (uiState.timerInterval) clearInterval(uiState.timerInterval);

  updateExamTimerDisplay(uiState);

  uiState.timerInterval = setInterval(() => {
    if (uiState.isPaused) return;

    uiState.timeRemaining--;
    updateExamTimerDisplay(uiState);

    if (uiState.timeRemaining <= 0) {
      clearInterval(uiState.timerInterval);
      onTimeUp();
    }
  }, 1000);
}

/**
 * Atualiza o display do timer do exame no DOM.
 */
export function updateExamTimerDisplay(uiState) {
  const hours = Math.floor(uiState.timeRemaining / 3600);
  const min = Math.floor((uiState.timeRemaining % 3600) / 60);
  const sec = uiState.timeRemaining % 60;

  const el = document.getElementById("timer-text");
  if (el) {
    if (hours > 0) {
      el.textContent = `${hours}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    } else {
      el.textContent = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    }
  }
}

/**
 * Inicia o timer por questão nas missões (90s por questão).
 * @param {object} uiState - Estado da UI (currentMode, qTimerInterval, qTimeRemaining)
 * @param {Function} onTimeUp - Callback quando o tempo da questão acaba
 */
export function startMissionQuestionTimer(uiState, onTimeUp) {
  if (uiState.currentMode !== "mission") return;

  clearInterval(uiState.qTimerInterval);

  const MISSION_TIME = 90;
  uiState.qTimeRemaining = MISSION_TIME;

  const timeBar = document.getElementById("mission-time-bar");
  const timeText = document.getElementById("mission-time-text");

  if (timeBar) {
    timeBar.classList.add("from-orange-400");
    timeBar.classList.remove("from-red-600");
  }

  uiState.qTimerInterval = setInterval(() => {
    uiState.qTimeRemaining--;

    const pct = (uiState.qTimeRemaining / MISSION_TIME) * 100;

    if (timeBar) {
      timeBar.style.width = `${pct}%`;
      if (pct < 20) {
        timeBar.classList.remove("from-orange-400");
        timeBar.classList.add("from-red-600");
      }
    }

    if (timeText) {
      if (uiState.qTimeRemaining >= 60) {
        const m = Math.floor(uiState.qTimeRemaining / 60);
        const s = uiState.qTimeRemaining % 60;
        timeText.textContent = `${m}m ${s.toString().padStart(2, "0")}s`;
      } else {
        timeText.textContent = `${uiState.qTimeRemaining}s`;
      }
    }

    if (uiState.qTimeRemaining <= 0) {
      clearInterval(uiState.qTimerInterval);
      onTimeUp();
    }
  }, 1000);
}

/**
 * Para todos os timers ativos.
 */
export function clearAllTimers(uiState) {
  clearInterval(uiState.qTimerInterval);
  clearInterval(uiState.timerInterval);
}
