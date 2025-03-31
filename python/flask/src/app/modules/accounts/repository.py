from typing import TypedDict
from uuid import UUID
from sqlalchemy import text, Connection
from app.database import db

from .enums.account_type import AccountTypeEnum

class ICreateAccountData(TypedDict):
    tipo: AccountTypeEnum
    idAgencia: UUID
    idCliente: UUID

class IQueryFindAllAccounts(TypedDict):
    cpf: str

class AccountsRepository:
    def create(self, data: ICreateAccountData):
        with db.connect() as connection:
            transaction = connection.begin()
            try:
                result = connection.execute(text("""
                    INSERT INTO "Conta" (tipo, "idAgencia", "idCliente") 
                    VALUES (:tipo, :idAgencia, :idCliente) 
                    RETURNING *
                """), {
                    "tipo": data["tipo"],
                    "idAgencia": data["idAgencia"],
                    "idCliente": data["idCliente"]
                })
                transaction.commit()
                row = result.mappings().first()
                return dict(row) if row else None
            except Exception:
                transaction.rollback()
                return None

    def find_all(self, query: IQueryFindAllAccounts):
        with db.connect() as connection:
            result = connection.execute(text("""
                SELECT 
                    c.id AS id,
                    c.numero AS numero,
                    c.tipo AS tipo,
                    c."dataDeCriacao" AS "dataDeCriacao",
                    c."dataDeAtualizacao" as "dataDeAtualizacao",
                    json_build_object(
                        'id', cli.id,
                        'nome', cli.nome,
                        'cpf', cli.cpf,
                        'dataDeNascimento', cli."dataDeNascimento",
                        'telefone', cli.telefone,
                        'email', cli.email,
                        'dataDeCriacao', cli."dataDeCriacao",
                        'dataDeAtualizacao', cli."dataDeAtualizacao"
                    ) AS cliente,
                    json_build_object(
                        'id', a.id,
                        'nome', a.nome,
                        'numero', a.numero,
                        'telefone', a.telefone,
                        'dataDeCriacao', a."dataDeCriacao",
                        'dataDeAtualizacao', a."dataDeAtualizacao"
                    ) AS agencia
                FROM "Conta" c
                JOIN "Cliente" cli ON c."idCliente" = cli.id
                JOIN "Agencia" a ON c."idAgencia" = a.id
                WHERE cli.cpf = :cpf
            """), {"cpf": query["cpf"]})
            rows = result.mappings().all()
            return [dict(row) for row in rows]

    def find_by_id(self, id: str, join: bool = False):
        with db.connect() as connection:
            base_query = '''
                SELECT 
                    c.id AS id,
                    c.numero AS numero,
                    c.saldo AS saldo,
                    c.tipo AS tipo,
                    c."idAgencia" AS "idAgencia",
                    c."idCliente" AS "idCliente",
                    c."dataDeCriacao" AS "dataDeCriacao",
                    c."dataDeAtualizacao" as "dataDeAtualizacao"
            '''
            if join:
                base_query += '''
                    ,json_build_object(
                        'id', cli.id,
                        'nome', cli.nome,
                        'cpf', cli.cpf,
                        'dataDeNascimento', cli."dataDeNascimento",
                        'telefone', cli.telefone,
                        'email', cli.email,
                        'dataDeCriacao', cli."dataDeCriacao",
                        'dataDeAtualizacao', cli."dataDeAtualizacao"
                    ) AS cliente,
                    json_build_object(
                        'id', a.id,
                        'nome', a.nome,
                        'numero', a.numero,
                        'telefone', a.telefone,
                        'dataDeCriacao', a."dataDeCriacao",
                        'dataDeAtualizacao', a."dataDeAtualizacao"
                    ) AS agencia
                '''
            base_query += ' FROM "Conta" c '
            if join:
                base_query += '''
                    JOIN "Cliente" cli ON c."idCliente" = cli.id
                    JOIN "Agencia" a ON c."idAgencia" = a.id
                '''
            base_query += ' WHERE c.id = :id LIMIT 1'

            query = text(base_query)
            result = connection.execute(query, {"id": id})
            row = result.mappings().first()
            return dict(row) if row else None

    def add_balance(self, id: str, value: float, trx: Connection):
        trx.execute(text("""
            UPDATE "Conta" SET saldo = saldo + :value WHERE id = :id
        """), {"value": value, "id": id})

    def remove_balance(self, id: str, value: float, trx: Connection):
        trx.execute(text("""
            UPDATE "Conta" SET saldo = saldo - :value WHERE id = :id
        """), {"value": value, "id": id})

    def delete(self, id: str):
        with db.connect() as connection:
            connection.execute(text("""
                DELETE FROM "Conta" WHERE id = :id
            """), {"id": id})
