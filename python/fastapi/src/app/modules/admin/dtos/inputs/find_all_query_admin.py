from pydantic import BaseModel, Field, PositiveFloat
from app.common.messages import MESSAGES

class FindAllQueryAdminDto(BaseModel):
    quantidade: PositiveFloat = Field(..., description=MESSAGES['validation']['is_positive']('valor'))