from typing import List

# Commons
from app.common.errors.either import Either, Right
from app.common.errors.base_error import BaseError

# DTOs
from .dtos.inputs.find_all_query_admin import FindAllQueryAdminDto

# Entites
from app.modules.managers.entity import ManagerEntity
from app.modules.clients.entity import ClientEntity

class AdminService:
    def __init__(self, repositories):
        self._repositories = repositories

    def find_all_managers(self, query: FindAllQueryAdminDto) -> Either[BaseError, List[ManagerEntity]]:
        managers = self._repositories['managers'].find_all(query.quantidade)
        return Right(managers)
    
    def find_all_clients(self, query: FindAllQueryAdminDto) -> Either[BaseError, List[ClientEntity]]:
        clients = self._repositories['clients'].find_all(query.quantidade)
        return Right(clients)