from .clients.module import ClientsModule
from .auth.module import AuthModule
from .addresses.module import AddressesModule
from .branchs.module import BranchsModule
from .accounts.module import AccountsModule
from .transactions.module import TransactionsModule
from .admin.module import AdminModule

modules = [ClientsModule, AuthModule, AddressesModule, BranchsModule, AccountsModule, TransactionsModule, AdminModule]