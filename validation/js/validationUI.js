// js/validation/validationUI.js
import { ValidationStorage } from './validationStorage.js';
import { ValidationAPI } from './validationAPI.js';

class ValidationUI {
    constructor() {
        this.currentPendingCount = 0;
        this.selectedQuestionId = null; // Usado para modal de rejeição
        this.initElements();
        this.bindEvents();
        this.checkAuth();
        this.loadDashboardStats();
    }

    initElements() {
        this.elements = {
            validatorNameInput: document.getElementById('validator-name'),
            btnSaveValidator: document.getElementById('btn-save-validator'),
            statusText: document.getElementById('validator-status'),
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
        this.elements.btnCancelReject.addEventListener('click', () => this.closeRejectModal());
        this.elements.btnConfirmReject.addEventListener('click', () => this.confirmRejection());
    }

    // --- AUTENTICAÇÃO E NOME ---
    checkAuth() {
        const name = ValidationStorage.getValidatorName();
        if (name) {
            this.elements.validatorNameInput.value = name;
            this.updateValidatorStatus(name);
            this.loadQuestions(); // Só carrega se tiver nome
        } else {
            this.elements.questionsList.innerHTML = "<p class='loading-msg'>⚠️ Por favor, identifique-se acima para visualizar as questões.</p>";
        }
    }

    saveValidatorName() {
        const name = this.elements.validatorNameInput.value.trim();
        if (name.length < 3) {
            alert("Por favor, insira um nome válido.");
            return;
        }
        ValidationStorage.setValidatorName(name);
        this.updateValidatorStatus(name);
        this.loadQuestions(); // Carrega as questões após identificação
    }

    updateValidatorStatus(name) {
        this.elements.statusText.innerText = `✅ Validador ativo: ${name}`;
        this.elements.statusText.style.color = 'green';
    }

    hasValidator() {
        return !!ValidationStorage.getValidatorName();
    }

    // --- DASHBOARD E STATS ---
    loadDashboardStats() {
        const stats = ValidationStorage.getTodayStats();
        this.elements.statApproved.innerText = stats.approved;
        this.elements.statRejected.innerText = stats.rejected;
    }

    updatePendingCount(count) {
        this.currentPendingCount = count;
        this.elements.statPending.innerText = count;
    }

    // --- RENDERIZAÇÃO DAS QUESTÕES ---
    async loadQuestions() {
        this.elements.questionsList.innerHTML = "<p class='loading-msg'>Carregando questões...</p>";
        try {
            const response = await ValidationAPI.fetchPendingQuestions();
            if (response.success) {
                this.renderQuestions(response.data);
                this.updatePendingCount(response.data.length);
            }
        } catch (error) {
            this.elements.questionsList.innerHTML = "<p class='loading-msg'>❌ Erro ao carregar questões.</p>";
        }
    }

    renderQuestions(questions) {
        if (questions.length === 0) {
            this.elements.questionsList.innerHTML = "<p class='loading-msg'>🎉 Tudo limpo! Nenhuma questão pendente.</p>";
            return;
        }

        this.elements.questionsList.innerHTML = '';
        questions.forEach(q => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.id = `card-${q.id}`;
            
            // Renderiza opções
            let optionsHTML = '';
            for (const [key, value] of Object.entries(q.options)) {
                const isCorrect = key === q.correctAnswer;
                optionsHTML += `<li class="${isCorrect ? 'correct' : ''}">${key}) ${value} ${isCorrect ? '✓' : ''}</li>`;
            }

            card.innerHTML = `
                <div class="question-header">
                    <span class="badge-domain">${q.domain}</span>
                    <small>ID: ${q.id}</small>
                </div>
                <p><strong>${q.text}</strong></p>
                <ul class="options-list">${optionsHTML}</ul>
                <div class="explanation-box">📘 <strong>Explicação:</strong> ${q.explanation}</div>
                <div class="card-actions">
                    <button class="btn-reject" onclick="window.validationApp.openRejectModal('${q.id}')">❌ Reprovar</button>
                    <button class="btn-edit" onclick="alert('Funcionalidade de edição em breve!')">✏️ Editar</button>
                    <button class="btn-approve" onclick="window.validationApp.approveQuestion('${q.id}')">✅ Aprovar</button>
                </div>
            `;
            this.elements.questionsList.appendChild(card);
        });
    }

    // --- AÇÕES: APROVAR / REPROVAR ---
    async approveQuestion(id) {
        if (!this.hasValidator()) {
            alert("Identifique-se primeiro!"); return;
        }

        const button = document.querySelector(`#card-${id} .btn-approve`);
        button.disabled = true;
        button.innerText = "Processando...";

        const payload = {
            status: "approved",
            validated_by: ValidationStorage.getValidatorName(),
            timestamp: new Date().toISOString()
        };

        try {
            const res = await ValidationAPI.validateQuestion(id, payload);
            if (res.success) {
                this.removeCard(id);
                ValidationStorage.incrementApproved();
                this.loadDashboardStats();
                this.updatePendingCount(this.currentPendingCount - 1);
            }
        } catch (err) {
            alert("Erro ao validar questão.");
            button.disabled = false;
            button.innerText = "✅ Aprovar";
        }
    }

    openRejectModal(id) {
        if (!this.hasValidator()) {
            alert("Identifique-se primeiro!"); return;
        }
        this.selectedQuestionId = id;
        this.elements.rejectionReason.value = '';
        this.elements.modalReject.classList.remove('hidden');
    }

    closeRejectModal() {
        this.selectedQuestionId = null;
        this.elements.modalReject.classList.add('hidden');
    }

    async confirmRejection() {
        const reason = this.elements.rejectionReason.value.trim();
        if (reason.length < 10) {
            alert("Por favor, forneça um motivo detalhado (mínimo 10 caracteres).");
            return;
        }

        const id = this.selectedQuestionId;
        const btn = this.elements.btnConfirmReject;
        btn.disabled = true;

        const payload = {
            status: "rejected",
            rejection_reason: reason,
            validated_by: ValidationStorage.getValidatorName(),
            timestamp: new Date().toISOString()
        };

        try {
            const res = await ValidationAPI.validateQuestion(id, payload);
            if (res.success) {
                this.closeRejectModal();
                this.removeCard(id);
                ValidationStorage.incrementRejected();
                this.loadDashboardStats();
                this.updatePendingCount(this.currentPendingCount - 1);
            }
        } catch (err) {
            alert("Erro ao rejeitar questão.");
        } finally {
            btn.disabled = false;
        }
    }

    removeCard(id) {
        const card = document.getElementById(`card-${id}`);
        if (card) {
            // Pequena animação antes de remover
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
        }
    }
}

// Inicializa a UI e expõe globalmente para os botões inline conseguirem chamar os métodos
window.validationApp = new ValidationUI();