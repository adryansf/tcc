from app.common.classes.base_module import BaseModule

# Controller
from .controller import BranchsController
# Service
from .service import BranchsService
# Repository
from .repository import BranchsRepository

class BranchsModule(BaseModule):
    def __init__(self):
        _repository = BranchsRepository()
        _service = BranchsService(_repository)
        self._controller = BranchsController(_service)
        super().__init__(prefix="agencias")

    def _routes(self):
        self._router.get(self._controller.find_all)