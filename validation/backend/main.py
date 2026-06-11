# validation/backend/main.py
"""
API FastAPI para validação de questões de certificação.

Endpoints:
- GET  /api/questions/pending      - Lista questões aguardando validação
- POST /api/questions/{id}/validate - Valida uma questão (aprova/rejeita)
- GET  /api/validators/me/stats     - Estatísticas do validador atual
- GET  /api/validations/{id}        - Histórico de validação
"""

from fastapi import FastAPI, HTTPException, Depends, Header, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from datetime import datetime
import logging

# Importar modelos
from .models import (
    ValidationRequest,
    ValidationResponse,
    ValidationRecord,
    ValidatorStats,
    ErrorResponse,
    PaginatedResponse,
    QuestionPending,
)
from .database import db_instance

# Configuração
app = FastAPI(
    title="AWS Certification - Validation API",
    version="1.0.0",
    description="API para validação de questões de certificação AWS"
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS (permitir frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# MIDDLEWARES E DEPENDÊNCIAS
# ============================================================================

async def get_validator_name(x_validator_name: Optional[str] = Header(None)) -> str:
    """
    Extrai nome do validador do header.
    
    TODO: Substituir por autenticação JWT real
    """
    if not x_validator_name:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Validador não identificado. Envie X-Validator-Name header"
        )
    return x_validator_name


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/health")
async def health_check():
    """Verificar se API está online"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "service": "validation-api"
    }


# ============================================================================
# QUESTÕES
# ============================================================================

@app.get(
    "/api/questions/pending",
    response_model=PaginatedResponse,
    summary="Listar questões pendentes",
    tags=["Questions"]
)
async def get_pending_questions(
    page: int = 1,
    per_page: int = 20,
    domain: Optional[str] = None,
):
    """
    Retorna lista de questões aguardando validação.
    
    Query Parameters:
    - page: Número da página (padrão: 1)
    - per_page: Questões por página (padrão: 20, máx: 100)
    - domain: Filtrar por domínio/tópico (opcional)
    
    Returns:
        PaginatedResponse com questões pendentes
    """
    try:
        if per_page > 100:
            per_page = 100
        
        # TODO: Conectar com database
        # questions = await db_instance.get_pending_questions(
        #     limit=per_page,
        #     offset=(page - 1) * per_page,
        #     domain=domain
        # )
        
        questions = []  # Mock
        total = len(questions)
        pages = (total + per_page - 1) // per_page
        
        return PaginatedResponse(
            data=questions,
            total=total,
            page=page,
            per_page=per_page,
            pages=pages
        )
        
    except Exception as e:
        logger.error(f"Erro ao listar questões: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao listar questões"
        )


# ============================================================================
# VALIDAÇÕES
# ============================================================================

@app.post(
    "/api/questions/{question_id}/validate",
    response_model=ValidationResponse,
    summary="Validar uma questão",
    tags=["Validations"]
)
async def validate_question(
    question_id: int,
    payload: ValidationRequest,
    validator_name: str = Depends(get_validator_name),
):
    """
    Valida uma questão (aprova ou rejeita).
    
    Request Body:
    {
        "status": "approved" ou "rejected",
        "rejection_reason": "Motivo (obrigatório se rejected)",
        "notes": {}
    }
    
    Returns:
        ValidationResponse com resultado da validação
    """
    try:
        # Validar payload
        if payload.status.value == "rejected" and not payload.rejection_reason:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Motivo de rejeição obrigatório"
            )
        
        # TODO: Chamar database.record_validation()
        # result = await db_instance.record_validation(
        #     question_id=question_id,
        #     validated_by_name=validator_name,
        #     status=payload.status.value,
        #     rejection_reason=payload.rejection_reason,
        #     notes=payload.notes
        # )
        
        # Mock response
        return ValidationResponse(
            success=True,
            validation_id=1,
            question_id=question_id,
            new_status=payload.status.value,
            validated_at=datetime.now(),
            validated_by=validator_name,
            message=f"Questão {payload.status.value} com sucesso"
        )
        
    except Exception as e:
        logger.error(f"Erro ao validar questão {question_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao validar questão"
        )


@app.get(
    "/api/validations/{question_id}",
    response_model=List[ValidationRecord],
    summary="Histórico de validações",
    tags=["Validations"]
)
async def get_validation_history(question_id: int):
    """
    Retorna histórico de validações de uma questão.
    
    Path Parameters:
    - question_id: ID da questão
    
    Returns:
        Lista de registros de validação
    """
    try:
        # TODO: Conectar com database
        # history = await db_instance.get_validation_history(question_id)
        
        history = []  # Mock
        return history
        
    except Exception as e:
        logger.error(f"Erro ao buscar histórico: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar histórico"
        )


# ============================================================================
# VALIDADORES E ESTATÍSTICAS
# ============================================================================

@app.get(
    "/api/validators/me/stats",
    response_model=ValidatorStats,
    summary="Minhas estatísticas",
    tags=["Validators"]
)
async def get_my_stats(
    validator_name: str = Depends(get_validator_name),
):
    """
    Retorna estatísticas do validador atual (hoje).
    
    Returns:
        ValidatorStats com métricas pessoais
    """
    try:
        # TODO: Conectar com database
        # stats = await db_instance.get_validator_stats(validator_name)
        
        stats = ValidatorStats(
            validator_id=1,
            validator_name=validator_name,
            total_validations=0,
            approved_count=0,
            rejected_count=0,
            approval_rate=0.0,
            average_time_minutes=0.0,
            period="today"
        )
        
        return stats
        
    except Exception as e:
        logger.error(f"Erro ao buscar estatísticas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar estatísticas"
        )


@app.get(
    "/api/validators/{validator_name}/stats",
    response_model=ValidatorStats,
    summary="Estatísticas de validador",
    tags=["Validators"]
)
async def get_validator_stats(
    validator_name: str,
):
    """
    Retorna estatísticas públicas de um validador.
    
    Path Parameters:
    - validator_name: Nome do validador
    
    Returns:
        ValidatorStats com métricas
    """
    try:
        # TODO: Conectar com database
        # stats = await db_instance.get_validator_stats(validator_name)
        
        stats = ValidatorStats(
            validator_id=1,
            validator_name=validator_name,
            total_validations=0,
            approved_count=0,
            rejected_count=0,
            approval_rate=0.0,
            average_time_minutes=0.0,
            period="all_time"
        )
        
        return stats
        
    except Exception as e:
        logger.error(f"Erro ao buscar estatísticas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar estatísticas"
        )


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handler customizado para exceções HTTP"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "timestamp": datetime.now().isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handler para exceções não tratadas"""
    logger.error(f"Erro não tratado: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Erro interno do servidor",
            "timestamp": datetime.now().isoformat()
        }
    )


# ============================================================================
# STARTUP/SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Inicialização da API"""
    logger.info("🚀 Validation API iniciando...")
    # TODO: await db_instance.create_validation_tables()
    logger.info("✅ Validation API pronta")


@app.on_event("shutdown")
async def shutdown_event():
    """Finalização da API"""
    logger.info("⏹ Validation API finalizando...")
    # TODO: await db_instance.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
