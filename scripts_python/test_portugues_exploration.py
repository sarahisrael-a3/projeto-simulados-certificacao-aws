#!/usr/bin/env python3
"""
Teste de Exploração - Bug de Português de Portugal
OBJETIVO: Identificar questões com termos de português de Portugal
RESULTADO ESPERADO: Teste DEVE FALHAR (confirma que o bug existe)
"""

import json
import os
import sys

# Termos proibidos de português de Portugal
TERMOS_PROIBIDOS_PT = [
    "guardrails",
    "output",
    "outputs",
    "word filters",
    "content filters",
    "PII filters",
    "ecrã",
    "telemóvel",
    "gerir",
    "guardar",
    "políticas de conteúdo",
    "filtros de tópicos sensíveis",
    "validação de output"
]

def verificar_questao(questao, arquivo):
    """Verifica se uma questão contém termos proibidos"""
    texto_completo = f"{questao.get('question', '')} {' '.join(questao.get('options', []))} {questao.get('explanation', '')}"
    texto_lower = texto_completo.lower()
    
    termos_encontrados = []
    for termo in TERMOS_PROIBIDOS_PT:
        if termo.lower() in texto_lower:
            termos_encontrados.append(termo)
    
    return termos_encontrados

def executar_teste():
    """Executa o teste de exploração em todos os arquivos JSON"""
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    arquivos = [
        "data/aif-c01.json",
        "data/clf-c02.json",
        "data/saa-c03.json",
        "data/dva-c02.json"
    ]
    
    total_questoes = 0
    questoes_com_bug = 0
    contraexemplos = []
    
    print("="*70)
    print("TESTE DE EXPLORAÇÃO - BUG DE PORTUGUÊS DE PORTUGAL")
    print("="*70)
    print()
    
    for arquivo_rel in arquivos:
        arquivo_path = os.path.join(BASE_DIR, arquivo_rel)
        
        if not os.path.exists(arquivo_path):
            print(f"⚠️  Arquivo não encontrado: {arquivo_rel}")
            continue
        
        print(f"📄 Analisando: {arquivo_rel}")
        
        with open(arquivo_path, 'r', encoding='utf-8') as f:
            questoes = json.load(f)
        
        for questao in questoes:
            total_questoes += 1
            termos = verificar_questao(questao, arquivo_rel)
            
            if termos:
                questoes_com_bug += 1
                contraexemplos.append({
                    'arquivo': arquivo_rel,
                    'id': questao.get('id'),
                    'termos': termos,
                    'questao': questao.get('question', '')[:100] + '...'
                })
    
    print()
    print("="*70)
    print("RESULTADOS")
    print("="*70)
    print(f"Total de questões analisadas: {total_questoes}")
    print(f"Questões com português de Portugal: {questoes_com_bug}")
    print(f"Percentual com bug: {(questoes_com_bug/total_questoes*100):.1f}%")
    print()
    
    if contraexemplos:
        print("❌ TESTE FALHOU - Bug confirmado!")
        print()
        print("CONTRAEXEMPLOS ENCONTRADOS (primeiros 10):")
        print("-"*70)
        
        for i, exemplo in enumerate(contraexemplos[:10], 1):
            print(f"\n{i}. Arquivo: {exemplo['arquivo']}")
            print(f"   ID: {exemplo['id']}")
            print(f"   Termos proibidos: {', '.join(exemplo['termos'])}")
            print(f"   Questão: {exemplo['questao']}")
        
        if len(contraexemplos) > 10:
            print(f"\n... e mais {len(contraexemplos) - 10} questões com problemas")
        
        print()
        print("="*70)
        print("✅ TESTE EXECUTADO COM SUCESSO")
        print("   O teste falhou conforme esperado - bug confirmado!")
        print("="*70)
        return 1  # Retorna 1 para indicar que o bug foi encontrado
    else:
        print("✅ TESTE PASSOU - Nenhum termo proibido encontrado")
        print("   (Inesperado - bug deveria existir no código atual)")
        print("="*70)
        return 0

if __name__ == "__main__":
    sys.exit(executar_teste())
