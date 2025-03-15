from typing import TypedDict
from uuid import UUID

from .enums.account_type import AccountTypeEnum
from app.database import db

class ICreateAccountData(TypedDict):
    tipo: AccountTypeEnum
    idAgencia: UUID
    idCliente: UUID

class IQueryFindAllAccounts(TypedDict):
    cpf: str

class AccountsRepository:
    def __init__(self):
        self._db = db

    def create(self, data: ICreateAccountData):
        with self._db.cursor() as cursor:
            cursor.execute(
                'INSERT INTO "Conta" (tipo, "idAgencia", "idCliente") VALUES (%s, %s, %s) RETURNING *',
                [data['tipo'], data['idAgencia'], data['idCliente']]
            )

            self._db.commit()

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None

    def find_all(self, query: IQueryFindAllAccounts):
        with self._db.cursor() as cursor:
            cursor.execute(
                '''
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
                WHERE cli.cpf = %s
                ''',
                [query['cpf']]
            )
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            return [dict(zip(columns, row)) for row in rows]

    
    def find_by_id(self, id: str, join: bool = False):
        with self._db.cursor() as cursor:
            query = '''
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
                query += '''
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
            query += ' FROM "Conta" c '
            if join:
                query += ' JOIN "Cliente" cli ON c."idCliente" = cli.id JOIN "Agencia" a ON c."idAgencia" = a.id '
            query += ' WHERE c.id = %s LIMIT 1'

            cursor.execute(query, [id])
            
            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None

    def add_balance(self, id: str, value: float):
        with self._db.cursor() as cursor:
            cursor.execute(
                'UPDATE "Conta" SET saldo = saldo + %s WHERE id = %s',
                [value, id]
            )

            return

    def remove_balance(self, id: str, value: float):
        with self._db.cursor() as cursor:
            cursor.execute(
                'UPDATE "Conta" SET saldo = saldo - %s WHERE id = %s',
                [value, id]
            )

            return

    def delete(self, id: str):
        with self._db.cursor() as cursor:
            cursor.execute(
                'DELETE FROM "Conta" WHERE id = %s',
                [id]
            )

            return
