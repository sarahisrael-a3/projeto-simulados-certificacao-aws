import json
import os
from pydantic import ValidationError
from generator import AWSQuestion

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA_DATA = os.path.join(BASE_DIR, "data")

def filter_valid_schema(raw_questions: list) -> list:
    """Filtra uma lista de questões cruas vindas da IA e retorna apenas as que respeitam o contrato Pydantic."""
    valid_questions = []
    for item in raw_questions:
        try:
            # Tenta validar. Se passar, converte de volta para dicionário limpo
            q_validada = AWSQuestion(**item).model_dump()
            valid_questions.append(q_validada)
        except ValidationError as e:
            print(f"  ❌ Schema Error: Questão descartada por não respeitar o formato. Detalhes: {e.errors()[0]['msg']}")
    return valid_questions

def validar_banco_existente():
    """Auditoria manual dos JSONs já salvos na pasta data/."""
    for arquivo in os.listdir(PASTA_DATA):
        if arquivo.endswith(".json"):
            print(f"\n🧐 Auditando {arquivo}...")
            caminho = os.path.join(PASTA_DATA, arquivo)
            with open(caminho, 'r', encoding='utf-8') as f:
                dados = json.load(f)
                
            erros = 0
            for item in dados:
                try:
                    AWSQuestion(**item)
                except Exception as e:
                    print(f"  ❌ Erro no ID {item.get('id', 'N/A')}: {e}")
                    erros += 1
            
            if erros == 0:
                print(f"  ✅ {arquivo} está 100% perfeito!")
            else:
                print(f"  ⚠️ {arquivo} contém {erros} erros estruturais.")

if __name__ == "__main__":
    validar_banco_existente()