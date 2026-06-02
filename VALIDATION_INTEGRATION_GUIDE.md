# 🔗 Guia de Integração: Validation com PGLite

**Objetivo:** Conectar o módulo de validação ao PGLite para operações de banco de dados reais.

**Status:** 📋 Pronto para implementação (arquivos base criados)

---

## 📊 Arquitetura da Integração

```
┌─────────────────────────────────────────────────────┐
│          FRONTEND (JavaScript)                      │
│  validation/js/validationUI.js                      │
│  - Interface de validação                           │
│  - Chama validationAPI.js                           │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP
                   ▼
┌─────────────────────────────────────────────────────┐
│          BACKEND (FastAPI)                          │
│  validation/backend/main.py                         │
│  - Endpoints REST                                   │
│  - Validação de dados                               │
│  - Chama database.py                                │
└──────────────────┬──────────────────────────────────┘
                   │ Query SQL
                   ▼
┌─────────────────────────────────────────────────────┐
│          DATABASE (PGLite)                          │
│  backend/database/db.js (Node.js)                   │
│  - Executa queries SQL                              │
│  - PostgreSQL completo                              │
│  - Persistência em memória/disco                    │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Passo 1: Preparar o Banco de Dados

### 1.1 Criar o Script SQL

Criar arquivo `backend/database/migrations/001_validation_schema.sql`:

```sql
-- Tabelas para o módulo de validação

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    explanation TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_by_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS validations (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id),
    validated_by_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    rejection_reason TEXT,
    validated_at TIMESTAMP DEFAULT NOW(),
    notes JSONB
);

CREATE TABLE IF NOT EXISTS validation_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    question_id INTEGER,
    validated_by_name VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_validations_question_id ON validations(question_id);
CREATE INDEX idx_validations_validator ON validations(validated_by_name);
```

### 1.2 Executar Script no PGLite

```javascript
// backend/database/init-validation-schema.js
import { executeQuery, executeSql } from './db.js';
import fs from 'fs';

async function initValidationSchema() {
  const sql = fs.readFileSync('./backend/database/migrations/001_validation_schema.sql', 'utf-8');
  
  await executeSql(sql);
  console.log('✅ Schema de validação criado');
}

// Executar quando o banco iniciar
// await initValidationSchema();
```

---

## 🎯 Passo 2: Implementar database.py

### 2.1 Conectar com PGLite

```python
# validation/backend/database.py - Seção de conexão

import asyncpg
import json
from datetime import datetime

class ValidationDatabase:
    def __init__(self, connection_string: str = "postgresql://localhost/pglite"):
        self.connection_string = connection_string
        self.pool = None
    
    async def connect(self):
        """Conecta ao PGLite"""
        self.pool = await asyncpg.create_pool(self.connection_string)
        print("✅ Conectado ao PGLite")
    
    async def disconnect(self):
        """Desconecta do PGLite"""
        if self.pool:
            await self.pool.close()
            print("✅ Desconectado do PGLite")
    
    async def get_connection(self):
        """Obtém conexão do pool"""
        return await self.pool.acquire()
```

### 2.2 Implementar Métodos

```python
# Exemplo: get_pending_questions (implementação real)

async def get_pending_questions(self, limit: int = 20):
    """Busca questões aguardando validação"""
    conn = await self.get_connection()
    try:
        query = """
            SELECT 
                q.id,
                q.domain,
                q.text,
                q.options,
                q.correct_answer as "correctAnswer",
                q.explanation,
                q.status,
                q.created_at,
                COUNT(v.id) as validation_count
            FROM questions q
            LEFT JOIN validations v ON q.id = v.question_id
            WHERE q.status = $1
            GROUP BY q.id
            ORDER BY q.created_at ASC
            LIMIT $2;
        """
        
        rows = await conn.fetch(query, 'pending', limit)
        
        # Converter jsonb para dicts
        questions = []
        for row in rows:
            q = dict(row)
            q['options'] = json.loads(q['options'])
            questions.append(q)
        
        return questions
    finally:
        await self.pool.release(conn)
```

---

## 🔌 Passo 3: Implementar Endpoints FastAPI

### 3.1 Adicionar Dependência de DB

```python
# validation/backend/main.py

from .database import ValidationDatabase
import os

# Instância global
DB = ValidationDatabase(
    connection_string=os.getenv(
        "DATABASE_URL",
        "postgresql://localhost/pglite"
    )
)

@app.on_event("startup")
async def startup():
    await DB.connect()

@app.on_event("shutdown")
async def shutdown():
    await DB.disconnect()
```

### 3.2 Implementar Endpoint Real

```python
# validation/backend/main.py

@app.get("/api/questions/pending")
async def get_pending_questions(page: int = 1, per_page: int = 20):
    """Endpoint real que consulta PGLite"""
    try:
        offset = (page - 1) * per_page
        
        # Chamar database
        questions = await DB.get_pending_questions(limit=per_page)
        
        return {
            "success": True,
            "data": questions,
            "total": len(questions),
            "page": page,
            "per_page": per_page
        }
    except Exception as e:
        logger.error(f"Erro: {e}")
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 📦 Passo 4: Atualizar Frontend

### 4.1 Conectar API Real

```javascript
// validation/js/validationAPI.js

export const ValidationAPI = {
    async fetchPendingQuestions() {
        try {
            // Em vez de mock data
            const response = await fetch('/api/questions/pending', {
                headers: {
                    'X-Validator-Name': localStorage.getItem('validator_name')
                }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar questões:', error);
            return { success: false, error: error.message };
        }
    },
    
    async validateQuestion(id, payload) {
        try {
            const response = await fetch(`/api/questions/${id}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Validator-Name': localStorage.getItem('validator_name')
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao validar:', error);
            throw error;
        }
    }
};
```

---

## 🧪 Passo 5: Testar Integração

### 5.1 Setup de Teste

```bash
# Terminal 1: Iniciar PGLite
npm run db:start

