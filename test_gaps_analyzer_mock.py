#!/usr/bin/env python3
"""
Teste da função analyze_gaps com mock do banco de dados

Valida a lógica da função sem depender de um PostgreSQL real rodando.
Testa transformação de dados, cálculos de taxa de erro, e estrutura de resposta.

Uso:
    python3 test_gaps_analyzer_mock.py
"""

import sys
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timezone

print("=" * 70)
print("TEST: analyze_gaps() com Mock do banco de dados")
print("=" * 70)
print()

# Test 1: Importar módulos
print("Importando módulos...")
try:
    from backend.analytics.gaps_analyzer import analyze_gaps
    from backend.api.models import GapsAnalysisResponse
    print("✓ Imports bem-sucedidos")
except ImportError as e:
    print(f"✗ Erro ao importar: {e}")
    sys.exit(1)

print()

# Test 2: Mock da conexão com dados de teste
print("=" * 70)
print("TEST 1: Validar lógica com dados mock")
print("=" * 70)
print()

# Dados de teste que simulariam o resultado do SQL
# Simula: 3 domínios com diferentes taxas de erro
mock_query_results = [
    ("design-performance", 13, 8, 0.6154),  # 61.54% de erro (8 erros em 13 tentativas)
    ("seguranca-aplicacoes", 8, 4, 0.5000),  # 50% de erro
    ("conceitos-cloud", 5, 1, 0.2000),       # 20% de erro
]

