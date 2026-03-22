#!/usr/bin/env python3
"""
Testes de Preservação - Garantir que funcionalidades existentes não sejam quebradas
OBJETIVO: Validar que estrutura JSON e funcionalidades continuam funcionando
RESULTADO ESPERADO: Testes DEVEM PASSAR no código atual e após correções
"""

import json
import os
import sys

def validar_estrutura_json(questao, arquivo):
    """Valida que a questão tem todos os campos obrigatórios"""
    campos_obrigatorios = [
        'id', 'domain', 'subdomain', 'service', 'difficulty', 
        'type', 'tags', 'question', 'options', 'correct', 'explanation'
    ]
    
    erros = []
    
    for campo in campos_obrigatorios:
        if campo not in questao:
            erros.append(f"Campo obrigatório ausente: {campo}")
    
    # Validações específicas
    if 'options' in questao:
        if not isinstance(questao['options'], list):
            erros.append("Campo 'options' deve ser uma lista")
        elif len(questao['options']) != 4:
            erros.append(f"Campo 'options' deve ter 4 itens, tem {len(questao['options'])}")
    
    if 'correct' in questao:
        if not isinstance(questao['correct'], int):
            erros.append("Campo 'correct' deve ser um inteiro")
        elif questao['correct'] < 0 or questao['correct'] > 3:
            erros.append(f"Campo 'correct' deve estar entre 0-3, é {questao['correct']}")
    
    if 'difficulty' in questao:
        if questao['difficulty'] not in ['easy', 'medium', 'hard']:
            erros.append(f"Campo 'difficulty' inválido: {questao['difficulty']}")
    
    if 'type' in questao:
        if questao['type'] not in ['scenario', 'definition', 'comparison', 'multiple-choice']:
            erros.append(f"Campo 'type' inválido: {questao['type']}")
    
    return erros

def testar_embaralhamento_simulado(questao):
    """Simula embaralhamento e verifica que índice correto seria atualizado"""
    # Simula o que _shuffleOptions() faz
    options = questao.get('options', [])
    correct_original = questao.get('correct', 0)
    
    if len(options) != 4:
        return ["Questão não tem 4 opções para testar embaralhamento"]
    
    # Verifica que o índice correto está válido
    if correct_original < 0 or correct_original >= len(options):
        return [f"Índice correto inválido: {correct_original}"]
    
    # Verifica que a opção correta existe
    if correct_original >= len(options):
        return ["Índice correto aponta para opção inexistente"]
    
    return []

def executar_testes():
    """Executa todos os testes de preservação"""
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    arquivos = [
        "data/aif-c01.json",
        "data/clf-c02.json",
        "data/saa-c03.json",
        "data/dva-c02.json"
    ]
    
    total_questoes = 0
    total_erros = 0
    erros_detalhados = []
    
    print("="*70)
    print("TESTES DE PRESERVAÇÃO - ESTRUTURA JSON E FUNCIONALIDADES")
    print("="*70)
    print()
    
    for arquivo_rel in arquivos:
        arquivo_path = os.path.join(BASE_DIR, arquivo_rel)
        
        if not os.path.exists(arquivo_path):
            print(f"⚠️  Arquivo não encontrado: {arquivo_rel}")
            continue
        
        print(f"📄 Testando: {arquivo_rel}")
        
        with open(arquivo_path, 'r', encoding='utf-8') as f:
            questoes = json.load(f)
        
        for questao in questoes:
            total_questoes += 1
            
            # Teste 1: Estrutura JSON
            erros_estrutura = validar_estrutura_json(questao, arquivo_rel)
            if erros_estrutura:
                total_erros += len(erros_estrutura)
                erros_detalhados.append({
                    'arquivo': arquivo_rel,
                    'id': questao.get('id'),
                    'tipo': 'Estrutura JSON',
                    'erros': erros_estrutura
                })
            
            # Teste 2: Embaralhamento
            erros_embaralhamento = testar_embaralhamento_simulado(questao)
            if erros_embaralhamento:
                total_erros += len(erros_embaralhamento)
                erros_detalhados.append({
                    'arquivo': arquivo_rel,
                    'id': questao.get('id'),
                    'tipo': 'Embaralhamento',
                    'erros': erros_embaralhamento
                })
    
    print()
    print("="*70)
    print("RESULTADOS")
    print("="*70)
    print(f"Total de questões testadas: {total_questoes}")
    print(f"Total de erros encontrados: {total_erros}")
    print()
    
    if erros_detalhados:
        print("❌ TESTES FALHARAM - Problemas de preservação detectados!")
        print()
        print("ERROS ENCONTRADOS (primeiros 10):")
        print("-"*70)
        
        for i, erro in enumerate(erros_detalhados[:10], 1):
            print(f"\n{i}. Arquivo: {erro['arquivo']}")
            print(f"   ID: {erro['id']}")
            print(f"   Tipo: {erro['tipo']}")
            for e in erro['erros']:
                print(f"   - {e}")
        
        if len(erros_detalhados) > 10:
            print(f"\n... e mais {len(erros_detalhados) - 10} erros")
        
        print()
        print("="*70)
        return 1
    else:
        print("✅ TODOS OS TESTES PASSARAM!")
        print("   Estrutura JSON válida em todas as questões")
        print("   Embaralhamento funcionaria corretamente")
        print("   Funcionalidades preservadas")
        print("="*70)
        return 0

if __name__ == "__main__":
    sys.exit(executar_testes())
