from .base_error import BaseError
from ..messages import MESSAGES  # Importando mensagens personalizadas

class UnauthorizedError(BaseError):
    code = 401
    description = MESSAGES["error"]["Unauthorized"]

    def __init__(self, message: str = None, errors: str = None):
        super().__init__(code=self.code, message=message, errors=errors)
