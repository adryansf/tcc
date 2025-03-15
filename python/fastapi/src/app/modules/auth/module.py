from .controller import AuthController
from .service import AuthService

from app.common.classes.base_module import BaseModule
from app.modules.clients.repository import ClientsRepository
from app.modules.managers.repository import ManagersRepository

class AuthModule(BaseModule):
    def __init__(self):
        _repositories = {
            'clients': ClientsRepository(),
            'managers': ManagersRepository()
        }
        _service = AuthService(_repositories)
        self._controller = AuthController(_service)
        super().__init__(prefix="auth")

    def _routes(self):
        self._router.post(self._controller.login_clients, path="/login/clientes")
        self._router.post(self._controller.login_managers, path="/login/gerentes")