from typing import Optional, Any, Dict
from uuid import UUID, uuid4
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_serializer

class TransactionEntity(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    valor: float
    tipo: str
    idContaOrigem: Optional[UUID] = None
    idContaDestino: Optional[UUID] = None
    dataDeCriacao: datetime
    contaOrigem: Optional[Dict[str, Any]] = Field(default=None)
    contaDestino: Optional[Dict[str, Any]] = Field(default=None)

    model_config = ConfigDict(
        json_encoders={UUID: str},  # Garante que UUID seja string no JSON
        ser_json_timedelta="iso8601",  # Garante ISO 8601 para timedelta (se houver)
        ser_json_bytes="utf8",  # Se houver bytes, serializa como UTF-8
        ser_json_path="unix",  # Serializa paths corretamente
    )

    @field_serializer("dataDeCriacao")
    def serialize_datetime(self, value: datetime) -> str:
        """Garante que datetime seja sempre ISO 8601"""
        return value.isoformat()

    def to_json(self):
        return self.model_dump(exclude_none=True)
