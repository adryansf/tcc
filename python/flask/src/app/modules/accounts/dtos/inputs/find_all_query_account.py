from pydantic import BaseModel, field_validator
import cpfpy
import re
from app.common.messages import MESSAGES

class FindAllQueryAccountDto(BaseModel):
    cpf: str

    @field_validator('cpf')
    def clean_digits(cls, v):
        return re.sub(r'\D', '', v)
    
    @field_validator('cpf')
    def validate_cpf(cls, v):
        # Implementar a validação de CPF aqui
        if not cpfpy.validate_cpf(v):
            raise ValueError(MESSAGES['validation']['invalid_cpf']('cpf'))
        return v