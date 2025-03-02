from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, ConfigDict, field_serializer
from typing import Optional, Any, Dict

class AccountEntity(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    numero: int
    saldo: Optional[float] = None
    tipo: str
    idAgencia: Optional[UUID] = None
    idCliente: Optional[UUID] = None
    dataDeCriacao: datetime
    dataDeAtualizacao: datetime
    cliente: Optional[Dict[str, Any]] = Field(default=None)
    agencia: Optional[Dict[str, Any]] = Field(default=None)

    model_config = ConfigDict(
        json_encoders={UUID: str},  # Garante que UUID seja string no JSON
        ser_json_timedelta="iso8601",  # Garante ISO 8601 para timedelta (se houver)
        ser_json_bytes="utf8",  # Se houver bytes, serializa como UTF-8
        ser_json_path="unix",  # Serializa paths corretamente
    )

    @field_serializer("dataDeCriacao", "dataDeAtualizacao")
    def serialize_datetime(self, value: datetime) -> str:
        """Garante que datetime seja sempre ISO 8601"""
        return value.isoformat()

    def to_json(self):
        return self.model_dump(exclude_none=True)
