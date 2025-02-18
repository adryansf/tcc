import { BaseModule } from "@/app/common/classes/base-module.class";
import { BranchsService } from "./branchs.service";
import { BranchsController } from "./branchs.controller";
import { BranchsRepository } from "./branchs.repository";

// Middlewares
import { authMiddleware } from "../auth/middlewares/auth.middleware";

export class BranchsModule extends BaseModule<
  BranchsController,
  BranchsService,
  BranchsRepository
> {
  constructor() {
    const _repository = new BranchsRepository();
    const _service = new BranchsService(_repository);
    const _controller = new BranchsController(_service);

    super("agencias", _controller, _service, _repository);
  }

  routes() {
    this._router.get(
      "",
      authMiddleware,
      this._controller.findAll.bind(this._controller)
    );
  }
}
