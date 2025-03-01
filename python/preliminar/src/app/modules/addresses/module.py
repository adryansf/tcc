from app.modules.clients.repository import ClientsRepository
from app.modules.addresses.repository import AddressesRepository

# Commons
from app.common.classes.base_module import BaseModule

from .service import AddressesService
from .controller import AddressesController

class AddressesModule(BaseModule):
    def __init__(self):
        _repositories = {
            'addresses': AddressesRepository(),
            'clients': ClientsRepository(),
        }
        _service = AddressesService(_repositories)
        self._controller = AddressesController(_service)

        super().__init__(prefix="enderecos")

    def _routes(self):
        self._router.post(self._controller.create)
