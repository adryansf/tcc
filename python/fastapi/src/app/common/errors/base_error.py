from fastapi import HTTPException
from pydantic import ValidationError
from ..messages import MESSAGES

class BaseError(HTTPException):
  def __init__(self, code: int = 500, message: str = None, errors: str = None):
    if message is None:
      message = MESSAGES["error"]["InternalServer"]

    detail = {
      "statusCode": code,
      "message": message,
    }

    if isinstance(errors, ValidationError):
      errors = [f"{err['loc'][0]}: {err['msg']}" for err in errors.errors()]

    if errors is not None:
      detail['errors'] = errors

    super().__init__(status_code=code, detail=detail)
