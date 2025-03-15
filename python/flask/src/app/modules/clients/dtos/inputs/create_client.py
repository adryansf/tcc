from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
import cpfpy
import re
import unicodedata
from app.common.messages import MESSAGES

class CreateClientDto(BaseModel):
    nome: str = Field(..., min_length=3, json_schema_extra={"error_message": MESSAGES['validation']['min_length']('nome', 3)})
    cpf: str
    telefone: str
    dataDeNascimento: datetime
    email: EmailStr = Field(..., json_schema_extra={"error_message": MESSAGES['validation']['is_email']('email')})
    senha: str = Field(..., min_length=8, json_schema_extra={"error_message": MESSAGES['validation']['min_length']('senha', 8)})

    @field_validator('nome')
    def remove_accents(cls, v):
        return ''.join(c for c in unicodedata.normalize('NFD', v) if unicodedata.category(c) != 'Mn')

    @field_validator('cpf', 'telefone')
    def clean_digits(cls, v):
        return re.sub(r'\D', '', v)

    @field_validator('dataDeNascimento', mode='before')
    def parse_date(cls, v: str) -> datetime:
        try:
            return datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError("A data de nascimento deve estar no formato YYYY-MM-DD.")

    @field_validator('cpf')
    def validate_cpf(cls, v):
        # Implementar a validação de CPF aqui
        if not cpfpy.validate_cpf(v):
            raise ValueError(MESSAGES['validation']['invalid_cpf']('cpf'))
        return v
