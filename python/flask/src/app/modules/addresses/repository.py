from typing import Optional, TypedDict
from sqlalchemy import text

# Commons
from app.database import db

from .entity import AddressEntity

class ICreateAddressData(TypedDict):
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    uf: str
    cep: str
    idCliente: str
    complemento: str

class AddressesRepository:
    def find_by_id_client(self, id: str) -> Optional[AddressEntity]:
        with db.connect() as connection:
            result = connection.execute(text("""
                SELECT * FROM "Endereco" e WHERE e."idCliente" = :id
            """), {"id": id})
            row = result.mappings().first()
            return dict(row) if row else None

    def create(self, data: ICreateAddressData) -> Optional[AddressEntity]:
        with db.connect() as connection:
            transaction = connection.begin()
            try:
                result = connection.execute(text("""
                    INSERT INTO "Endereco" (logradouro, numero, bairro, cidade, uf, cep, "idCliente", complemento) 
                    VALUES (:logradouro, :numero, :bairro, :cidade, :uf, :cep, :idCliente, :complemento) 
                    RETURNING *
                """), data)
                transaction.commit()
                row = result.mappings().first()
                return dict(row) if row else None
            except Exception:
                transaction.rollback()
                return None