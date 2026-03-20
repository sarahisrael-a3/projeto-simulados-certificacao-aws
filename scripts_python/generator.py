import os
import json
import time
from google import genai
from pydantic import BaseModel, Field, field_validator
from typing import List
from dotenv import load_dotenv

# 1. CONFIGURAÇÃO DE AMBIENTE E CAMINHOS
load_dotenv()
# Descobre a raiz do projeto (sobe um nível a partir de onde o script está)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Inicializa o novo Cliente Gemini 2026
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# 2. SCHEMA DE VALIDAÇÃO (Pydantic V2)
class AWSQuestion(BaseModel):
    domain: str
    subdomain: str
    service: str
    difficulty: str
    type: str = "scenario"
    tags: List[str]
    question: str = Field(..., min_length=30)
    # Pydantic V2 usa min_length/max_length para listas
    options: List[str] = Field(..., min_length=4, max_length=4)
    correct: int = Field(..., ge=0, le=3)
    explanation: str = Field(..., min_length=30)

    @field_validator('domain')
    @classmethod
    def check_domain(cls, v):
        validos = [
            "conceitos-cloud", "seguranca", "tecnologia", "faturamento",
            "design-resiliente", "design-performance", "seguranca-aplicacoes", 
            "design-custo", "conceitos-ia", "ia-generativa", "seguranca-ia", "implementacao-ia"
        ]
        if v.lower().strip() not in validos:
            raise ValueError(f"Domínio '{v}' inválido.")
        return v.lower().strip()

# 3. MOTOR DE GERAÇÃO COM RETRY (TRATAMENTO DE ERRO 429)
def fabricar_questoes(exame_id, nivel, qtd=3):
    print(f"\n🚀 [IA] Iniciando geração para {exame_id} ({nivel})...")
    
    # Define o caminho absoluto para o banco de dados
    caminho_json = os.path.join(BASE_DIR, "data", f"{exame_id}.json")
    
    prompt = f"""
    Atue como Arquiteto AWS Sênior. Gere {qtd} questões inéditas para o exame {exame_id}.
    Nível de dificuldade: {nivel}. 
    Retorne APENAS o JSON puro (sem markdown).
    Campos: domain, subdomain, service, difficulty, type, tags, question, options, correct, explanation.
    """

    try:
        # Chamada ao Gemini
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        # Limpeza e parse do JSON
        texto_limpo = response.text.replace('```json', '').replace('```', '').strip()
        novas_questoes_raw = json.loads(texto_limpo)

        # Carrega o banco atual
        if os.path.exists(caminho_json):
            with open(caminho_json, 'r', encoding='utf-8') as f:
                banco = json.load(f)
        else:
            banco = []

        validas_count = 0
        ultimo_id = max([q['id'] for q in banco]) if banco else 1000

        # Validação Pydantic e Injeção
        for item in novas_questoes_raw:
            try:
                # Valida o objeto
                q_validada = AWSQuestion(**item).model_dump()
                
                # Gera novo ID sequencial
                ultimo_id += 1
                q_validada['id'] = ultimo_id
                
                banco.append(q_validada)
                validas_count += 1
            except Exception as ve:
                print(f"   ⚠️ Questão ignorada por erro de validação: {ve}")

        # Salva o arquivo atualizado
        with open(caminho_json, 'w', encoding='utf-8') as f:
            json.dump(banco, f, indent=2, ensure_ascii=False)

        print(f"✅ Sucesso! {validas_count} questões novas adicionadas ao banco {exame_id}.json")

    except Exception as e:
        # Trata o erro de Quota (429)
        if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
            print("⏳ [LIMITE] Quota atingida! Aguardando 25 segundos para tentar novamente...")
            time.sleep(25)
            return fabricar_questoes(exame_id, nivel, qtd)
        else:
            print(f"❌ Erro Crítico: {e}")

# 4. EXECUÇÃO PRINCIPAL
if __name__ == "__main__":
    # Gera 3 questões fáceis para testar o fluxo completo
    fabricar_questoes("clf-c02", "easy", 3)