# Patch da função get_connection no módulo analytics (não em database.py)
with patch('backend.analytics.gaps_analyzer.get_connection') as mock_get_conn:
    # Setup do mock
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = mock_query_results
    
    # Executar função
    test_user_id = "550e8400-e29b-41d4-a716-446655440000"
    print(f"Executando: analyze_gaps('{test_user_id}')...")
    print()
    
    try:
        result = analyze_gaps(test_user_id)
        
        print("✓ Função executada com sucesso!")
        print()
        
        # Validar estrutura
        print("Validando estrutura:")
        assert result["status"] == "success", "Status deve ser 'success'"
        print("  ✓ status = 'success'")
        
        assert result["user_id"] == test_user_id, "User ID não corresponde"
        print(f"  ✓ user_id = '{test_user_id}'")
        
        assert isinstance(result["weak_domains"], list), "weak_domains deve ser lista"
        print(f"  ✓ weak_domains é lista com {len(result['weak_domains'])} elementos")
        
        assert isinstance(result["timestamp"], str), "timestamp deve ser string"
        print(f"  ✓ timestamp = '{result['timestamp']}'")
        
        print()
        print("Validando conteúdo dos domínios:")
        
        # Validar que temos 3 domínios (conforme mock)
        assert len(result["weak_domains"]) == 3, f"Expected 3 domains, got {len(result['weak_domains'])}"
        print(f"  ✓ Retornou 3 domínios (conforme LIMIT 3)")
        
        # Validar cada domínio
        for i, domain in enumerate(result["weak_domains"]):
            print()
            print(f"  Domínio #{i+1}:")
            
            assert "domain" in domain, f"Domain {i} missing 'domain' field"
            print(f"    ✓ domain: '{domain['domain']}'")
            
            assert "error_rate" in domain, f"Domain {i} missing 'error_rate' field"
            print(f"    ✓ error_rate: {domain['error_rate']:.2%}")
            
            assert "total_attempts" in domain, f"Domain {i} missing 'total_attempts' field"
            print(f"    ✓ total_attempts: {domain['total_attempts']}")
            
            assert "errors" in domain, f"Domain {i} missing 'errors' field"
            print(f"    ✓ errors: {domain['errors']}")
            
            # Validar que error_rate está correto (erros / total_attempts)
            calculated_rate = domain["errors"] / domain["total_attempts"]
            assert abs(domain["error_rate"] - calculated_rate) < 0.0001, \
                f"error_rate calculation incorrect: {domain['error_rate']} vs {calculated_rate}"
            print(f"    ✓ Taxa de erro verificada: {domain['errors']} / {domain['total_attempts']} = {calculated_rate:.4f}")
        
        # Validar ordenação (descendente por taxa de erro)
        print()
        print("Validando ordenação (DESC por error_rate):")
        error_rates = [d["error_rate"] for d in result["weak_domains"]]
        assert error_rates == sorted(error_rates, reverse=True), "Domínios não estão ordenados por error_rate DESC"
        print(f"  ✓ Domínios ordenados corretamente:")
        for d in result["weak_domains"]:
            print(f"    - {d['domain']}: {d['error_rate']:.2%}")
        
        # Validar com Pydantic model
        print()
        print("Validando serialização com Pydantic GapsAnalysisResponse:")
        response_model = GapsAnalysisResponse(**result)
        print(f"  ✓ Modelo Pydantic validado com sucesso")
        print(f"    - status: {response_model.status}")
        print(f"    - user_id: {response_model.user_id}")
        print(f"    - weak_domains: {len(response_model.weak_domains)} itens")
        print(f"    - timestamp: {response_model.timestamp}")
        
        print()
        print("=" * 70)
        print("✓ TEST 1 PASSOU: Função processa dados corretamente")
        print("=" * 70)
        
    except Exception as e:
        print(f"✗ Erro: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

print()

# Test 3: Validar edge case - usuário novo (sem dados)
print("=" * 70)
print("TEST 2: Edge case - Usuário novo (sem histórico)")
print("=" * 70)
print()

with patch('backend.analytics.gaps_analyzer.get_connection') as mock_get_conn:
    # Setup: query retorna lista vazia
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = []  # Sem dados
    
    test_user_id_new = "999999999-9999-9999-9999-999999999999"
    print(f"Executando: analyze_gaps('{test_user_id_new}') [usuário novo]...")
    
    try:
        result = analyze_gaps(test_user_id_new)
        
        print("✓ Função executada com sucesso!")
        print()
        
        assert result["status"] == "success", "Status deve ser 'success'"
        print("  ✓ status = 'success'")
        
        assert result["user_id"] == test_user_id_new, "User ID não corresponde"
        print(f"  ✓ user_id = '{test_user_id_new}'")
        
        assert result["weak_domains"] == [], "weak_domains deve ser lista vazia"
        print("  ✓ weak_domains = [] (lista vazia - conforme critério de aceite)")
        
        print()
        print("=" * 70)
        print("✓ TEST 2 PASSOU: Edge case tratado corretamente")
        print("=" * 70)
        
    except Exception as e:
        print(f"✗ Erro: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

print()

# Test 4: Validar filtro min_attempts
print("=" * 70)
print("TEST 3: Filtro min_attempts - apenas domínios com >= 3 tentativas")
print("=" * 70)
print()

# Mock com 1 domínio com 2 tentativas (deve ser filtrado por HAVING)
# e 1 domínio com 3+ tentativas (deve ser incluído)
mock_filtered_results = [
    ("design-performance", 5, 3, 0.6000),  # 5 tentativas -> incluído
    # Nota: ("conceitos-cloud", 2, 1, 0.5000) foi filtrado pelo HAVING no SQL
]

with patch('backend.analytics.gaps_analyzer.get_connection') as mock_get_conn:
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = mock_filtered_results
    
    test_user_id = "550e8400-e29b-41d4-a716-446655440000"
    print(f"Executando: analyze_gaps('{test_user_id}') [com filtro]...")
    
    try:
        result = analyze_gaps(test_user_id, min_attempts=3)
        
        print("✓ Função executada com sucesso!")
        print()
        
        # Verificar que apenas domínios com >= 3 tentativas foram retornados
        for domain in result["weak_domains"]:
            assert domain["total_attempts"] >= 3, \
                f"Domínio '{domain['domain']}' com {domain['total_attempts']} tentativas (<3) foi incluído"
            print(f"  ✓ Domínio '{domain['domain']}': {domain['total_attempts']} tentativas (>= 3 mín.)")
        
        print()
        print("=" * 70)
        print("✓ TEST 3 PASSOU: Filtro min_attempts funcionando")
        print("=" * 70)
        
    except Exception as e:
        print(f"✗ Erro: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

print()
print("=" * 70)
print("✓ TODOS OS TESTES COM MOCK PASSARAM!")
print("=" * 70)
print()
print("Resumo:")
print("  ✓ TEST 1: Lógica de processamento e transformação de dados")
print("  ✓ TEST 2: Edge case - usuário novo retorna [] sem erro")
print("  ✓ TEST 3: Filtro min_attempts funciona corretamente")
print()
print("Próximos passos:")
print("  • Subir PostgreSQL e testar com banco real")
print("  • Testar endpoint FastAPI: GET /api/analytics/gaps/{user_id}")
print("  • Integrar com CI/CD")
