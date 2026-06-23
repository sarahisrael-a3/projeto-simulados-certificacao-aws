#!/usr/bin/env python3
"""
Teste da função analyze_gaps do módulo backend.analytics.gaps_analyzer

Fornece testes manuais para validar:
1. Import do módulo
2. Validação de UUID
3. Execução da função com um user_id válido
4. Resposta JSON estruturada corretamente
5. Edge cases (usuário sem histórico, etc)

Uso:
    python3 test_gaps_analyzer.py
"""

import sys
import json
from uuid import uuid4

# Verificar se os módulos podem ser importados
print("=" * 70)
print("TEST 1: Verificando imports do módulo analytics")
print("=" * 70)

try:
    from backend.analytics.gaps_analyzer import analyze_gaps, validate_uuid
    print("✓ Imports bem-sucedidos: analyze_gaps, validate_uuid")
except ImportError as e:
    print(f"✗ Erro ao importar: {e}")
    sys.exit(1)

try:
    from backend.api.models import GapsAnalysisResponse, WeakDomain
    print("✓ Imports bem-sucedidos: GapsAnalysisResponse, WeakDomain")
except ImportError as e:
    print(f"✗ Erro ao importar models: {e}")
    sys.exit(1)

print()

# Teste 2: Validação de UUID
print("=" * 70)
print("TEST 2: Validando função validate_uuid()")
print("=" * 70)

test_cases = [
    ("550e8400-e29b-41d4-a716-446655440000", True, "UUID v4 válido"),
    ("invalid-uuid", False, "String inválida"),
    ("", False, "String vazia"),
    (str(uuid4()), True, "UUID gerado dinamicamente"),
]

for test_input, expected, description in test_cases:
    result = validate_uuid(test_input)
    status = "✓" if result == expected else "✗"
    print(f"{status} {description}: validate_uuid('{test_input[:20]}...') = {result}")

print()

# Teste 3: Teste de função com user_id válido
print("=" * 70)
print("TEST 3: Executando analyze_gaps() com user_id válido")
print("=" * 70)

# Gerar um user_id de teste
test_user_id = str(uuid4())
print(f"User ID de teste: {test_user_id}")
print()

try:
    print("Executando: result = analyze_gaps(test_user_id)...")
    result = analyze_gaps(test_user_id)
    
    print("✓ Função executada com sucesso!")
    print()
    
    # Validar estrutura da resposta
    print("Validando estrutura da resposta JSON:")
    
    required_keys = ["status", "user_id", "weak_domains", "timestamp"]
    for key in required_keys:
        if key in result:
            print(f"  ✓ Campo '{key}' presente")
        else:
            print(f"  ✗ Campo '{key}' FALTANDO!")
    
    print()
    print("Resposta JSON:")
    print(json.dumps(result, indent=2))
    
    # Validar tipos de dados
    print()
    print("Validando tipos de dados:")
    assert isinstance(result["status"], str), "status deve ser string"
    print("  ✓ status é string")
    
    assert isinstance(result["user_id"], str), "user_id deve ser string"
    print("  ✓ user_id é string")
    
    assert isinstance(result["weak_domains"], list), "weak_domains deve ser lista"
    print("  ✓ weak_domains é lista")
    
    assert isinstance(result["timestamp"], str), "timestamp deve ser string"
    print("  ✓ timestamp é string")
    
    # Validar estrutura de cada domínio fraco
    if result["weak_domains"]:
        print()
        print(f"Validando estrutura de cada domínio ({len(result['weak_domains'])} encontrados):")
        for domain in result["weak_domains"]:
            domain_keys = ["domain", "error_rate", "total_attempts", "errors"]
            for key in domain_keys:
                assert key in domain, f"Domínio missing key: {key}"
            print(f"  ✓ Domínio '{domain['domain']}' tem estrutura válida")
            print(f"    - error_rate: {domain['error_rate']:.2%}")
            print(f"    - total_attempts: {domain['total_attempts']}")
            print(f"    - errors: {domain['errors']}")
    else:
        print()
        print("ℹ  Nenhum domínio fraco encontrado (usuário novo ou sem 3+ tentativas em algum domínio)")
    
    print()
    print("✓ TEST 3 PASSOU: Função retorna estrutura JSON válida")

except Exception as e:
    print(f"✗ Erro ao executar analyze_gaps: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print()

# Teste 4: Validação de model Pydantic
print("=" * 70)
print("TEST 4: Validando model Pydantic GapsAnalysisResponse")
print("=" * 70)

try:
    # Tentar criar instância válida do model
    response_model = GapsAnalysisResponse(**result)
    print("✓ Resultado é serializável como GapsAnalysisResponse")
    print(f"  - Status: {response_model.status}")
    print(f"  - User ID: {response_model.user_id}")
    print(f"  - Weak domains count: {len(response_model.weak_domains)}")
    print(f"  - Timestamp: {response_model.timestamp}")
except Exception as e:
    print(f"✗ Erro ao validar model Pydantic: {e}")
    sys.exit(1)

print()
print("=" * 70)
print("✓ TODOS OS TESTES PASSARAM!")
print("=" * 70)
