from .base_error import BaseError

class NotFoundError(BaseError):
    code = 404
    message = "Not Found"

    def __init__(self, message: str = message):
        print(message)
        super().__init__(code=self.code, message=message)
