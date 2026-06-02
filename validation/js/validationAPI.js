// js/validation/validationAPI.js

// Mock de dados para iniciar o desenvolvimento
let mockQuestions = [
    {
        id: "q123", domain: "Cloud Concepts",
        text: "O que é uma Região AWS?",
        options: {
            "A": "Um único data center",
            "B": "Uma área geográfica com múltiplas AZs",
            "C": "Uma VPC dentro de uma zona",
            "D": "Um serviço de computação"
        },
        correctAnswer: "B",
        explanation: "Uma Região AWS é uma área geográfica independente que consiste em múltiplas Zonas de Disponibilidade (AZs).",
        status: "pending"
    },
    {
        id: "q124", domain: "Security and Compliance",
        text: "Qual serviço AWS provê proteção contra DDoS?",
        options: {
            "A": "AWS WAF",
            "B": "AWS Shield",
            "C": "Amazon GuardDuty",
            "D": "AWS KMS"
        },
        correctAnswer: "B",
        explanation: "O AWS Shield é um serviço gerenciado de proteção contra DDoS.",
        status: "pending"
    }
];

export const ValidationAPI = {
    async fetchPendingQuestions() {
        // TODO: Substituir por fetch('/api/questions/pending') futuramente
        return new Promise(resolve => {
            setTimeout(() => {
                const pending = mockQuestions.filter(q => q.status === 'pending');
                resolve({ success: true, data: pending });
            }, 500);
        });
    },

    async validateQuestion(id, payload) {
        // TODO: Substituir por chamada real: POST /api/questions/{id}/validate
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const questionIndex = mockQuestions.findIndex(q => q.id === id);
                if (questionIndex > -1) {
                    mockQuestions[questionIndex].status = payload.status;
                    resolve({ success: true, new_status: payload.status });
                } else {
                    reject({ success: false, error: "Questão não encontrada" });
                }
            }, 600);
        });
    }
};