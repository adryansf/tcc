from typing import TypedDict
from app.common.enums import RoleEnum

class JwtPayload(TypedDict):
    id: str
    email: str
    role: RoleEnum
    cpf: str