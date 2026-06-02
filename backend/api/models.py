"""
Schemas Pydantic da API
"""

from typing import Any

from pydantic import BaseModel


class QuestionResponse(BaseModel):
    id: str
    certification: str
    domain: str
    difficulty: str
    question_text: str
    options: list[Any]


class QuizSubmission(BaseModel):
    user_id: str
    certification: str
    score: int
    total_questions: int
    percentage: float


class QuizHistoryResponse(BaseModel):
    id: str
    certification: str
    score: int
    total_questions: int
    percentage: float