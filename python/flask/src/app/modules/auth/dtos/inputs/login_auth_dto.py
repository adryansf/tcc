from pydantic import BaseModel, EmailStr, Field

# Common
from app.common.messages import MESSAGES

class LoginAuthDto(BaseModel):
    email: EmailStr
    senha: str = Field(..., min_length=8, json_schema_extra={"error_message": MESSAGES['validation']['min_length']('senha', 8)})
