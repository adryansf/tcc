from pydantic import ValidationError
from app.common.classes.base_controller import BaseController
from app.common.http import Request
from app.common.errors import BadRequestError


# Serviços
from .service import ClientsService

# Entidades
from .entity import ClientEntity

# DTOs
from .dtos.inputs.create_client import CreateClientDto
from .dtos.inputs.find_by_cpf_client import FindByCPFClientDto

class ClientsController(BaseController):
    def __init__(self, service: ClientsService):
        self._service = service

    async def findByCPF(self, cpf: str, request: Request):
        try:
            data = FindByCPFClientDto(**{'cpf': cpf})

            # Service
            result = self._service.find_by_cpf(data.cpf)

            if result.is_left():
                raise result.value

            response = ClientEntity(**result.value)

            return self.sendSuccess(response=response)
        except ValidationError as e:
            raise BadRequestError(errors=e)

    async def create(self, request: Request):
        try:
            data = await request.json()
            data = CreateClientDto(**data)

            # Service
            result = self._service.create(data)

            if result.is_left():
                raise result.value

            return self.sendSuccessWithoutBody(201)
        except ValidationError as e:
            raise BadRequestError(errors=e)
