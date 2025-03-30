import { BaseModuleMultipleRepositories } from "@/app/common/classes/base-module.class";
import { AddressController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";
import { CacheService } from "@/app/common/cache/cache.service";

// Repositories
import { ClientsRepository } from "../clients/clients.repository";
import { AddressesRepository } from "./addresses.repository";

// Middlewares
import { authMiddleware } from "../auth/middlewares/auth.middleware";
import { rolesPermittedMiddleware } from "@/app/common/middlewares/roles-permitted.middleware";

// Types
import { RoleEnum } from "@/app/common/enums/role.enum";

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
    const cacheService = new CacheService();
    const _service = new AddressesService(_repositories, cacheService);
    const _controller = new AddressController(_service);

    super("enderecos", _controller, _service, _repositories);
  }

  routes() {
    this._router.post(
      "",
      authMiddleware,
      rolesPermittedMiddleware(RoleEnum.CLIENT),
      this._controller.create.bind(this._controller)
    );
  }
}
