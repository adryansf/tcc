import { BaseModule } from "@/app/common/classes/base-module.class";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { ClientsRepository } from "./clients.repository";

export class ClientsModule extends BaseModule<
  ClientsController,
  ClientsService,
  ClientsRepository
> {
  constructor() {
    const _repository = new ClientsRepository();
    const _service = new ClientsService(_repository);
    const _controller = new ClientsController(_service);

    super("clientes", _controller, _service, _repository);
  }

  routes() {
    this._router.get(":id", this._controller.findOne.bind(this._controller));
    this._router.post("", this._controller.create.bind(this._controller));
  }
}
