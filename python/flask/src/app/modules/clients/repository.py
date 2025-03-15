from typing import Optional, TypedDict
from app.database import db

# Entidades
from .entity import ClientEntity

class ICreateClientData(TypedDict):
    nome: str
    cpf: str
    telefone: str
    dataDeNascimento: str
    email: str
    senha: str


class ClientsRepository:
    def __init__(self):
        self._db = db

    def find_by_cpf(self, cpf: str) -> Optional[ClientEntity]:
        with self._db.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    c.id, 
                    c.cpf as cpf,
                    c.nome AS nome,
                    c.telefone AS telefone,
                    c."dataDeNascimento" AS "dataDeNascimento",
                    c.email AS email,
                    c.senha AS senha,
                    c."dataDeCriacao" AS "dataDeCriacao",
                    c."dataDeAtualizacao" AS "dataDeAtualizacao",
                    CASE 
                        WHEN e.id IS NOT NULL THEN 
                            json_build_object(
                                'logradouro', e.logradouro,
                                'numero', e.numero,
                                'bairro', e.bairro,
                                'cidade', e.cidade,
                                'uf', e.uf,
                                'complemento', e.complemento,
                                'cep', e.cep,
                                'dataDeCriacao', e."dataDeCriacao",
                                'dataDeAtualizacao', e."dataDeAtualizacao"
                            ) 
                        ELSE NULL 
                    END AS endereco 
                FROM "Cliente" c
                LEFT JOIN "Endereco" e ON e."idCliente" = c.id
                WHERE c.cpf = %s LIMIT 1
            """, [cpf])

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None

    def find_by_id(self, id: str) -> Optional[ClientEntity]:
        with self._db.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    c.id, 
                    c.cpf as cpf,
                    c.nome AS nome,
                    c.telefone AS telefone,
                    c."dataDeNascimento" AS "dataDeNascimento",
                    c.email AS email,
                    c.senha AS senha,
                    c."dataDeCriacao" AS "dataDeCriacao",
                    c."dataDeAtualizacao" AS "dataDeAtualizacao",
                    CASE 
                        WHEN e.id IS NOT NULL THEN 
                            json_build_object(
                                'logradouro', e.logradouro,
                                'numero', e.numero,
                                'bairro', e.bairro,
                                'cidade', e.cidade,
                                'uf', e.uf,
                                'complemento', e.complemento,
                                'cep', e.cep,
                                'dataDeCriacao', e."dataDeCriacao",
                                'dataDeAtualizacao', e."dataDeAtualizacao"
                            ) 
                        ELSE NULL 
                    END AS endereco 
                FROM "Cliente" c
                LEFT JOIN "Endereco" e ON e."idCliente" = c.id
                WHERE c.id = %s LIMIT 1
            """, [id])

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None

    def find_by_email(self, email: str) -> Optional[ClientEntity]:
        with self._db.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    c.id, 
                    c.cpf as cpf,
                    c.nome AS nome,
                    c.telefone AS telefone,
                    c."dataDeNascimento" AS "dataDeNascimento",
                    c.email AS email,
                    c.senha AS senha,
                    c."dataDeCriacao" AS "dataDeCriacao",
                    c."dataDeAtualizacao" AS "dataDeAtualizacao",
                    CASE 
                        WHEN e.id IS NOT NULL THEN 
                            json_build_object(
                                'logradouro', e.logradouro,
                                'numero', e.numero,
                                'bairro', e.bairro,
                                'cidade', e.cidade,
                                'uf', e.uf,
                                'complemento', e.complemento,
                                'cep', e.cep,
                                'dataDeCriacao', e."dataDeCriacao",
                                'dataDeAtualizacao', e."dataDeAtualizacao"
                            ) 
                        ELSE NULL 
                    END AS endereco 
                FROM "Cliente" c
                LEFT JOIN "Endereco" e ON e."idCliente" = c.id
                WHERE c.email = %s LIMIT 1
            """, [email])

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None

    def create(self, data: ICreateClientData) -> Optional[ClientEntity]:
        with self._db.cursor() as cursor:
            cursor.execute("""
                INSERT INTO "Cliente" (nome, cpf, telefone, "dataDeNascimento", email, senha) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *
            """, [data["nome"], data["cpf"], data["telefone"], data["dataDeNascimento"], data["email"], data["senha"]])

            self._db.commit()

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None
        
    def find_all(self, quantidade: int):
        with self._db.cursor() as cursor:
            cursor.execute(
                '''
                SELECT 
                    c.id, 
                    c.cpf as cpf,
                    c.nome AS nome,
                    c.telefone AS telefone,
                    c."dataDeNascimento" AS "dataDeNascimento",
                    c.email AS email,
                    c.senha AS senha,
                    c."dataDeCriacao" AS "dataDeCriacao",
                    c."dataDeAtualizacao" AS "dataDeAtualizacao"
                FROM "Cliente" c
                LIMIT %s
                ''',
                [quantidade]
            )
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            return [dict(zip(columns, row)) for row in rows]