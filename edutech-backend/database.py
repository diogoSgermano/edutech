"""
EduTech Pro - Configuração do Banco de Dados
SQLAlchemy + MySQL (PyMySQL driver)
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# URL de conexão — lida do .env ou usa o padrão local
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/edutech_pro",
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # Reconecta automaticamente se a conexão cair
    pool_recycle=3600,        # Recicla conexões após 1 hora
    echo=False,               # Coloque True para ver SQL no console (debug)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
