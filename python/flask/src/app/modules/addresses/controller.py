from pydantic import ValidationError

# Middlewares
from ..auth.middlewares.auth import auth_middleware
from app.common.middlewares.roles_permitted import roles_permitted_middleware

# Commons
from app.common.classes.base_controller import BaseController
from app.common.http import request
from app.common.errors import BadRequestError

# DTOs
from .dtos.inputs.create_address import CreateAddressDto

# Enums
from app.common.enums import RoleEnum

# Service
from .service import AddressesService

class AddressesController(BaseController):
  def __init__(self, service: AddressesService):
        self._service = service

  @auth_middleware
  @roles_permitted_middleware(RoleEnum.CLIENT)
  def create(self):
    try:
      idClient = request.auth['id']
      data = request.json

      data = CreateAddressDto(**data)

      # Service
      result = self._service.create(data, idClient)

      if(result.is_left()):
         raise result.value
      
      return self.sendSuccessWithoutBody(201)
    except ValidationError as e:
      raise BadRequestError(errors=e)
