"""
Configuração de conexão com PostgreSQL
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Configurações do banco de dados
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'database': os.getenv('DB_NAME', 'aws_simulator'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres'),
}

# String de conexão
DATABASE_URL = f"postgresql://{DATABASE_CONFIG['user']}:{DATABASE_CONFIG['password']}@{DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}/{DATABASE_CONFIG['database']}"

# Configurações de desenvolvimento
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')
