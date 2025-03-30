import { BaseModuleMultipleRepositories } from "@/app/common/classes/base-module.class";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

// Repositories
import { ManagersRepository } from "../managers/managers.repository";
import { ClientsRepository } from "../clients/clients.repository";

export interface Repositories {
  managers: ManagersRepository;
  clients: ClientsRepository;
}

export class AdminModule extends BaseModuleMultipleRepositories<
  AdminController,
  AdminService,
  Repositories
> {
  constructor() {
    const _repositories = {
      managers: new ManagersRepository(),
      clients: new ClientsRepository(),
    };
    const _service = new AdminService(_repositories);
    const _controller = new AdminController(_service);

    super("admin", _controller, _service, _repositories);
  }

  routes() {
    this._router.get(
      "/clientes",
      this._controller.findAllClients.bind(this._controller)
    );
    this._router.get(
      "/gerentes",
      this._controller.findAllManagers.bind(this._controller)
    );
  }
}
