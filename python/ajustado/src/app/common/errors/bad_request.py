from .base_error import BaseError
from ..messages import MESSAGES  # Importando mensagens personalizadas

class BadRequestError(BaseError):
    code = 400
    message = MESSAGES["error"]["BadRequest"]

    def __init__(self, message: str = message, errors: str = None):
        super().__init__(code=self.code, message=message, errors=errors)