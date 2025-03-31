from typing import Optional
from sqlalchemy.sql import text

# Common
from app.database import db

# Managers
from .entity import ManagerEntity

class ManagersRepository:
    def find_by_email(self, email: str) -> Optional[ManagerEntity]:
        with db.connect() as connection:
            result = connection.execute(text("""
                SELECT 
                    m.id, 
                    m."idAgencia" AS "idAgencia",
                    m.nome AS nome,
                    m.cpf AS cpf,
                    m.telefone AS telefone,
                    m."dataDeNascimento" AS "dataDeNascimento",
                    m.email AS email,
                    m.senha AS senha,
                    m."dataDeCriacao" AS "dataDeCriacao",
                    m."dataDeAtualizacao" AS "dataDeAtualizacao"
                FROM "Gerente" m
                WHERE m.email = :email LIMIT 1
            """), {"email": email})
            row = result.mappings().first()
            return dict(row) if row else None

    def find_all(self, quantidade: int):
        with db.connect() as connection:
            result = connection.execute(text("""
                SELECT * FROM "Gerente" LIMIT :quantidade
            """), {"quantidade": quantidade})
            rows = result.mappings().all()
            return [dict(row) for row in rows]