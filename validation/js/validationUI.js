// js/validation/validationUI.js
const { ValidationStorage, ValidationAPI } = window;

class ValidationUI {
    constructor() {
        this.currentPendingCount = 0;
        this.selectedQuestionId = null;
        this.initElements();
        this.bindEvents();
        this.loadDashboardStats();
        this.checkAuth();
    }

    initElements() {
        this.elements = {
            validatorNameInput: document.getElementById('validator-name'),
            btnSaveValidator: document.getElementById('btn-save-validator'),
            statusText: document.getElementById('validator-status'),
            screenMessage: document.getElementById('screen-message'),
            questionsList: document.getElementById('questions-list'),
            statPending: document.getElementById('stat-pending'),
            statApproved: document.getElementById('stat-approved'),
            statRejected: document.getElementById('stat-rejected'),
            modalReject: document.getElementById('modal-reject'),
            rejectionReason: document.getElementById('rejection-reason'),
            btnConfirmReject: document.getElementById('btn-confirm-reject'),
            btnCancelReject: document.getElementById('btn-cancel-reject')
        };
    }

    bindEvents() {
        this.elements.btnSaveValidator.addEventListener('click', () => this.saveValidatorName());
        this.elements.validatorNameInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                this.saveValidatorName();
            }
        });
        this.elements.questionsList.addEventListener('click', event => this.handleQuestionAction(event));
        this.elements.btnCancelReject.addEventListener('click', () => this.closeRejectModal());
        this.elements.btnConfirmReject.addEventListener('click', () => this.confirmRejection());
    }

    checkAuth() {
        const name = ValidationStorage.getValidatorName();
        if (!name) {
            this.updatePendingCount(0);
            this.showMessage('Informe seu nome para carregar as questões pendentes.', 'info');
            this.elements.questionsList.innerHTML = '<p class="loading-msg">Identifique-se acima para visualizar as questões.</p>';
            return;
        }

        this.elements.validatorNameInput.value = name;
        this.updateValidatorStatus(name);
        this.showMessage('Validador identificado. Dados mock locais carregados sem chamada ao backend.', 'info');
        this.loadQuestions();
    }

    saveValidatorName() {
        const name = this.elements.validatorNameInput.value.trim();
        if (name.length < 3) {
            this.showMessage('Informe um nome de validador com pelo menos 3 caracteres.', 'error');
            return;
        }

        ValidationStorage.setValidatorName(name);
        this.updateValidatorStatus(name);
        this.showMessage('Nome do validador salvo localmente.', 'success');
        this.loadQuestions();
    }

    updateValidatorStatus(name) {
        this.elements.statusText.innerText = `Validador ativo: ${name}`;
        this.elements.statusText.style.color = '#22c55e';
    }

    hasValidator() {
        return Boolean(ValidationStorage.getValidatorName());
    }

    showMessage(message, type = 'info') {
        this.elements.screenMessage.textContent = message;
        this.elements.screenMessage.className = `screen-message ${type}`;
    }

    loadDashboardStats() {
        const stats = ValidationStorage.getTodayStats();
        this.elements.statApproved.innerText = stats.approved;
        this.elements.statRejected.innerText = stats.rejected;
    }

    updatePendingCount(count) {
        this.currentPendingCount = Math.max(0, count);
        this.elements.statPending.innerText = this.currentPendingCount;
    }

    async loadQuestions() {
        this.elements.questionsList.innerHTML = '<p class="loading-msg">Carregando questões mock...</p>';

        try {
            const response = await ValidationAPI.fetchPendingQuestions();
            if (!response.success) {
                throw new Error('Resposta inválida da API de validação.');
            }

            this.renderQuestions(response.data);
            this.updatePendingCount(response.data.length);
            this.showMessage('Questões pendentes carregadas.', 'success');
        } catch (error) {
            this.updatePendingCount(0);
            this.elements.questionsList.innerHTML = '<p class="loading-msg">Erro ao carregar questões pendentes.</p>';
            this.showMessage(error.message || 'Erro ao carregar questões pendentes.', 'error');
        }
    }

    renderQuestions(questions) {
        if (questions.length === 0) {
            this.elements.questionsList.innerHTML = '<p class="loading-msg">Tudo limpo! Nenhuma questão pendente.</p>';
            return;
        }

        this.elements.questionsList.innerHTML = '';
        questions.forEach(question => {
            const card = document.createElement('article');
            card.className = 'question-card';
            card.id = `card-${question.id}`;
            card.innerHTML = this.buildQuestionCardHTML(question);
            this.elements.questionsList.appendChild(card);
        });
    }

    buildQuestionCardHTML(question) {
        const certification = this.escapeHTML(question.certification || 'N/A');
        const domain = this.escapeHTML(question.domain || 'Sem domínio');
        const difficulty = this.escapeHTML(question.difficulty || 'N/A');
        const status = this.escapeHTML(question.validation_status || question.status || 'pending');
        const questionText = this.escapeHTML(question.question_text || question.text || '');
        const explanation = this.escapeHTML(question.explanation || 'Sem explicação cadastrada.');
        const correctAnswers = this.getCorrectAnswers(question);
        const optionsHTML = this.buildOptionsHTML(question.options, correctAnswers);

        return `
            <div class="question-header">
                <div class="question-meta">
                    <span class="badge-domain">${domain}</span>
                    <span>${certification}</span>
                    <span>${difficulty}</span>
                    <span class="status-pill ${status}">${status}</span>
                </div>
                <small>ID: ${this.escapeHTML(question.id)}</small>
            </div>
            <p><strong>${questionText}</strong></p>
            <ul class="options-list">${optionsHTML}</ul>
            <div class="explanation-box">
                <strong>Resposta correta:</strong> ${this.escapeHTML(correctAnswers.join(', ') || 'N/A')}<br>
                <strong>Explicação:</strong> ${explanation}
            </div>
            <div class="card-actions">
                <button type="button" class="btn-reject" data-action="reject" data-id="${this.escapeHTML(question.id)}">Reprovar</button>
                <button type="button" class="btn-edit" disabled title="Edição real depende da API oficial">Editar em breve</button>
                <button type="button" class="btn-approve" data-action="approve" data-id="${this.escapeHTML(question.id)}">Aprovar</button>
            </div>
        `;
    }

    buildOptionsHTML(options, correctAnswers) {
        const normalizedOptions = Array.isArray(options)
            ? options
            : Object.entries(options || {}).map(([id, text]) => ({ id, text }));

        return normalizedOptions.map(option => {
            const id = String(option.id);
            const isCorrect = correctAnswers.includes(id);
            const className = isCorrect ? ' class="correct"' : '';
            return `
                <li${className}>
                    <span class="answer-label">${this.escapeHTML(id)})</span>
                    ${this.escapeHTML(option.text)}
                    ${isCorrect ? ' ✓' : ''}
                </li>
            `;
        }).join('');
    }

    getCorrectAnswers(question) {
        const rawAnswer = question.correct_answer || question.correctAnswer || [];
        return Array.isArray(rawAnswer) ? rawAnswer.map(String) : [String(rawAnswer)];
    }

    handleQuestionAction(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }

        const { action, id } = button.dataset;
        if (action === 'approve') {
            this.approveQuestion(id);
        }

        if (action === 'reject') {
            this.openRejectModal(id);
        }
    }

    async approveQuestion(id) {
        if (!this.ensureValidatorName()) {
            return;
        }

        const button = document.querySelector(`#card-${id} .btn-approve`);
        this.setButtonLoading(button, 'Processando...');

        const payload = {
            status: 'approved',
            validated_by: ValidationStorage.getValidatorName(),
            validated_at: new Date().toISOString()
        };

        try {
            const response = await ValidationAPI.validateQuestion(id, payload);
            if (!response.success) {
                throw new Error('Aprovação não confirmada.');
            }

            this.finishQuestion(id);
            ValidationStorage.incrementApproved();
            this.loadDashboardStats();
            this.showMessage('Questão aprovada e salva no banco.', 'success');
        } catch (error) {
            this.showMessage(error.message || 'Erro ao aprovar questão.', 'error');
            this.restoreButton(button, 'Aprovar');
        }
    }

    openRejectModal(id) {
        if (!this.ensureValidatorName()) {
            return;
        }

        this.selectedQuestionId = id;
        this.elements.rejectionReason.value = '';
        this.elements.modalReject.classList.remove('hidden');
        this.elements.rejectionReason.focus();
    }

    closeRejectModal() {
        this.selectedQuestionId = null;
        this.elements.modalReject.classList.add('hidden');
    }

    async confirmRejection() {
        const reason = this.elements.rejectionReason.value.trim();
        if (reason.length < 10) {
            this.showMessage('Informe um motivo de reprovação com pelo menos 10 caracteres.', 'error');
            return;
        }

        const id = this.selectedQuestionId;
        if (!id) {
            this.showMessage('Nenhuma questão selecionada para reprovação.', 'error');
            return;
        }

        const payload = {
            status: 'rejected',
            feedback: reason,
            rejection_reason: reason,
            validated_by: ValidationStorage.getValidatorName(),
            validated_at: new Date().toISOString()
        };

        this.setButtonLoading(this.elements.btnConfirmReject, 'Processando...');

        try {
            const response = await ValidationAPI.validateQuestion(id, payload);
            if (!response.success) {
                throw new Error('Reprovação não confirmada.');
            }

            this.closeRejectModal();
            this.finishQuestion(id);
            ValidationStorage.incrementRejected();
            this.loadDashboardStats();
            this.showMessage('Questão reprovada e salva no banco.', 'success');
        } catch (error) {
            this.showMessage(error.message || 'Erro ao reprovar questão.', 'error');
        } finally {
            this.restoreButton(this.elements.btnConfirmReject, 'Confirmar Reprovação');
        }
    }

    finishQuestion(id) {
        this.removeCard(id);
        this.updatePendingCount(this.currentPendingCount - 1);

        if (this.currentPendingCount === 0) {
            setTimeout(() => {
                this.elements.questionsList.innerHTML = '<p class="loading-msg">Tudo limpo! Nenhuma questão pendente.</p>';
            }, 320);
        }
    }

    removeCard(id) {
        const card = document.getElementById(`card-${id}`);
        if (!card) {
            return;
        }

        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
        setTimeout(() => card.remove(), 300);
    }

    ensureValidatorName() {
        if (this.hasValidator()) {
            return true;
        }

        this.showMessage('Identifique-se antes de aprovar ou reprovar questões.', 'error');
        this.elements.validatorNameInput.focus();
        return false;
    }

    setButtonLoading(button, label) {
        if (!button) {
            return;
        }

        button.disabled = true;
        button.dataset.originalText = button.innerText;
        button.innerText = label;
    }

    restoreButton(button, fallbackText) {
        if (!button) {
            return;
        }

        button.disabled = false;
        button.innerText = button.dataset.originalText || fallbackText;
        delete button.dataset.originalText;
    }

    escapeHTML(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
}

// Exposto apenas para inspeção manual da tela interna durante a Task de validação.
window.validationApp = new ValidationUI();
