# Commons
from app.common.classes.base_module import BaseModule

from .service import AccountsService
from .controller import AccountsController
from .repository import AccountsRepository
from app.modules.branchs.repository import BranchsRepository
from app.modules.managers.repository import ManagersRepository
from app.modules.clients.repository import ClientsRepository

# Middlewares
from ..auth.middlewares.auth import auth_middleware

class AccountsModule(BaseModule):
    def __init__(self):
        _repositories = {
            'accounts': AccountsRepository(),
            'branchs': BranchsRepository(),
            'managers': ManagersRepository(),
            'clients': ClientsRepository(),
        }
        _service = AccountsService(_repositories)
        self._controller = AccountsController(_service)

        super().__init__(prefix="contas")

    def _routes(self):
        self._router.get(self._controller.find_all, dependencies=[auth_middleware])
        self._router.get(self._controller.find_one, path="{id}", dependencies=[auth_middleware])
        self._router.post(self._controller.create, dependencies=[auth_middleware])
