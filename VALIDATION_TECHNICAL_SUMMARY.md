# 🔧 Sumário Técnico - Validation Module

## 📐 Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────┐
│ CLIENTE (Browser)                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ validation/valid.html                                   │ │
│ │ + validation/js/validationUI.js                         │ │
│ │ + validation/js/validationStorage.js (localStorage)     │ │
│ │ + validation/css/valid.css (dark mode)                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTP/REST
               │ Headers: X-Validator-Name, Authorization
               ▼
┌─────────────────────────────────────────────────────────────┐
│ SERVIDOR API (FastAPI)                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ validation/backend/main.py                              │ │
│ │ - GET  /api/questions/pending                           │ │
│ │ - POST /api/questions/{id}/validate                     │ │
│ │ - GET  /api/validators/me/stats                         │ │
│ │ - GET  /api/validations/{id}                            │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ validation/backend/database.py (SQL queries)            │ │
│ │ validation/backend/models.py (Pydantic validators)      │ │
│ └─────────────────────────────────────────────────────────┘ │
└──────────────┬──────────────────────────────────────────────┘
               │ SQL Queries / asyncpg
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ DATABASE (PGLite)                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ backend/database/db.js (Node.js wrapper)                │ │
│ │ Tables:                                                 │ │
│ │ - questions (id, domain, text, options, status)         │ │
│ │ - validations (id, question_id, status, reason)         │ │
│ │ - validation_logs (id, action, details, created_at)     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Schema do Banco de Dados

### Tabela: `questions`
```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,           -- "Cloud Concepts", "Security"
    text TEXT NOT NULL,                     -- Texto da pergunta
    options JSONB NOT NULL,                 -- {"A": "...", "B": "..."}
    correct_answer CHAR(1) NOT NULL,        -- "A", "B", "C", "D"
    explanation TEXT NOT NULL,              -- Explicação da resposta
    status VARCHAR(20) DEFAULT 'pending',   -- pending, approved, rejected
    created_by_id INTEGER,                  -- Quem criou
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_domain ON questions(domain);
```

### Tabela: `validations`
```sql
CREATE TABLE validations (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id),
    validated_by_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,            -- "approved", "rejected"
    rejection_reason TEXT,                  -- Motivo da rejeição
    validated_at TIMESTAMP DEFAULT NOW(),
    notes JSONB                             -- Dados adicionais
);

CREATE INDEX idx_validations_question ON validations(question_id);
CREATE INDEX idx_validations_validator ON validations(validated_by_name);
```

### Tabela: `validation_logs`
```sql
CREATE TABLE validation_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,           -- APPROVED_QUESTION, REJECTED_QUESTION
    question_id INTEGER,
    validated_by_name VARCHAR(255),
    details JSONB,                          -- Context e metadados
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_question ON validation_logs(question_id);
CREATE INDEX idx_logs_created ON validation_logs(created_at);
```

---

## 📡 Endpoints REST

### 1. Listar Questões Pendentes
```http
GET /api/questions/pending?page=1&per_page=20&domain=Security

Request Headers:
  X-Validator-Name: João Silva
  Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "domain": "Cloud Concepts",
      "text": "O que é uma Região AWS?",
      "options": {
        "A": "Um único data center",
        "B": "Uma área geográfica...",
        "C": "Uma VPC dentro de uma zona",
        "D": "Um serviço de computação"
      },
      "correctAnswer": "B",
      "explanation": "Uma Região AWS...",
      "status": "pending",
      "created_at": "2026-06-02T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "per_page": 20,
  "pages": 3
}
```

### 2. Validar Questão (Aprovar)
```http
POST /api/questions/1/validate

Request Headers:
  X-Validator-Name: João Silva
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json

Request Body:
{
  "status": "approved",
  "notes": {
    "quality": "high",
    "difficulty_appropriate": true
  }
}

Response (200):
{
  "success": true,
  "validation_id": 123,
  "question_id": 1,
  "new_status": "approved",
  "validated_at": "2026-06-02T14:30:00Z",
  "validated_by": "João Silva",
  "message": "Questão aprovada com sucesso"
}
```

### 3. Validar Questão (Rejeitar)
```http
POST /api/questions/1/validate

Request Body:
{
  "status": "rejected",
  "rejection_reason": "Alternativa B está muito similar à C. Rever opções para melhor diferenciação.",
  "notes": {
    "improvement_priority": "high"
  }
}

Response (200):
{
  "success": true,
  "validation_id": 124,
  "question_id": 1,
  "new_status": "rejected",
  "validated_at": "2026-06-02T14:35:00Z",
  "validated_by": "João Silva",
  "message": "Questão rejeitada com sucesso"
}
```

### 4. Minhas Estatísticas
```http
GET /api/validators/me/stats

Request Headers:
  X-Validator-Name: João Silva
  Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "validator_id": 5,
  "validator_name": "João Silva",
  "total_validations": 42,
  "approved_count": 36,
  "rejected_count": 6,
  "approval_rate": 85.7,
  "average_time_minutes": 8.5,
  "period": "today",
  "quality_score": 78.5
}
```

