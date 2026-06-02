# backend/api/main.py (Exemplo)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

app = FastAPI()

class ValidationRequest(BaseModel):
    status: str
    validated_by: str
    rejection_reason: Optional[str] = None
    timestamp: str

@app.post("/api/questions/{question_id}/validate")
async def validate_question(question_id: str, payload: ValidationRequest):
    if payload.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Status inválido")
        
    if payload.status == "rejected" and not payload.rejection_reason:
        raise HTTPException(status_code=400, detail="Motivo de rejeição é obrigatório")

    # TODO: Invocar função do database.py: update_question_validation(question_id, payload)
    # Sucesso:
    return {
        "success": True,
        "message": "Questão validada com sucesso",
        "question_id": question_id,
        "new_status": payload.status
    }