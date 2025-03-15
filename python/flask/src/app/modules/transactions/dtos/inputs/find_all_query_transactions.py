from uuid import UUID
from pydantic import BaseModel, Field

# Common
from app.common.messages import MESSAGES

class FindAllQueryTransactionsDto(BaseModel):
    idConta: UUID = Field(None, alias='idConta', description=MESSAGES['validation']['is_uuid']('idConta'))
