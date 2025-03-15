from app.database import db

# Entity
from .entity import BranchEntity

class BranchsRepository:
    def __init__(self):
        self._db = db

    def find_all(self) -> list[BranchEntity]:
        with self._db.cursor() as cursor:
            cursor.execute('SELECT * FROM "Agencia"')
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            return [dict(zip(columns, row)) for row in rows]
    
    def find_by_id(self, id: str) -> BranchEntity:
        with self._db.cursor() as cursor:
            cursor.execute('SELECT * FROM "Agencia" a WHERE a.id = %s LIMIT 1', [id])
            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            return dict(zip(columns, row)) if row else None