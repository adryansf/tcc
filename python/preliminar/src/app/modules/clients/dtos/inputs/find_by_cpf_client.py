from pydantic import BaseModel, Field, field_validator
import re
import cpfpy
from app.common.messages import MESSAGES

class FindByCPFClientDto(BaseModel):
    cpf: str = Field(..., json_schema_extra={"error_message": MESSAGES['validation']['invalid_cpf']('cpf')})

    @field_validator('cpf')
    def clean_digits(cls, v):
        return re.sub(r'\D', '', v)

    @field_validator('cpf')
    def validate_cpf(cls, v):
        if not cpfpy.validate_cpf(v):
            raise ValueError(MESSAGES['validation']['invalid_cpf']('cpf'))
        return v
