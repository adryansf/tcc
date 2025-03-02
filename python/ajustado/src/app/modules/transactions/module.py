# Common
from app.common.classes.base_module import BaseModule

# Transactions
from .service import TransactionsService
from .controller import TransactionsController
from .repository import TransactionsRepository

# Accounts
from app.modules.accounts.repository import AccountsRepository

# Middlewares
from ..auth.middlewares.auth import auth_middleware

class TransactionsModule(BaseModule):
    def __init__(self):
        _repositories = {
            'accounts': AccountsRepository(),
            'transactions': TransactionsRepository(),
        }
        _service = TransactionsService(_repositories)
        self._controller = TransactionsController(_service)

        super().__init__(prefix="transacoes")

    def _routes(self):
        self._router.get(self._controller.find_all, dependencies=[auth_middleware])
        self._router.post(self._controller.create, dependencies=[auth_middleware])
