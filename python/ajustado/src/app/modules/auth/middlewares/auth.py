from fastapi import Request
# Helpers
from app.common.helpers import verify_jwt

# Errors
from app.common.errors import BadRequestError, UnauthorizedError

# Messages
from app.common.messages import MESSAGES

async def auth_middleware(request: Request):
  auth_header = request.headers.get('Authorization')

  if not auth_header:
    raise UnauthorizedError()

  try:
    token_type, token = auth_header.split()
    if token_type != 'Bearer':
      raise BadRequestError(MESSAGES['middleware']['auth']['BadRequest']['Unformatted'])
  except:
    raise BadRequestError(MESSAGES['middleware']['auth']['BadRequest']['Unformatted'])

  try:
    payload = verify_jwt(token)
    request.state.auth = payload
    return payload
  except:
    raise UnauthorizedError()