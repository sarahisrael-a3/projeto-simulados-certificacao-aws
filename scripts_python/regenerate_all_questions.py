#!/usr/bin/env python3
"""
Script de Regeneração de Questões com Português Brasileiro
Regenera todas as questões dos arquivos JSON usando o prompt corrigido
"""

import json
import os
import sys
from generator import fabricar_questoes, validar_portugues_brasileiro
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ARQUIVOS_DADOS = {
    "aif-c01": "data/aif-c01.json",
    "clf-c02": "data/clf-c02.json",
    "saa-c03": "data/saa-c03.json",
    "dva-c02": "data/dva-c02.json"
}

def regenerar_arquivo(cert_id, arquivo_path):
    """Regenera todas as questões de um arquivo JSON"""
    print(f"\n{'='*70}")
    print(f"REGENERANDO: {cert_id.upper()}")
    print(f"{'='*70}")
    
    # 1. Backup do arquivo original
    backup_path = arquivo_path.replace('.json', '_backup_pt.json')
    if os.path.exists(arquivo_path):
        with open(arquivo_path, 'r', encoding='utf-8') as f:
            original = json.load(f)
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(original, f, ensure_ascii=False, indent=2)
        print(f"✅ Backup salvo: {backup_path}")
        total_questoes = len(original)
    else:
        print(f"⚠️  Arquivo não existe, será criado: {arquivo_path}")
        total_questoes = 50  # Valor padrão
    
    # 2. Gerar novas questões
    novas_questoes = []
    questoes_por_lote = 10
    lotes = (total_questoes // questoes_por_lote) + (1 if total_questoes % questoes_por_lote > 0 else 0)
    
    for i in range(lotes):
        qtd = min(questoes_por_lote, total_questoes - len(novas_questoes))
        if qtd <= 0:
            break
            
        print(f"\n🔄 Gerando lote {i+1}/{lotes} ({qtd} questões)...")
        resultado = fabricar_questoes(cert_id, "medium", qtd)
        
        if resultado:
            # A validação já é feita dentro de fabricar_questoes()
            novas_questoes.extend(resultado)
            print(f"  ✅ {len(resultado)} questões válidas geradas")
        else:
            print(f"  ❌ Falha ao gerar lote {i+1}")
    
    # 3. Salvar arquivo regenerado
    if len(novas_questoes) > 0:
        with open(arquivo_path, 'w', encoding='utf-8') as f:
            json.dump(novas_questoes, f, ensure_ascii=False, indent=2)
        print(f"\n✅ Arquivo regenerado: {arquivo_path} ({len(novas_questoes)} questões)")
        return True
    else:
        print(f"\n❌ Nenhuma questão válida gerada para {cert_id}")
        return False

def main():
    """Função principal"""
    print("="*70)
    print("REGENERAÇÃO DE QUESTÕES - PORTUGUÊS BRASILEIRO")
    print("="*70)
    print()
    print("Este script irá regenerar TODAS as questões dos arquivos JSON")
    print("usando o prompt corrigido com português brasileiro.")
    print()
    
    # Perguntar ao usuário quais arquivos regenerar
    print("Arquivos disponíveis:")
    for i, (cert_id, arquivo) in enumerate(ARQUIVOS_DADOS.items(), 1):
        print(f"  {i}. {cert_id.upper()} ({arquivo})")
    print(f"  {len(ARQUIVOS_DADOS)+1}. TODOS os arquivos")
    print()
    
    escolha = input("Escolha uma opção (1-5): ").strip()
    
    if escolha == str(len(ARQUIVOS_DADOS)+1):
        # Regenerar todos
        arquivos_para_regenerar = list(ARQUIVOS_DADOS.items())
    elif escolha.isdigit() and 1 <= int(escolha) <= len(ARQUIVOS_DADOS):
        # Regenerar apenas um
        cert_id = list(ARQUIVOS_DADOS.keys())[int(escolha)-1]
        arquivos_para_regenerar = [(cert_id, ARQUIVOS_DADOS[cert_id])]
    else:
        print("❌ Opção inválida!")
        return 1
    
    # Confirmar
    print()
    print(f"⚠️  ATENÇÃO: Você está prestes a regenerar {len(arquivos_para_regenerar)} arquivo(s).")
    print("   Backups serão criados automaticamente.")
    confirma = input("Deseja continuar? (s/N): ").strip().lower()
    
    if confirma != 's':
        print("❌ Operação cancelada pelo usuário.")
        return 0
    
    # Regenerar arquivos selecionados
    sucesso_total = 0
    for cert_id, arquivo_rel in arquivos_para_regenerar:
        arquivo_path = os.path.join(BASE_DIR, arquivo_rel)
        if regenerar_arquivo(cert_id, arquivo_path):
            sucesso_total += 1
    
    print()
    print("="*70)
    print(f"✅ REGENERAÇÃO COMPLETA!")
    print(f"   {sucesso_total}/{len(arquivos_para_regenerar)} arquivos regenerados com sucesso")
    print("="*70)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
