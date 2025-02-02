import { ClientsModule } from "./clients/clients.module";
import { AuthModule } from "./auth/auth.module";
import { AccountsModule } from "./accounts/accounts.module";
import { TransactionsModule } from "./transactions/transactions.module";

export const modules = [
  ClientsModule,
  AuthModule,
  AccountsModule,
  TransactionsModule,
];
