import { ClientsModule } from "./clients/clients.module";
import { AuthModule } from "./auth/auth.module";
import { AccountsModule } from "./accounts/accounts.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { AddressModule } from "./addresses/addresses.module";
import { BranchsModule } from "./branchs/branchs.module";

export const modules = [
  ClientsModule,
  AuthModule,
  AccountsModule,
  TransactionsModule,
  AddressModule,
  BranchsModule,
];
