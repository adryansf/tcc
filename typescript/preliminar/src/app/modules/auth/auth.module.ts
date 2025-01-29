import { BaseModuleMultipleRepositories } from "@/app/common/classes/base-module.class";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ClientsRepository } from "../clients/clients.repository";

// Types
export interface Repositories {
  clients: ClientsRepository;
}

export class AuthModule extends BaseModuleMultipleRepositories<
  AuthController,
  AuthService,
  Repositories
> {
  constructor() {
    const _repositories = {
      clients: new ClientsRepository(),
    };
    const _service = new AuthService(_repositories);
    const _controller = new AuthController(_service);

    super("auth", _controller, _service);
  }

  routes() {
    this._router.post(
      "login/clientes",
      this._controller.loginClients.bind(this._controller)
    );
  }
}
