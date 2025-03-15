from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional
from app.common.messages import MESSAGES
from ...enums.account_type import AccountTypeEnum

class CreateAccountDto(BaseModel):
    tipo: AccountTypeEnum = Field(..., description=MESSAGES['validation']['is_string']('tipo'))
    idAgencia: Optional[UUID] = Field(None, description=MESSAGES['validation']['is_uuid']('idAgencia'))
    idCliente: Optional[UUID] = Field(None, description=MESSAGES['validation']['is_uuid']('idCliente'))
