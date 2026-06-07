// js/validation/validationAPI.js

const USE_MOCK_DATA = true;
const MOCK_DELAY_MS = 350;

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
                    validation_status: 'pending'
                }
            ]
        }
    },
    validate: {
        method: 'POST',
        path: '/api/questions/:id/validate',
        payload: {
            status: 'approved | rejected',
            feedback: 'Optional reviewer feedback',
            validated_by: 'Validator name',
            validated_at: 'ISO timestamp'
        },
        response: {
            success: true,
            data: {
                id: 'question-id',
                validation_status: 'approved | rejected',
                validated_by: 'Validator name',
                validated_at: 'ISO timestamp'
            }
        }
    }
};

// Mock local para preparar a UI interna. A integração real depende da Task 3/API.
let mockQuestions = [
    {
        id: 'mock-clf-001',
        certification: 'CLF-C02',
        domain: 'Cloud Concepts',
        difficulty: 'easy',
        question_text: 'O que é uma Região AWS?',
        options: [
            { id: 'A', text: 'Um único data center isolado.' },
            { id: 'B', text: 'Uma área geográfica com múltiplas Zonas de Disponibilidade.' },
            { id: 'C', text: 'Uma VPC dentro de uma zona.' },
            { id: 'D', text: 'Um serviço de computação gerenciado.' }
        ],
        correct_answer: ['B'],
        explanation: 'Uma Região AWS é uma área geográfica independente composta por múltiplas Zonas de Disponibilidade.',
        validation_status: 'pending',
        validated_by: null,
        validated_at: null
    },
    {
        id: 'mock-clf-002',
        certification: 'CLF-C02',
        domain: 'Security and Compliance',
        difficulty: 'medium',
        question_text: 'Qual serviço AWS provê proteção gerenciada contra ataques DDoS?',
        options: [
            { id: 'A', text: 'AWS WAF' },
            { id: 'B', text: 'AWS Shield' },
            { id: 'C', text: 'Amazon GuardDuty' },
            { id: 'D', text: 'AWS KMS' }
        ],
        correct_answer: ['B'],
        explanation: 'O AWS Shield é o serviço gerenciado da AWS para proteção contra ataques DDoS.',
        validation_status: 'pending',
        validated_by: null,
        validated_at: null
    },
    {
        id: 'mock-saa-001',
        certification: 'SAA-C03',
        domain: 'Design Resilient Architectures',
        difficulty: 'hard',
        question_text: 'Qual arquitetura melhora a disponibilidade de uma aplicação web na AWS?',
        options: [
            { id: 'A', text: 'Executar uma única instância EC2 em uma única AZ.' },
            { id: 'B', text: 'Distribuir instâncias EC2 em múltiplas AZs atrás de um Elastic Load Balancer.' },
            { id: 'C', text: 'Usar somente snapshots manuais do EBS.' },
            { id: 'D', text: 'Armazenar logs no volume raiz da instância.' }
        ],
        correct_answer: ['B'],
        explanation: 'Distribuir recursos em múltiplas AZs com balanceamento de carga reduz impacto de falhas localizadas.',
        validation_status: 'pending',
        validated_by: null,
        validated_at: null
    }
];

function waitForMockDelay() {
    return new Promise(resolve => {
        setTimeout(resolve, MOCK_DELAY_MS);
    });
}

function cloneQuestion(question) {
    return JSON.parse(JSON.stringify(question));
}

function isPending(question) {
    return question.validation_status === 'pending' || question.status === 'pending';
}

window.ValidationAPI = {
    isMockMode() {
        return USE_MOCK_DATA;
    },

    async fetchPendingQuestions() {
        if (!USE_MOCK_DATA) {
            throw new Error('Integração real pendente da Task 3/API: GET /api/questions/pending');
        }

        await waitForMockDelay();
        const pending = mockQuestions.filter(isPending).map(cloneQuestion);
        return { success: true, source: 'mock', data: pending };
    },

    async validateQuestion(id, payload) {
        if (!USE_MOCK_DATA) {
            throw new Error('Integração real pendente da Task 3/API: POST /api/questions/:id/validate');
        }

        await waitForMockDelay();

        const allowedStatuses = ['approved', 'rejected'];
        if (!allowedStatuses.includes(payload.status)) {
            throw new Error('Status de validação inválido.');
        }

        const questionIndex = mockQuestions.findIndex(question => question.id === id);
        if (questionIndex === -1) {
            throw new Error('Questão não encontrada no mock local.');
        }

        const validatedAt = payload.validated_at || payload.timestamp || new Date().toISOString();
        const updatedQuestion = {
            ...mockQuestions[questionIndex],
            validation_status: payload.status,
            status: payload.status,
            feedback: payload.feedback || payload.rejection_reason || '',
            rejection_reason: payload.rejection_reason || '',
            validated_by: payload.validated_by,
            validated_at: validatedAt
        };

        mockQuestions[questionIndex] = updatedQuestion;

        // Mock não persiste no banco. O salvamento real de validated_by depende da API oficial.
        return {
            success: true,
            source: 'mock',
            new_status: payload.status,
            data: cloneQuestion(updatedQuestion)
        };
    }
};
