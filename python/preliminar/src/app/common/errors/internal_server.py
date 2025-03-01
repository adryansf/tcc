from .base_error import BaseError
from ..messages import MESSAGES  # Importando mensagens personalizadas

class InternalServerError(BaseError):
    code = 500
    description = MESSAGES["error"]["InternalServer"]

    def __init__(self, message: str = None, errors: str = None):
        super().__init__(code=self.code, message=message, errors=errors)
