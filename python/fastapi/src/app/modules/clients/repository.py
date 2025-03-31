from typing import Optional, TypedDict
from sqlalchemy import text
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
    def find_by_cpf(self, cpf: str) -> Optional[ClientEntity]:
        with db.connect() as connection:
            result = connection.execute(text("""
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
                WHERE c.cpf = :cpf LIMIT 1
            """), {"cpf": cpf})
            row = result.mappings().first()  # Use mappings() para garantir que o resultado seja tratado como dicionário
            return dict(row) if row else None

    def find_by_id(self, id: str) -> Optional[ClientEntity]:
        with db.connect() as connection:
            result = connection.execute(text("""
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
                WHERE c.id = :id LIMIT 1
            """), {"id": id})
            row = result.mappings().first()
            return dict(row) if row else None

    def find_by_email(self, email: str) -> Optional[ClientEntity]:
        with db.connect() as connection:
            result = connection.execute(text("""
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
                WHERE c.email = :email LIMIT 1
            """), {"email": email})
            row = result.mappings().first()
            return dict(row) if row else None

    def create(self, data: ICreateClientData) -> Optional[ClientEntity]:
        with db.connect() as connection:
            transaction = connection.begin()
            try:
                result = connection.execute(text("""
                    INSERT INTO "Cliente" (nome, cpf, telefone, "dataDeNascimento", email, senha) 
                    VALUES (:nome, :cpf, :telefone, :dataDeNascimento, :email, :senha) 
                    RETURNING *
                """), {
                    "nome": data["nome"],
                    "cpf": data["cpf"],
                    "telefone": data["telefone"],
                    "dataDeNascimento": data["dataDeNascimento"],
                    "email": data["email"],
                    "senha": data["senha"]
                })
                transaction.commit()
                row = result.mappings().first()
                return dict(row) if row else None
            except Exception as e:
                transaction.rollback()
                return None

    def find_all(self, quantidade: int):
        with db.connect() as connection:
            result = connection.execute(text("""
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
                LIMIT :quantidade
            """), {"quantidade": quantidade})
            rows = result.mappings().all()
            return [dict(row) for row in rows]