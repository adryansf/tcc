from fastapi import Request, Depends
from app.common.enums import RoleEnum
from app.common.errors import UnauthorizedError

def roles_permitted_middleware(*roles_permitted):
    async def verify_roles(request: Request):
        if not hasattr(request.state, 'auth'):
            raise UnauthorizedError()

        user_role = request.state.auth.get('role')
        try:
            user_role = RoleEnum(user_role)
        except ValueError:
            raise UnauthorizedError()

        if user_role not in roles_permitted:
            raise UnauthorizedError()
        
    return verify_roles
