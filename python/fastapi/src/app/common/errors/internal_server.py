from .base_error import BaseError
from ..messages import MESSAGES  # Importando mensagens personalizadas

class InternalServerError(BaseError):
    code = 500
    message = MESSAGES["error"]["InternalServer"]

    def __init__(self, message: str = message, errors: str = None):
        super().__init__(code=self.code, message=message, errors=errors)
