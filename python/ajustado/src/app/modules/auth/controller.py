from pydantic import ValidationError

from .service import AuthService
from .dtos.inputs.login_auth_dto import LoginAuthDto
from .dtos.outputs.login_auth_clients_dto import LoginAuthClientsOutputDto
from .dtos.outputs.login_auth_managers_dto import LoginAuthManagersOutputDto

from app.common.classes.base_controller import BaseController
from app.common.http import Request
from app.common.errors import BadRequestError

class AuthController(BaseController):
    def __init__(self, service: AuthService):
        self._service = service

    async def login_clients(self, request: Request):
        try:
            data = await request.json()
            data = LoginAuthDto(**data)

            # Service
            result = self._service.login_clients(data)

            if result.is_left():
                raise result.value

            response = LoginAuthClientsOutputDto(**result.value)

            return self.sendSuccess(response)
        except ValidationError as e:
            raise BadRequestError(errors=e)

    async def login_managers(self, request: Request):
        try:
            data = await request.json()
            data = LoginAuthDto(**data)

            # Service
            result = self._service.login_managers(data)

            if result.is_left():
                raise result.value
            
            response = LoginAuthManagersOutputDto(**result.value)
            
            return self.sendSuccess(response)
        except ValidationError as e:
            raise BadRequestError(errors=e)
