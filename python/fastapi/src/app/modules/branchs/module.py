from app.common.classes.base_module import BaseModule

# Controller
from .controller import BranchsController
# Service
from .service import BranchsService
# Repository
from .repository import BranchsRepository

# Middlewares
from ..auth.middlewares.auth import auth_middleware

class BranchsModule(BaseModule):
    def __init__(self):
        _repository = BranchsRepository()
        _service = BranchsService(_repository)
        self._controller = BranchsController(_service)
        super().__init__(prefix="agencias")

    def _routes(self):
        self._router.get(self._controller.find_all, dependencies=[auth_middleware])