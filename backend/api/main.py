"""
Aplicação principal FastAPI
"""

from fastapi import FastAPI

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