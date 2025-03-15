from pydantic import BaseModel, Field
from uuid import UUID
from app.common.messages import MESSAGES

class FindOneAccountDto(BaseModel):
    id: UUID = Field(..., description=MESSAGES['validation']['is_uuid']('id'))
