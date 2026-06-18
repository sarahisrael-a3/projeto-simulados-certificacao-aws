// js/validation/validationAPI.js

const API_BASE_URL = window.VALIDATION_API_BASE_URL || 'http://localhost:3001';

window.VALIDATION_API_CONTRACT = {
    pending: {
        method: 'GET',
        path: '/api/questions/pending',
        response: {
            success: true,
            data: [
                {
                    id: 'question-id',
                    certification: 'CLF-C02',
                    domain: 'Cloud Concepts',
                    difficulty: 'easy',
                    question_text: 'Question text',
                    options: [
                        { id: 'A', text: 'First answer' }
                    ],
                    correct_answer: ['A'],
                    explanation: 'Explanation text',
                    validation_status: 'PENDING'
                }
            ]
        }
    },
    validate: {
        method: 'POST',
        path: '/api/questions/:id/validate',
        payload: {
            status: 'APPROVED | REJECTED',
            feedback: 'Optional reviewer feedback',
            rejection_reason: 'Required when status is REJECTED',
            validated_by: 'Validator name',
            validated_at: 'ISO timestamp'
        },
        response: {
            success: true,
            data: {
                id: 'question-id',
                validation_status: 'APPROVED | REJECTED',
                validated_by: 'Validator name',
                validated_at: 'ISO timestamp'
            }
        }
    }
};

async function fetchJSON(path, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        let body = null;
        try {
            body = await response.json();
        } catch {
            body = null;
        }

        if (!response.ok) {
            const message = body?.error || body?.message || `HTTP ${response.status}`;
            const error = new Error(message);
            error.status = response.status;
            error.details = body;
            throw error;
        }

        return body;
    } catch (error) {
        if (error.status) {
            throw error;
        }

        throw new Error(`Falha de comunicacao com a API de validacao: ${error.message}`);
    }
}

function normalizeValidationPayload(payload) {
    const status = String(payload.status || '').toUpperCase();
    const rejectionReason = payload.rejection_reason || payload.feedback || '';

    return {
        status,
        feedback: payload.feedback,
        rejection_reason: status === 'REJECTED' ? rejectionReason : null,
        correctionNeeded: payload.correctionNeeded || payload.correction_needed || false,
        validated_by: payload.validated_by,
        validated_at: payload.validated_at || new Date().toISOString()
    };
}

window.ValidationAPI = {
    isMockMode() {
        return false;
    },

    async fetchPendingQuestions() {
        try {
            return await fetchJSON('/api/questions/pending');
        } catch (error) {
            throw new Error(`Nao foi possivel carregar questoes pendentes: ${error.message}`);
        }
    },

    async validateQuestion(id, payload) {
        return this.submitValidation(id, payload);
    },

    async submitValidation(id, payload) {
        try {
            const normalizedPayload = normalizeValidationPayload(payload);
            return await fetchJSON(`/api/questions/${encodeURIComponent(id)}/validate`, {
                method: 'POST',
                body: JSON.stringify(normalizedPayload)
            });
        } catch (error) {
            throw new Error(`Nao foi possivel enviar a validacao: ${error.message}`);
        }
    }
};
