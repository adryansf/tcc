from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel, ConfigDict, field_serializer

class AddressEntity(BaseModel):
  id: UUID = uuid4()
  logradouro: str
  numero: str
  bairro: str
  cidade: str
  uf: str
  complemento: str | None;
  cep: str
  idCliente: UUID
  dataDeCriacao: datetime
  dataDeAtualizacao: datetime

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