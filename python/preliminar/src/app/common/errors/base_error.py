from werkzeug.exceptions import HTTPException
from pydantic import ValidationError
from ..messages import MESSAGES

class BaseError(HTTPException):
  code = 500
  description = MESSAGES["error"]["InternalServer"]

  def __init__(self, code: int = None, message: str = None, errors: str = None):
        if code is not None:
            self.code = code
        if message is None:
            message = self.description

        self.response = {
            "statusCode": self.code,
            "message": message,
        }

        if isinstance(errors, ValidationError):
            errors = [f"{err['loc'][0]}: {err['msg']}" for err in errors.errors()]

        if errors is not None:
            self.response['errors'] = errors

        super().__init__(description=self.response)
