from pydantic import BaseModel, Field, field_validator
from app.common.messages import MESSAGES
from app.common.helpers import clean_digits

class CreateAddressDto(BaseModel):
    logradouro: str = Field(..., min_length=1, error_message=MESSAGES['validation']['is_string']('logradouro'))
    numero: str = Field(..., min_length=1, error_message=MESSAGES['validation']['is_string']('numero'))
    bairro: str = Field(..., min_length=1, error_message=MESSAGES['validation']['is_string']('bairro'))
    cidade: str = Field(..., min_length=1, error_message=MESSAGES['validation']['is_string']('cidade'))
    uf: str = Field(..., min_length=2, max_length=2, json_schema_extra={"error_message": MESSAGES['validation']['min_length']('uf', 2)})
    complemento: str = ""
    cep: str = Field(..., min_length=1, error_message=MESSAGES['validation']['is_string']('cep'))

    @field_validator('cep')
    def clean_cep(cls, v):
        return clean_digits(v)