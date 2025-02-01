import { ClientsModule } from "./clients/clients.module";
import { AuthModule } from "./auth/auth.module";
import { AccountsModule } from "./accounts/accounts.module";

export const modules = [ClientsModule, AuthModule, AccountsModule];
