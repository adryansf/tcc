from functools import wraps
from flask import request

# Enums
from app.common.enums import RoleEnum

# Errors
from app.common.errors import UnauthorizedError

def roles_permitted_middleware(*roles_permitted):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not hasattr(request, 'auth'):
                raise UnauthorizedError()

            user_role = request.auth.get('role')
            try:
                user_role = RoleEnum(user_role)
            except ValueError:
                raise UnauthorizedError()

            if user_role not in roles_permitted:
                raise UnauthorizedError()

            return f(*args, **kwargs)
        return decorated_function
    return decorator
