"""
Aplicação principal FastAPI
"""

import json

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from backend.api.database import get_connection
from backend.api.models import (
    QuestionResponse,
    QuizHistoryResponse,
    QuizSubmission,
    QuizSubmitResponse,
)

app = FastAPI(
    title="AWS Simulator API",
    description="API para simulados de certificação AWS",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get(
    "/",
    tags=["Health Check"],
    summary="Verifica se a API está online",
)
def health_check():
    return {
        "status": "online",
        "service": "AWS Simulator API",
    }

@app.get(
    "/api/questions",
    tags=["Questions"],
    summary="Retorna todas as questões ativas",
    response_model=list[QuestionResponse],
)
def get_questions():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                certification,
                domain,
                difficulty,
                question_text,
                options
            FROM questions
            WHERE is_active = TRUE
        """)

        rows = cursor.fetchall()

        questions = []
        for row in rows:
            questions.append({
                "id": str(row[0]),
                "certification": row[1],
                "domain": row[2],
                "difficulty": row[3],
                "question_text": row[4],
                "options": row[5],
            })

        return questions

    finally:
        cursor.close()
        conn.close()

@app.get(
    "/api/questions/{question_id}",
    tags=["Questions"],
    summary="Retorna uma questão pelo ID",
    response_model=QuestionResponse,
)
def get_question(question_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                id,
                certification,
                domain,
                difficulty,
                question_text,
                options
            FROM questions
            WHERE id = %s
              AND is_active = TRUE
        """,
            (question_id,),
        )

        row = cursor.fetchone()

        if row is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found",
            )

        return {
            "id": str(row[0]),
            "certification": row[1],
            "domain": row[2],
            "difficulty": row[3],
            "question_text": row[4],
            "options": row[5],
        }

    finally:
        cursor.close()
        conn.close()

@app.post(
    "/api/quiz/submit",
    tags=["Quiz"],
    summary="Submete o resultado de um quiz realizado",
    response_model=QuizSubmitResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_quiz(submission: QuizSubmission):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        
        cursor.execute(
            """
            INSERT INTO quiz_history (
                user_id,
                certification,
                score,
                total_questions,
                percentage,
                domain_scores,
                weak_domains,
                time_spent_secs
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """,
            (
                submission.user_id,
                submission.certification,
                submission.score,
                submission.total_questions,
                submission.percentage,
                json.dumps(submission.domain_scores),
                submission.weak_domains,
                submission.time_spent_secs,
            ),
        )

        quiz_id = str(cursor.fetchone()[0])

        if submission.answers:
            for answer in submission.answers:
                cursor.execute(
                    """
                    INSERT INTO answers (
                        quiz_id,
                        question_id,
                        user_answer,
                        is_correct,
                        time_secs
                    ) VALUES (%s, %s, %s, %s, %s)
                """,
                    (
                        quiz_id,
                        answer.question_id,
                        json.dumps(answer.user_answer),
                        answer.is_correct,
                        answer.time_secs,
                    ),
                )

        conn.commit()

        return {
            "id": quiz_id,
            "message": "Quiz submitted successfully",
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit quiz: {str(e)}",
        )

    finally:
        cursor.close()
        conn.close()

@app.get(
    "/api/history/{user_id}",
    tags=["History"],
    summary="Retorna o histórico de quizzes de um usuário",
    response_model=list[QuizHistoryResponse],
)
def get_history(user_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                id,
                certification,
                score,
                total_questions,
                percentage,
                domain_scores,
                weak_domains,
                time_spent_secs,
                completed_at
            FROM quiz_history
            WHERE user_id = %s
            ORDER BY completed_at DESC
        """,
            (user_id,),
        )

        rows = cursor.fetchall()

        history = []
        for row in rows:
            history.append({
                "id": str(row[0]),
                "certification": row[1],
                "score": row[2],
                "total_questions": row[3],
                "percentage": float(row[4]),
                "domain_scores": row[5] if row[5] else {},
                "weak_domains": row[6] if row[6] else [],
                "time_spent_secs": row[7],
                "completed_at": row[8].isoformat() if row[8] else None,
            })

        return history

    finally:
        cursor.close()
        conn.close()
