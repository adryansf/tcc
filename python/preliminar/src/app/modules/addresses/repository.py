from typing import Optional, TypedDict

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
    def __init__(self):
        self._db = db

    def find_by_id_client(self, id: str) -> Optional[AddressEntity]:
        with self._db.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM "Endereco" e WHERE e."idCliente" = %s
            """, [id])

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None

    def create(self, data: ICreateAddressData) -> Optional[AddressEntity]:
        with self._db.cursor() as cursor:
            cursor.execute("""
                INSERT INTO "Endereco" (logradouro, numero, bairro, cidade, uf, cep, "idCliente", complemento) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *
            """, [data['logradouro'], data['numero'], data['bairro'], data['cidade'], data['uf'], data['cep'], data['idCliente'], data['complemento']])

            self._db.commit()

            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None