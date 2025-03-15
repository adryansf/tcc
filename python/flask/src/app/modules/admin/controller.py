from app.common.http import request
from pydantic import ValidationError

# Commons
from app.common.classes.base_controller import BaseController
from app.common.errors import BadRequestError

from .service import AdminService

# DTOs
from .dtos.outputs.find_all_managers_admin_output import FindAllManagersAdminOutputDto
from .dtos.outputs.find_all_clients_admin_output import FindAllClientsAdminOutputDto
from .dtos.inputs.find_all_query_admin import FindAllQueryAdminDto

# Entities
from app.modules.managers.entity import ManagerEntity
from app.modules.clients.entity import ClientEntity


class AdminController(BaseController):
    def __init__(self, service: AdminService):
        self._service = service

    def find_all_managers(self):
        try:
            quantidade = request.args.get('quantidade')

            query = FindAllQueryAdminDto(**{'quantidade': int(float(quantidade))})

            result = self._service.find_all_managers(query)

            if result.is_left():
                raise result.value

            response = FindAllManagersAdminOutputDto(managers=[ManagerEntity(**manager) for manager in result.value])
            return self.sendSuccess(response)
        except ValidationError as e:
            raise BadRequestError(errors=e)
    
    def find_all_clients(self):
        try:
            quantidade = request.args.get('quantidade')

            query = FindAllQueryAdminDto(**{'quantidade': int(float(quantidade))})

            result = self._service.find_all_clients(query)

            if result.is_left():
                raise result.value

            response = FindAllClientsAdminOutputDto(clients=[ClientEntity(**client) for client in result.value])
            return self.sendSuccess(response)
        except ValidationError as e:
            raise BadRequestError(errors=e)