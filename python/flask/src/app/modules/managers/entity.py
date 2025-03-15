from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_serializer

class ManagerEntity(BaseModel):
    id: UUID = uuid4()
    idAgencia: UUID = uuid4()
    nome: str
    cpf: str
    telefone: str
    dataDeNascimento: datetime
    email: str

    senha: str  # Excluído na serialização

    dataDeCriacao: datetime
    dataDeAtualizacao: datetime

    agencia: Optional[dict] = None  # Pode ser substituído por uma entidade específica se necessário

    model_config = ConfigDict(
        json_encoders={UUID: str},  # Garante que UUID seja string no JSON
        ser_json_timedelta="iso8601",  # Garante ISO 8601 para timedelta (se houver)
        ser_json_bytes="utf8",  # Se houver bytes, serializa como UTF-8
        ser_json_path="unix",  # Serializa paths corretamente
    )

    @field_serializer("dataDeNascimento", "dataDeCriacao", "dataDeAtualizacao")
    def serialize_datetime(self, value: datetime) -> str:
        """Garante que datetime seja sempre ISO 8601"""
        return value.isoformat()

    def to_json(self):
        """Retorna um dicionário sem a senha"""
        return self.model_dump(exclude={"senha"}, by_alias=True, exclude_none=True)  # model_dump retorna um dict corretamente
