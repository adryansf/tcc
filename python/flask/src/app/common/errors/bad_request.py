from .base_error import BaseError
from pydantic import ValidationError
from ..messages import MESSAGES  # Importando mensagens personalizadas

class BadRequestError(BaseError):
    code = 400
    description = MESSAGES["error"]["BadRequest"]

    def __init__(self, message: str = None, errors: str = None):
        super().__init__(code=self.code, message=message, errors=errors)