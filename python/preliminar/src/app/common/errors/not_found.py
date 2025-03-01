from .base_error import BaseError

class NotFoundError(BaseError):
    code = 404
    description = "Not Found"

    def __init__(self, message: str = None):
        super().__init__(code=self.code, message=message)
