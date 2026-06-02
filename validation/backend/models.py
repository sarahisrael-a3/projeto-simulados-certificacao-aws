"""
Modelos Pydantic para validação de dados.
Define estruturas esperadas na API de validação.
"""

from pydantic import BaseModel, Field, EmailStr, validator
from typing import Dict, Optional, List
from datetime import datetime
from enum import Enum


class QuestionStatus(str, Enum):
    """Estados possíveis de uma questão"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    ARCHIVED = "archived"


class ValidationStatus(str, Enum):
    """Estados possíveis de uma validação"""
    APPROVED = "approved"
    REJECTED = "rejected"


class ValidatorRole(str, Enum):
    """Papéis de validadores"""
    SPECIALIST = "specialist"
    LEAD = "lead"
    ADMIN = "admin"


# ============================================================================
# MODELS: Questões
# ============================================================================

class QuestionOption(BaseModel):
    """Opção única de uma questão"""
    key: str = Field(..., min_length=1, max_length=1, description="A, B, C, D, etc")
    text: str = Field(..., min_length=5, max_length=500, description="Texto da opção")
    
    @validator('key')
    def validate_key(cls, v):
        if not v.isupper() or not v.isalpha():
            raise ValueError('Chave deve ser letra maiúscula')
        return v


class QuestionCreate(BaseModel):
    """Dados para criar uma nova questão"""
    domain: str = Field(..., min_length=3, max_length=100, description="Domínio/Tópico")
    text: str = Field(..., min_length=10, max_length=1000, description="Texto da questão")
    options: Dict[str, str] = Field(..., description="Opções {A: 'texto', B: 'texto'...}")
    correct_answer: str = Field(..., min_length=1, max_length=1, description="Resposta correta (A, B, C...)")
    explanation: str = Field(..., min_length=20, max_length=2000, description="Explicação da resposta")
    created_by_id: Optional[int] = None
    
    @validator('correct_answer')
    def validate_correct_answer(cls, v, values):
        if 'options' in values:
            if v not in values['options']:
                raise ValueError('Resposta correta deve estar nas opções')
        return v
    
    @validator('options')
    def validate_options(cls, v):
        if len(v) < 2:
            raise ValueError('Mínimo 2 opções required')
        if len(v) > 10:
            raise ValueError('Máximo 10 opções allowed')
        
        valid_keys = set('ABCDEFGHIJ')
        if not all(k in valid_keys for k in v.keys()):
            raise ValueError('Chaves devem ser A, B, C, ...')
        
        return v


class Question(QuestionCreate):
    """Questão completa com metadados"""
    id: int
    status: QuestionStatus = QuestionStatus.PENDING
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class QuestionPending(Question):
    """Questão pendente para validação (com histórico)"""
    validation_count: int = 0
    last_validation: Optional[datetime] = None


# ============================================================================
# MODELS: Validações
# ============================================================================

class ValidationRequest(BaseModel):
    """Request para validar uma questão"""
    status: ValidationStatus = Field(..., description="approved ou rejected")
    rejection_reason: Optional[str] = Field(
        None,
        min_length=10,
        max_length=1000,
        description="Motivo da rejeição (obrigatório se status=rejected)"
    )
    notes: Optional[Dict] = Field(None, description="Notas adicionais em JSON")
    
    @validator('rejection_reason')
    def validate_rejection_reason(cls, v, values):
        if values.get('status') == ValidationStatus.REJECTED:
            if not v or len(v) < 10:
                raise ValueError('Motivo de rejeição obrigatório com mínimo 10 caracteres')
        return v


class ValidationResponse(BaseModel):
    """Response após validar questão"""
    success: bool
    validation_id: int
    question_id: int
    new_status: str
    validated_at: datetime
    validated_by: str
    message: Optional[str] = None


class ValidationRecord(BaseModel):
    """Registro individual de validação"""
    id: int
    question_id: int
    validated_by_name: str
    status: ValidationStatus
    rejection_reason: Optional[str] = None
    validated_at: datetime
    notes: Optional[Dict] = None
    
    class Config:
        orm_mode = True


class ValidationHistory(BaseModel):
    """Histórico de validações de uma questão"""
    question_id: int
    total_validations: int
    current_status: QuestionStatus
    validations: List[ValidationRecord]
    approved_by: List[str] = []
    rejected_by: List[str] = []


# ============================================================================
# MODELS: Validadores
# ============================================================================

class ValidatorCreate(BaseModel):
    """Dados para criar novo validador"""
    name: str = Field(..., min_length=3, max_length=255, description="Nome completo")
    email: Optional[EmailStr] = None
    role: ValidatorRole = ValidatorRole.SPECIALIST
    
    @validator('name')
    def validate_name(cls, v):
        if not all(c.isalpha() or c.isspace() for c in v):
            raise ValueError('Nome deve conter apenas letras e espaços')
        return v.strip()


class Validator(ValidatorCreate):
    """Validador com dados adicionais"""
    id: int
    is_active: bool = True
    last_login: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        orm_mode = True


class ValidatorStats(BaseModel):
    """Estatísticas de um validador"""
    validator_id: int
    validator_name: str
    total_validations: int
    approved_count: int
    rejected_count: int
    approval_rate: float
    average_time_minutes: float
    period: str
    
    @property
    def quality_score(self) -> float:
        """Score de qualidade baseado em consistência"""
        if self.total_validations == 0:
            return 0.0
        
        # Score = (aprovações bem distribuídas) + (tempo médio bom)
        balance = 1.0 - abs(self.approval_rate - 0.5) * 2  # 0-1
        time_score = max(0, 1.0 - (self.average_time_minutes / 30))  # Ideal: 30min
        
        return round((balance * 0.6 + time_score * 0.4) * 100, 2)


# ============================================================================
# MODELS: Relatórios e Logs
# ============================================================================

class ValidationLog(BaseModel):
    """Log de auditoria de validações"""
    id: int
    action: str
    question_id: Optional[int] = None
    validated_by_name: Optional[str] = None
    details: Dict
    ip_address: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True


class ValidationReport(BaseModel):
    """Relatório de validações em período"""
    period_start: datetime
    period_end: datetime
    total_questions_validated: int
    approved_count: int
    rejected_count: int
    approval_rate: float
    top_validators: List[Dict]
    problematic_domains: List[str]
    average_validation_time: float
    
    class Config:
        orm_mode = True


class DashboardStats(BaseModel):
    """Estatísticas para dashboard de validador"""
    pending_count: int
    approved_today: int
    rejected_today: int
    current_streak: int
    validation_rate: float  # Questões/hora
    quality_score: float
    
    class Config:
        orm_mode = True


# ============================================================================
# MODELS: Erros e Respostas
# ============================================================================

class ErrorResponse(BaseModel):
    """Resposta de erro padrão"""
    success: bool = False
    error: str
    error_code: Optional[str] = None
    details: Optional[Dict] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class SuccessResponse(BaseModel):
    """Resposta de sucesso genérica"""
    success: bool = True
    data: Optional[Dict] = None
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class PaginatedResponse(BaseModel):
    """Resposta paginada genérica"""
    success: bool = True
    data: List[Dict]
    total: int
    page: int
    per_page: int
    pages: int
    
    @property
    def has_next(self) -> bool:
        return self.page < self.pages
    
    @property
    def has_prev(self) -> bool:
        return self.page > 1
