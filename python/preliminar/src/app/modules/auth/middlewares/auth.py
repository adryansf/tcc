from functools import wraps
from flask import request

# Helpers
from app.common.helpers import verify_jwt

# Errors
from app.common.errors import BadRequestError, UnauthorizedError

# Messages
from app.common.messages import MESSAGES

def auth_middleware(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
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
      request.auth = payload
    except:
      raise UnauthorizedError()

    return f(*args, **kwargs)
  
  return decorated_function
