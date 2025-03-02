from pydantic import ValidationError

# Commons
from app.common.classes.base_controller import BaseController
from app.common.http import Request
from app.common.errors import BadRequestError

# DTOs
from .dtos.inputs.create_address import CreateAddressDto

# Service
from .service import AddressesService

class AddressesController(BaseController):
    def __init__(self, service: AddressesService):
        self._service = service

    async def create(self, request: Request):
        try:
            idClient = request.state.auth['id']
            data = await request.json()
            data = CreateAddressDto(**data)

            # Service
            result = self._service.create(data, idClient)

            if result.is_left():
                raise result.value

            return self.sendSuccessWithoutBody(201)
        except ValidationError as e:
            raise BadRequestError(errors=e)
