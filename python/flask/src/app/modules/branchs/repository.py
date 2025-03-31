from app.database import db
from sqlalchemy import text

# Entity
from .entity import BranchEntity

class BranchsRepository:
    def find_all(self) -> list[BranchEntity]:
        with db.connect() as connection:
            result = connection.execute(text('SELECT * FROM "Agencia"'))
            rows = result.mappings().all()
            return [dict(row) for row in rows]
    
    def find_by_id(self, id: str) -> BranchEntity:
        with db.connect() as connection:
            result = connection.execute(text('SELECT * FROM "Agencia" a WHERE a.id = :id LIMIT 1'), {"id": id})
            row = result.mappings().first()
            return dict(row) if row else None