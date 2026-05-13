"""
EduTech Pro - Modelos do Banco de Dados
Tabela: documents
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class Document(Base):
    """
    Representa um PDF processado pelo sistema.

    Campos:
    - id         : Chave primária auto-incrementada
    - file_id    : UUID único para identificação do arquivo físico
    - filename   : Nome original do arquivo enviado
    - summary    : Resumo gerado pela IA via RAG
    - created_at : Data/hora de criação (preenchida automaticamente)
    """

    __tablename__ = "documents"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_id    = Column(String(36), unique=True, index=True, nullable=False)
    filename   = Column(String(255), nullable=False)
    summary    = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Document id={self.id} filename='{self.filename}'>"
