# Commons
from app.common.classes.base_module import BaseModule

from .service import AccountsService
from .controller import AccountsController
from .repository import AccountsRepository
from app.modules.branchs.repository import BranchsRepository
from app.modules.managers.repository import ManagersRepository
from app.modules.clients.repository import ClientsRepository

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
        self._router.get(self._controller.find_all)
        self._router.get(self._controller.find_one, path="<id>")
        self._router.post(self._controller.create)
