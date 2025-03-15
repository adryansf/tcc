# Commons
from app.common.classes.base_module import BaseModule

from .service import AdminService
from .controller import AdminController
from app.modules.managers.repository import ManagersRepository
from app.modules.clients.repository import ClientsRepository

class AdminModule(BaseModule):
    def __init__(self):
        _repositories = {
            'managers': ManagersRepository(),
            'clients': ClientsRepository(),
        }
        _service = AdminService(_repositories)
        self._controller = AdminController(_service)

        super().__init__(prefix="admin")

    def _routes(self):
        self._router.get(self._controller.find_all_clients, path='clientes')
        self._router.get(self._controller.find_all_managers, path="gerentes")