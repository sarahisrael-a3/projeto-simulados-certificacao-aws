"""
Testes para backend/database/config.py
Valida carregamento de variáveis, formato da URL e conectividade com o banco.
"""
import sys
import os

# Garante que o módulo config seja encontrado
sys.path.insert(0, os.path.dirname(__file__))

import unittest
from unittest.mock import patch


class TestConfigLoading(unittest.TestCase):
    """Testa o carregamento e os valores padrão do config.py."""

    def setUp(self):
        # Remove o módulo do cache para forçar reimportação em cada teste
        if "config" in sys.modules:
            del sys.modules["config"]

    def test_database_config_has_required_keys(self):
        """DATABASE_CONFIG deve conter todas as chaves obrigatórias."""
        from config import DATABASE_CONFIG
        required_keys = {"host", "port", "database", "user", "password"}
        self.assertEqual(required_keys, set(DATABASE_CONFIG.keys()))

    def test_default_values_without_env(self):
        """Sem variáveis de ambiente, os defaults devem ser aplicados."""
        env_clean = {k: v for k, v in os.environ.items()
                     if k not in ("DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD")}
        with patch.dict(os.environ, env_clean, clear=True):
            if "config" in sys.modules:
                del sys.modules["config"]
            from config import DATABASE_CONFIG
            self.assertEqual(DATABASE_CONFIG["host"],     "localhost")
            self.assertEqual(DATABASE_CONFIG["port"],     5432)
            self.assertEqual(DATABASE_CONFIG["database"], "aws_simulator")
            self.assertEqual(DATABASE_CONFIG["user"],     "postgres")
            self.assertEqual(DATABASE_CONFIG["password"], "postgres")

    def test_port_is_integer(self):
        """DB_PORT deve ser convertido para int."""
        from config import DATABASE_CONFIG
        self.assertIsInstance(DATABASE_CONFIG["port"], int)

    def test_database_url_format(self):
        """DATABASE_URL deve seguir o formato postgresql://user:pass@host:port/db."""
        from config import DATABASE_URL, DATABASE_CONFIG
        self.assertTrue(DATABASE_URL.startswith("postgresql://"),
                        f"URL inválida: {DATABASE_URL}")
        self.assertIn(DATABASE_CONFIG["host"],     DATABASE_URL)
        self.assertIn(str(DATABASE_CONFIG["port"]), DATABASE_URL)
        self.assertIn(DATABASE_CONFIG["database"], DATABASE_URL)

    def test_debug_is_boolean(self):
        """DEBUG deve ser um booleano."""
        from config import DEBUG
        self.assertIsInstance(DEBUG, bool)

    def test_environment_is_string(self):
        """ENVIRONMENT deve ser uma string não vazia."""
        from config import ENVIRONMENT
        self.assertIsInstance(ENVIRONMENT, str)
        self.assertTrue(len(ENVIRONMENT) > 0)

    def test_custom_env_vars_override_defaults(self):
        """Variáveis de ambiente customizadas devem sobrescrever os defaults."""
        custom_env = {
            "DB_HOST":     "my-db-host",
            "DB_PORT":     "5433",
            "DB_NAME":     "my_database",
            "DB_USER":     "my_user",
            "DB_PASSWORD": "my_password",
            "DEBUG":       "True",
            "ENVIRONMENT": "production",
        }
        with patch.dict(os.environ, custom_env):
            if "config" in sys.modules:
                del sys.modules["config"]
            from config import DATABASE_CONFIG, DEBUG, ENVIRONMENT
            self.assertEqual(DATABASE_CONFIG["host"],     "my-db-host")
            self.assertEqual(DATABASE_CONFIG["port"],     5433)
            self.assertEqual(DATABASE_CONFIG["database"], "my_database")
            self.assertEqual(DATABASE_CONFIG["user"],     "my_user")
            self.assertEqual(DATABASE_CONFIG["password"], "my_password")
            self.assertTrue(DEBUG)
            self.assertEqual(ENVIRONMENT, "production")


class TestDatabaseConnectivity(unittest.TestCase):
    """Testa a conectividade real com o PostgreSQL."""

    @classmethod
    def setUpClass(cls):
        sys.path.insert(0, os.path.dirname(__file__))
        if "config" in sys.modules:
            del sys.modules["config"]
        from config import DATABASE_CONFIG
        cls.db_config = DATABASE_CONFIG

        try:
            import psycopg2
            cls.conn = psycopg2.connect(**cls.db_config)
            cls.db_available = True
        except Exception as e:
            cls.db_available = False
            cls.db_error = str(e)

    @classmethod
    def tearDownClass(cls):
        if getattr(cls, "db_available", False) and cls.conn:
            cls.conn.close()

    def _skip_if_no_db(self):
        if not self.db_available:
            self.skipTest(f"PostgreSQL indisponível: {self.db_error}")

    def test_connection_opens(self):
        """Deve conseguir abrir uma conexão com o banco."""
        self._skip_if_no_db()
        self.assertFalse(self.conn.closed, "Conexão deve estar aberta")

    def test_server_version(self):
        """Servidor deve ser PostgreSQL >= 13."""
        self._skip_if_no_db()
        major = self.conn.server_version // 10000
        self.assertGreaterEqual(major, 13,
                                f"Versão mínima esperada: 13, encontrada: {major}")

    def test_database_name(self):
        """Banco conectado deve ser o configurado."""
        self._skip_if_no_db()
        cur = self.conn.cursor()
        cur.execute("SELECT current_database();")
        db_name = cur.fetchone()[0]
        cur.close()
        self.assertEqual(db_name, self.db_config["database"])

    def test_extensions_available(self):
        """Extensões pgcrypto e pg_trgm devem estar disponíveis."""
        self._skip_if_no_db()
        cur = self.conn.cursor()
        for ext in ("pgcrypto", "pg_trgm"):
            cur.execute(
                "SELECT COUNT(*) FROM pg_available_extensions WHERE name = %s;",
                (ext,)
            )
            count = cur.fetchone()[0]
            self.assertGreater(count, 0, f"Extensão '{ext}' não disponível no servidor")
        cur.close()


if __name__ == "__main__":
    print("=" * 60)
    print("  Teste: backend/database/config.py")
    print("=" * 60)
    unittest.main(verbosity=2)
