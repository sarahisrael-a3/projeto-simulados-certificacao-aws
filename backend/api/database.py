"""
Conexão com PostgreSQL
"""

import psycopg2

from backend.database.config import DATABASE_CONFIG


def get_connection():
    """
    Retorna uma conexão ativa com PostgreSQL.
    """

    return psycopg2.connect(
        host=DATABASE_CONFIG["host"],
        port=DATABASE_CONFIG["port"],
        database=DATABASE_CONFIG["database"],
        user=DATABASE_CONFIG["user"],
        password=DATABASE_CONFIG["password"]
    )