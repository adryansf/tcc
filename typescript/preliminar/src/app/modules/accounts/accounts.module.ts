import { BaseModuleMultipleRepositories } from "@/app/common/classes/base-module.class";
import { AccountsService } from "./accounts.service";
import { AccountsController } from "./accounts.controller";

// Repositories
import { AccountsRepository } from "./accounts.repository";
import { BranchsRepository } from "../branchs/branchs.repository";

// Middlewares
import { authMiddleware } from "../auth/middlewares/auth.middleware";

// Types
export interface Repositories {
  accounts: AccountsRepository;
  branchs: BranchsRepository;
}

export class AccountsModule extends BaseModuleMultipleRepositories<
  AccountsController,
  AccountsService,
  Repositories
> {
  constructor() {
    const _repositories = {
      accounts: new AccountsRepository(),
      branchs: new BranchsRepository(),
    };
    const _service = new AccountsService(_repositories);
    const _controller = new AccountsController(_service);

    super("contas", _controller, _service, _repositories);
  }

  routes() {
    this._router.get(
      ":id",
      authMiddleware,
      this._controller.findOne.bind(this._controller)
    );
    this._router.post(
      "",
      authMiddleware,
      this._controller.create.bind(this._controller)
    );
  }
}
