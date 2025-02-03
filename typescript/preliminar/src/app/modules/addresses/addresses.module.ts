import { BaseModuleMultipleRepositories } from "@/app/common/classes/base-module.class";
import { AddressController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";

// Repositories
import { ClientsRepository } from "../clients/clients.repository";
import { AddressesRepository } from "./addresses.repository";

// Middlewares
import { authMiddleware } from "../auth/middlewares/auth.middleware";

// Types
export interface Repositories {
  clients: ClientsRepository;
  addresses: AddressesRepository;
}

export class AddressModule extends BaseModuleMultipleRepositories<
  AddressController,
  AddressesService,
  Repositories
> {
  constructor() {
    const _repositories = {
      clients: new ClientsRepository(),
      addresses: new AddressesRepository(),
    };
    const _service = new AddressesService(_repositories);
    const _controller = new AddressController(_service);

    super("clientes/:idClient/enderecos", _controller, _service, _repositories);
  }

  routes() {
    this._router.get(
      "",
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
