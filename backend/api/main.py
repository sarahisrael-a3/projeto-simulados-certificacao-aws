"""
Aplicação principal FastAPI
"""

from fastapi import FastAPI
from fastapi import HTTPException
from backend.api.database import get_connection

app = FastAPI(
    title="AWS Simulator API",
    description="API para simulados de certificação AWS",
    version="1.0.0"
)


@app.get(
    "/",
    tags=["Health Check"],
    summary="Verifica se a API está online"
)
def health_check():
    return {
        "status": "online",
        "service": "AWS Simulator API"
    }

@app.get(
    "/api/questions",
    tags=["Questions"],
    summary="Retorna todas as questões ativas"
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
                "options": row[5]
            })

        return questions

    finally:
        cursor.close()
        conn.close()

@app.get(
    "/api/questions/{question_id}",
    tags=["Questions"],
    summary="Retorna uma questão pelo ID"
)
def get_question(question_id: str):

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
            WHERE id = %s
              AND is_active = TRUE
        """, (question_id,))

        row = cursor.fetchone()

        if row is None:
            raise HTTPException(
                status_code=404,
                detail="Question not found"
            )

        return {
            "id": str(row[0]),
            "certification": row[1],
            "domain": row[2],
            "difficulty": row[3],
            "question_text": row[4],
            "options": row[5]
        }

    finally:
        cursor.close()
        conn.close()