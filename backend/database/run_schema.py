"""
Aplica o schema.sql no banco PostgreSQL configurado em config.py.
Uso: python backend/database/run_schema.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

import psycopg2
from config import DATABASE_CONFIG, DATABASE_URL

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")


def ensure_database_exists():
    """Cria o banco de dados se ele ainda não existir."""
    admin_cfg = {**DATABASE_CONFIG, "database": "postgres"}
    conn = psycopg2.connect(**admin_cfg)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM pg_database WHERE datname = %s;",
        (DATABASE_CONFIG["database"],)
    )
    exists = cur.fetchone()
    if not exists:
        cur.execute(f'CREATE DATABASE "{DATABASE_CONFIG["database"]}";')
        print(f"  ✅ Banco '{DATABASE_CONFIG['database']}' criado.")
    else:
        print(f"  ℹ️  Banco '{DATABASE_CONFIG['database']}' já existe.")
    cur.close()
    conn.close()


def apply_schema():
    """Lê e executa o schema.sql no banco configurado."""
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        sql = f.read()

    conn = psycopg2.connect(**DATABASE_CONFIG)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        cur.execute(sql)
        conn.commit()
        print("  ✅ schema.sql aplicado com sucesso.")
    except Exception as e:
        conn.rollback()
        print(f"  ❌ Erro ao aplicar schema: {e}")
        raise
    finally:
        cur.close()
        conn.close()


def verify_schema():
    """Verifica se as tabelas e views foram criadas corretamente."""
    expected_tables = [
        "users", "domains", "questions",
        "quiz_history", "answers", "gamification", "focus_sessions"
    ]
    expected_views = ["leaderboard", "user_stats"]

    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor()

    print("\n  📋 Tabelas:")
    for table in expected_tables:
        cur.execute(
            "SELECT EXISTS (SELECT 1 FROM information_schema.tables "
            "WHERE table_schema='public' AND table_name=%s);",
            (table,)
        )
        exists = cur.fetchone()[0]
        status = "✅" if exists else "❌"
        print(f"    {status} {table}")

    print("\n  👁️  Views:")
    for view in expected_views:
        cur.execute(
            "SELECT EXISTS (SELECT 1 FROM information_schema.views "
            "WHERE table_schema='public' AND table_name=%s);",
            (view,)
        )
        exists = cur.fetchone()[0]
        status = "✅" if exists else "❌"
        print(f"    {status} {view}")

    print("\n  🌱 Dados iniciais (domains):")
    cur.execute("SELECT COUNT(*) FROM domains;")
    count = cur.fetchone()[0]
    status = "✅" if count > 0 else "❌"
    print(f"    {status} {count} domínios inseridos")

    cur.close()
    conn.close()


if __name__ == "__main__":
    print("=" * 60)
    print("  Aplicando schema.sql")
    print(f"  Banco: {DATABASE_CONFIG['database']} @ {DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}")
    print("=" * 60)

    print("\n[1/3] Verificando banco de dados...")
    ensure_database_exists()

    print("\n[2/3] Aplicando schema...")
    apply_schema()

    print("\n[3/3] Verificando estrutura criada...")
    verify_schema()

    print("\n" + "=" * 60)
    print("  Concluído.")
    print("=" * 60)