# Terminal 2: Popular dados de teste
node backend/database/example.js  # ou script específico

# Terminal 3: Iniciar API FastAPI
pip install fastapi uvicorn asyncpg
python -m uvicorn validation.backend.main:app --reload

# Terminal 4: Testar endpoints
curl -X GET http://localhost:8000/health
curl -X GET http://localhost:8000/api/questions/pending \
  -H "X-Validator-Name: João Silva"
```

### 5.2 Testes de API

```bash
# Arquivo: test_validation_api.sh

#!/bin/bash

BASE_URL="http://localhost:8000"
VALIDATOR="João Silva"

echo "📋 Testando Validation API"
echo ""

# 1. Health Check
echo "1️⃣  Health Check"
curl -s $BASE_URL/health | jq .
echo ""

# 2. Buscar questões pendentes
echo "2️⃣  Buscar Questões Pendentes"
curl -s -X GET "$BASE_URL/api/questions/pending" \
  -H "X-Validator-Name: $VALIDATOR" | jq .
echo ""

# 3. Validar uma questão
echo "3️⃣  Validar Questão (Aprovar)"
curl -s -X POST "$BASE_URL/api/questions/1/validate" \
  -H "Content-Type: application/json" \
  -H "X-Validator-Name: $VALIDATOR" \
  -d '{
    "status": "approved",
    "notes": {}
  }' | jq .
echo ""

# 4. Rejeitar uma questão
echo "4️⃣  Validar Questão (Rejeitar)"
curl -s -X POST "$BASE_URL/api/questions/2/validate" \
  -H "Content-Type: application/json" \
  -H "X-Validator-Name: $VALIDATOR" \
  -d '{
    "status": "rejected",
    "rejection_reason": "Alternativa B está muito similar à C",
    "notes": {}
  }' | jq .
echo ""

# 5. Estatísticas
echo "5️⃣  Estatísticas do Validador"
curl -s -X GET "$BASE_URL/api/validators/me/stats" \
  -H "X-Validator-Name: $VALIDATOR" | jq .
```

---

## 📊 Passo 6: Verificar Dados no Banco

```javascript
// Verificar dados no PGLite
import { executeQuery } from './backend/database/db.js';
import { initializeDatabase } from './backend/database/db.js';

async function checkValidationData() {
    await initializeDatabase();
    
    const questions = await executeQuery('SELECT * FROM questions');
    console.log('Questões:', questions);
    
    const validations = await executeQuery('SELECT * FROM validations');
    console.log('Validações:', validations);
}

checkValidationData();
```

---

## 🔒 Passo 7: Adicionar Autenticação

### 7.1 Implementar JWT

```python
# validation/backend/auth.py

from fastapi import HTTPException, status
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "sua-chave-secreta-aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_validator(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        validator_name: str = payload.get("sub")
        
        if validator_name is None:
            raise HTTPException(status_code=401, detail="Token inválido")
            
        return validator_name
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expirado")
```

---

## 📈 Passo 8: Monitoramento e Logs

```python
# validation/backend/logging_config.py

import logging
from datetime import datetime

class ValidationLogger:
    def __init__(self):
        self.logger = logging.getLogger("validation")
        self.logger.setLevel(logging.INFO)
        
        # File handler
        fh = logging.FileHandler(f"logs/validation_{datetime.now().date()}.log")
        fh.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        fh.setFormatter(formatter)
        self.logger.addHandler(fh)
    
    def log_validation(self, question_id: int, validator: str, status: str):
        self.logger.info(
            f"Validation: Q{question_id} by {validator} - {status}"
        )

logger = ValidationLogger()
```

---

## ✅ Checklist de Implementação

### Fase 1: Backend (2 dias)
- [ ] Criar schema SQL no PGLite
- [ ] Implementar `database.py` com asyncpg
- [ ] Conectar FastAPI ao banco
- [ ] Testar endpoints com curl
- [ ] Adicionar logging

### Fase 2: Frontend (1 dia)
- [ ] Atualizar `validationAPI.js` com URLs reais
- [ ] Remover mock data
- [ ] Adicionar tratamento de erros
- [ ] Testar integração completa

### Fase 3: Segurança (1 dia)
- [ ] Implementar autenticação JWT
- [ ] Adicionar CORS seguro
- [ ] Validação de input robusta
- [ ] Rate limiting

### Fase 4: Testing (2 dias)
- [ ] Testes unitários (pytest)
- [ ] Testes de integração
- [ ] Testes E2E
- [ ] Performance testing

---

## 🚨 Possíveis Problemas

### "Connection refused" ao conectar PGLite

```python
# Verificar se PGLite está rodando
# Terminal
npm run db:start

# E ajustar connection string
DATABASE_URL="postgresql://localhost:5432/"
```

### "Table doesn't exist"

```python
# Executar schema.sql
# No arquivo db.js da integração
await executeSql(fs.readFileSync('./schema.sql', 'utf-8'))
```

### CORS Error

```python
# Configurar CORS corretamente em main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📚 Recursos

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [asyncpg Documentation](https://magicstack.github.io/asyncpg/)
- [PGLite Setup](./PGLITE_SETUP.md)
- [Validation Analysis](./VALIDATION_ANALYSIS.md)

---

**Próximo Passo:** Começar pela Fase 1 (Backend) e comunicar progresso no repository.
