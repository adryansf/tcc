from app.common.classes.base_module import BaseModule

# Controladores
from .controller import ClientsController

# Serviços
from .service import ClientsService

# Repositório
from .repository import ClientsRepository

# Middlewares
from ..auth.middlewares.auth import auth_middleware
from app.common.middlewares.roles_permitted import roles_permitted_middleware

# Types
from app.common.enums import RoleEnum

class ClientsModule(BaseModule):
  def __init__(self):
    _repository = ClientsRepository()
    _service = ClientsService(_repository)
    self._controller = ClientsController(_service)
    super().__init__(prefix="clientes")

  def _routes(self):
    self._router.post(self._controller.create)
    self._router.get(self._controller.findByCPF, path="/cpf/{cpf}", dependencies=[auth_middleware, roles_permitted_middleware(RoleEnum.MANAGER)])