### 5. Histórico de Validações
```http
GET /api/validations/1

Response (200):
[
  {
    "id": 124,
    "question_id": 1,
    "validated_by_name": "João Silva",
    "status": "rejected",
    "rejection_reason": "Alternativa B...",
    "validated_at": "2026-06-02T14:35:00Z",
    "notes": {...}
  },
  {
    "id": 123,
    "question_id": 1,
    "validated_by_name": "Maria Santos",
    "status": "approved",
    "rejection_reason": null,
    "validated_at": "2026-06-02T13:00:00Z",
    "notes": {...}
  }
]
```

---

## 🔐 Autenticação & Autorização

### Fluxo JWT (Futuro)
```
┌─────────────────────────────────────────┐
│ 1. Login                                │
│ POST /api/auth/login                    │
│ Body: { "email": "...", "password": "..."}
└────────────────────┬────────────────────┘
                     │
                     ▼
            ┌────────────────────┐
            │ Validate Credentials│
            │ Generate JWT Token │
            └────────────────────┘
                     │
                     ▼
         ┌──────────────────────────────┐
         │ Response Token              │
         │ {                           │
         │  "access_token": "...",     │
         │  "token_type": "bearer",    │
         │  "expires_in": 3600         │
         │ }                           │
         └──────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────────┐
         │ 2. Request com Token        │
         │ GET /api/questions/pending  │
         │ Header: Authorization: Bearer <TOKEN>
         └──────────────────────────────┘
```

### Token JWT (Exemplo)
```json
{
  "sub": "joao.silva@example.com",
  "validator_id": 5,
  "validator_name": "João Silva",
  "role": "specialist",
  "iat": 1717335600,
  "exp": 1717339200
}
```

---

## 🧪 Fluxo de Teste

### Script de Teste Completo
```bash
#!/bin/bash

BASE_URL="http://localhost:8000"
TOKEN="your-jwt-token-here"
VALIDATOR="João Silva"

# 1. Health Check
echo "1. Health Check"
curl -s $BASE_URL/health | jq .

# 2. Listar questões
echo "2. Questões Pendentes"
curl -s -X GET "$BASE_URL/api/questions/pending" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Aprovar questão
echo "3. Aprovar Questão"
curl -s -X POST "$BASE_URL/api/questions/1/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}' | jq .

# 4. Rejeitar questão
echo "4. Rejeitar Questão"
curl -s -X POST "$BASE_URL/api/questions/2/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "rejection_reason": "Alternativa B está muito similar à C"
  }' | jq .

# 5. Estatísticas
echo "5. Minhas Estatísticas"
curl -s -X GET "$BASE_URL/api/validators/me/stats" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## 📦 Dependências

### Python (Backend)
```
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
asyncpg==0.29.0
python-jose==3.3.0
python-multipart==0.0.6
cors==2.0.0
```

### JavaScript (Frontend)
```
Nenhuma dependência externa
- Vanilla JavaScript (ES6+)
- localStorage nativo
- Fetch API nativo
```

---

## 🚀 Deployment

### Desenvolvimento
```bash
# Terminal 1: PGLite
npm run db:start

# Terminal 2: FastAPI
python -m uvicorn validation.backend.main:app --reload

# Terminal 3: Frontend (abrir valid.html no browser)
# file:///path/to/validation/valid.html
```

### Produção
```bash
# Docker (futuro)
docker build -t validation-api .
docker run -p 8000:8000 validation-api

# Ou com Gunicorn
gunicorn validation.backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

---

## 📊 Performance Targets

| Métrica | Target | Método |
|---------|--------|--------|
| **Latência API** | < 200ms | P95 response time |
| **Throughput** | 100+ req/s | Load testing |
| **DB Query** | < 50ms | Query analysis |
| **Memory** | < 512MB | Monitoring |
| **CPU** | < 30% | Under load |

---

## 🔍 Monitoramento & Logs

### Logs Estruturados
```json
{
  "timestamp": "2026-06-02T14:30:00Z",
  "level": "INFO",
  "service": "validation-api",
  "action": "QUESTION_APPROVED",
  "question_id": 1,
  "validator": "João Silva",
  "duration_ms": 45,
  "ip_address": "192.168.1.1"
}
```

### Métricas (Prometheus)
```
validation_questions_validated_total{status="approved"} 245
validation_questions_validated_total{status="rejected"} 18
validation_api_response_time_ms{endpoint="/api/questions/pending"} 45
validation_api_db_query_ms{query="get_pending"} 28
```

---

## ✅ Checklist de Produção

- [ ] Schema criado no PGLite
- [ ] Database.py conectado e testado
- [ ] FastAPI endpoints funcionando
- [ ] JWT authentication implementada
- [ ] Logging e auditoria ativo
- [ ] Rate limiting configurado
- [ ] CORS seguro
- [ ] Testes unitários (>80% coverage)
- [ ] Testes de integração
- [ ] E2E tests
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation completa
- [ ] Deployment scripts
- [ ] Monitoring configurado

---

**Última Atualização:** 2026-06-02  
**Status:** 🟡 Pronto para Implementação
