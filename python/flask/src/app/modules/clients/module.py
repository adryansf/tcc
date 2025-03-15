from app.common.classes.base_module import BaseModule

# Controladores
from .controller import ClientsController

# Serviços
from .service import ClientsService

# Repositório
from .repository import ClientsRepository

class ClientsModule(BaseModule):
  def __init__(self):
    _repository = ClientsRepository()
    _service = ClientsService(_repository)
    self._controller = ClientsController(_service)
    super().__init__(prefix="clientes")

  def _routes(self):
    self._router.post(self._controller.create)
    self._router.get(self._controller.findByCPF, path="/cpf/<cpf>")