from pydantic import BaseModel, ConfigDict, field_serializer
from datetime import datetime

from app.modules.managers.entity import ManagerEntity

class LoginAuthManagersOutputDto(BaseModel):
    token: str
    usuario: ManagerEntity
    expiraEm: datetime

    model_config = ConfigDict(serialization={'datetime_format': 'iso8601'})

    def to_json(self):
        return self.model_dump()

    @field_serializer("usuario")
    def serialize_usuario(self, usuario: ManagerEntity):
        return usuario.to_json()

    @field_serializer("expiraEm")
    def serialize_expira_em(self, value: datetime):
        """Garante que o datetime seja convertido para ISO 8601"""
        return value.isoformat()
