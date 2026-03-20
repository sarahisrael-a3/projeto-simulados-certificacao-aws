import json
import pandas as pd
import os

# Pega o caminho da pasta onde este script está e sobe um nível para achar a raiz do projeto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def gerar_relatorio(exame_id):
    # Monta o caminho correto: Raiz/data/exame.json
    caminho = os.path.join(BASE_DIR, "data", f"{exame_id}.json")
    
    if not os.path.exists(caminho):
        print(f"❌ Erro: Arquivo não encontrado em: {caminho}")
        return

    with open(caminho, "r", encoding="utf-8") as f:
        dados = json.load(f)
        if not dados:
            print(f"📭 {exame_id}: O arquivo está vazio.")
            return
        df = pd.DataFrame(dados)
    
    print(f"\n📊 AUDITORIA TÉCNICA: {exame_id.upper()}")
    print("="*45)
    print(f"Total de Questões: {len(df)}")
    
    # Verifica se as colunas novas já existem no seu JSON
    if 'difficulty' in df.columns:
        print("\n✅ DISTRIBUIÇÃO POR NÍVEL:")
        print(df['difficulty'].value_counts().to_string())
    
    if 'service' in df.columns:
        print("\n☁️ COBERTURA DE SERVIÇOS (TOP 5):")
        print(df['service'].value_counts().head(5).to_string())
    
    print("="*45)

if __name__ == "__main__":
    for exame in ["clf-c02", "saa-c03", "aif-c01"]:
        gerar_relatorio(exame)