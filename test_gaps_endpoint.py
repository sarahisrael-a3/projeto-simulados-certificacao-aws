#!/usr/bin/env python3
"""
Teste do endpoint FastAPI GET /api/analytics/gaps/{user_id}

Valida a integração entre endpoint, modelo Pydantic e função analytics.

Uso:
    python3 test_gaps_endpoint.py
"""

import sys
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

print("=" * 70)
print("TEST: Endpoint FastAPI GET /api/analytics/gaps/{user_id}")
print("=" * 70)
print()

# Test 1: Importar e criar cliente de teste
print("Importando módulos...")
try:
    from backend.api.main import app
    print("✓ Import de app bem-sucedido")
except ImportError as e:
    print(f"✗ Erro ao importar app: {e}")
    sys.exit(1)

print("Criando TestClient...")
client = TestClient(app)
print("✓ TestClient criado")

print()

# Test 2: Health check
print("=" * 70)
print("TEST 1: Health check do servidor")
print("=" * 70)
print()

response = client.get("/")
assert response.status_code == 200, f"Expected 200, got {response.status_code}"
data = response.json()
assert data["status"] == "online", "Status deve ser 'online'"
assert "AWS Simulator API" in data["service"], "Service name incorreto"
print(f"✓ GET / retornou 200 OK")
print(f"  Status: {data['status']}")
print(f"  Service: {data['service']}")

print()

# Test 3: Endpoint com UUID válido e dados mock
print("=" * 70)
print("TEST 2: Endpoint com UUID válido (mock data)")
print("=" * 70)
print()

mock_query_results = [
    ("design-performance", 13, 8, 0.6154),
    ("seguranca-aplicacoes", 8, 4, 0.5000),
]

with patch('backend.analytics.gaps_analyzer.get_connection') as mock_get_conn:
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = mock_query_results
    
    test_user_id = "550e8400-e29b-41d4-a716-446655440000"
    print(f"Executando: GET /api/analytics/gaps/{test_user_id}")
    print()
    
    response = client.get(f"/api/analytics/gaps/{test_user_id}")
    
    print(f"Status: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print("✓ Retornou 200 OK")
    
    data = response.json()
    print()
    print("Validando resposta JSON:")
    
    assert data["status"] == "success", "Status deve ser 'success'"
    print(f"  ✓ status: {data['status']}")
    
    assert data["user_id"] == test_user_id, "User ID não corresponde"
    print(f"  ✓ user_id: {data['user_id']}")
    
    assert isinstance(data["weak_domains"], list), "weak_domains deve ser lista"
    print(f"  ✓ weak_domains: lista com {len(data['weak_domains'])} elementos")
    
    assert isinstance(data["timestamp"], str), "timestamp deve ser string"
    print(f"  ✓ timestamp: {data['timestamp']}")
    
    print()
    print("Domínios fracos retornados:")
    for domain in data["weak_domains"]:
        print(f"  • {domain['domain']}: {domain['error_rate']:.2%} erro ({domain['errors']}/{domain['total_attempts']})")

print()

# Test 4: UUID inválido (deve retornar 400)
print("=" * 70)
print("TEST 3: UUID inválido (esperado 400 Bad Request)")
print("=" * 70)
print()

invalid_user_id = "invalid-uuid"
print(f"Executando: GET /api/analytics/gaps/{invalid_user_id}")
print()

response = client.get(f"/api/analytics/gaps/{invalid_user_id}")

print(f"Status: {response.status_code}")
assert response.status_code == 400, f"Expected 400, got {response.status_code}"
print("✓ Retornou 400 Bad Request (esperado)")

data = response.json()
assert "detail" in data, "Resposta deve ter 'detail'"
print(f"  Detail: {data['detail']}")

print()

# Test 5: Usuário sem histórico
print("=" * 70)
print("TEST 4: Usuário sem histórico (weak_domains vazio)")
print("=" * 70)
print()

with patch('backend.analytics.gaps_analyzer.get_connection') as mock_get_conn:
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = []  # Sem dados
    
    test_user_id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    print(f"Executando: GET /api/analytics/gaps/{test_user_id}")
    print()
    
    response = client.get(f"/api/analytics/gaps/{test_user_id}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print("✓ Retornou 200 OK")
    
    data = response.json()
    assert data["weak_domains"] == [], "weak_domains deve ser vazio"
    print("✓ weak_domains = [] (conforme critério de aceite para usuário novo)")
    
    print()
    print("Resposta completa:")
    import json
    print(json.dumps(data, indent=2))

print()

# Test 6: Resposta valida Content-Type
print("=" * 70)
print("TEST 5: Validar Content-Type")
print("=" * 70)
print()

with patch('backend.analytics.gaps_analyzer.get_connection') as mock_get_conn:
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = []
    
    test_user_id = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    response = client.get(f"/api/analytics/gaps/{test_user_id}")
    
    assert "application/json" in response.headers.get("content-type", ""), \
        "Content-Type deve ser application/json"
    print(f"✓ Content-Type: {response.headers.get('content-type')}")

print()
print("=" * 70)
print("✓ TODOS OS TESTES DO ENDPOINT PASSARAM!")
print("=" * 70)
print()
print("Resumo dos testes:")
print("  ✓ TEST 1: Health check funcionando")
print("  ✓ TEST 2: Endpoint com dados mock retorna 200 + JSON válido")
print("  ✓ TEST 3: UUID inválido retorna 400 Bad Request")
print("  ✓ TEST 4: Usuário novo retorna 200 com weak_domains=[]")
print("  ✓ TEST 5: Content-Type correto (application/json)")
print()
print("Próximos passos:")
print("  • Executar suite Jest existente: npm test")
print("  • Testar com PostgreSQL real rodando")
print("  • Validar integração end-to-end")
