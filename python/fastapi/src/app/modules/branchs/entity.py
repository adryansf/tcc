from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel, ConfigDict, field_serializer

class BranchEntity(BaseModel):
    id: UUID = uuid4()
    nome: str
    numero: int
    telefone: str
    dataDeCriacao: datetime
    dataDeAtualizacao: datetime

    model_config = ConfigDict(
        json_encoders={UUID: str},
        ser_json_timedelta="iso8601",
        ser_json_bytes="utf8",
        ser_json_path="unix",
    )

    @field_serializer("dataDeCriacao", "dataDeAtualizacao")
    def serialize_datetime(self, value: datetime) -> str:
        """Garante que datetime seja sempre ISO 8601"""
        return value.isoformat()

    def to_json(self):
      return self.model_dump(exclude_none=True)