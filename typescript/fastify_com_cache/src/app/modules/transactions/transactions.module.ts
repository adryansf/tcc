import { BaseModuleMultipleRepositories } from "@/app/common/classes/base-module.class";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { CacheService } from "@/app/common/cache/cache.service";

// Repositories
import { AccountsRepository } from "../accounts/accounts.repository";
import { TransactionsRepository } from "./transactions.repository";

// Middlewares
import { authMiddleware } from "../auth/middlewares/auth.middleware";

// Types
export interface Repositories {
  accounts: AccountsRepository;
  transactions: TransactionsRepository;
}

export class TransactionsModule extends BaseModuleMultipleRepositories<
  TransactionsController,
  TransactionsService,
  Repositories
> {
  constructor() {
    const _repositories = {
      accounts: new AccountsRepository(),
      transactions: new TransactionsRepository(),
    };
    const cacheService = new CacheService();
    const _service = new TransactionsService(_repositories, cacheService);
    const _controller = new TransactionsController(_service);

    super("transacoes", _controller, _service, _repositories);
  }

  routes() {
    this._router.get(
      "",
      authMiddleware,
      this._controller.findAll.bind(this._controller)
    );
    this._router.post(
      "",
      authMiddleware,
      this._controller.create.bind(this._controller)
    );
  }
}
