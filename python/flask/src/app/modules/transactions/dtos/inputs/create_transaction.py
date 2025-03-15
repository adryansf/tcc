from typing import Optional
from pydantic import BaseModel, UUID4, Field, PositiveFloat, model_validator

# Common
from app.common.messages import MESSAGES
from app.common.errors import BadRequestError

# Types
from ...enums.transaction_type import TransactionTypeEnum

class CreateTransactionDto(BaseModel):
    tipo: TransactionTypeEnum = Field(..., description=MESSAGES['validation']['is_string']('tipo'))
    idContaOrigem: Optional[UUID4] = Field(None, description=MESSAGES['validation']['is_uuid']('idContaOrigem'))
    idContaDestino: Optional[UUID4] = Field(None, description=MESSAGES['validation']['is_uuid']('idContaDestino'))
    valor: PositiveFloat = Field(..., description=MESSAGES['validation']['is_positive']('valor'))

    @model_validator(mode='after')
    def validate_transaction(cls, values):
        tipo = TransactionTypeEnum(values.tipo)
        idContaOrigem = values.idContaOrigem
        idContaDestino = values.idContaDestino

        if tipo == TransactionTypeEnum.DEPOSIT and not idContaDestino:
            raise BadRequestError('idContaDestino é obrigatório para depósitos.')
        if (tipo == TransactionTypeEnum.WITHDRAWAL and not idContaOrigem):
            raise BadRequestError('idContaOrigem é obrigatório para saques.')
        if (tipo == TransactionTypeEnum.TRANSFER and (not idContaOrigem or not idContaDestino)):
            raise BadRequestError('idContaOrigem e idContaDestino são obrigatórios para transferências.')

        return values
