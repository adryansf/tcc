from typing import Optional

# Common
from app.database import db

# Managers
from .entity import ManagerEntity

class ManagersRepository:
    def __init__(self):
        self._db = db

    def find_by_email(self, email: str) -> Optional[ManagerEntity]:
        with self._db.cursor() as cursor:
            cursor.execute("""
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
                WHERE m.email = %s LIMIT 1
            """, [email])

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None
