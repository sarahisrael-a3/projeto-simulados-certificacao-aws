"""
Schemas Pydantic da API
"""

from typing import Any, Optional

from pydantic import BaseModel


class QuestionResponse(BaseModel):
    id: str
    certification: str
    domain: str
    difficulty: str
    question_text: str
    options: list[Any]


class AnswerSubmission(BaseModel):
    question_id: str
    user_answer: list[str]
    is_correct: bool
    time_secs: Optional[int] = None


class QuizSubmission(BaseModel):
    user_id: str
    certification: str
    score: int
    total_questions: int
    percentage: float
    domain_scores: dict = {}
    weak_domains: list[str] = []
    time_spent_secs: Optional[int] = None
    answers: Optional[list[AnswerSubmission]] = None


class QuizHistoryResponse(BaseModel):
    id: str
    certification: str
    score: int
    total_questions: int
    percentage: float
    domain_scores: dict = {}
    weak_domains: list[str] = []
    time_spent_secs: Optional[int] = None
    completed_at: str


class QuizSubmitResponse(BaseModel):
    id: str
    message: str

class WeakDomain(BaseModel):
    domain: str
    error_rate: float
    total_attempts: int
    errors: int

class GapsAnalysisResponse(BaseModel):
    status: str
    user_id: str
    weak_domains: list[WeakDomain]
    timestamp: str