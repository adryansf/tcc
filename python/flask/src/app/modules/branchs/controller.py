# Middlewares
from ..auth.middlewares.auth import auth_middleware

# Dtos
from .dtos.outputs.find_all_branchs import FindAllBranchsOutputDto

# Service
from .service import BranchsService

# Entities
from .entity import BranchEntity

# Commons
from app.common.classes.base_controller import BaseController

class BranchsController(BaseController):
    def __init__(self, service: BranchsService):
        self._service = service

    @auth_middleware
    def find_all(self):
        result = self._service.find_all()
        if result.is_left():
            raise result.value
        
        response = FindAllBranchsOutputDto(branchs=[BranchEntity(**branch) for branch in result.value])
        return self.sendSuccess(response)