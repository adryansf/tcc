import Fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyRegisterOptions,
  RouteOptions,
} from "fastify";

interface IServer {
  start: () => void;
  register: (plugin: FastifyPluginCallback) => void;
}

export class Server implements IServer {
  private _server: FastifyInstance;
  private _port: number;

  constructor(port: number) {
    this._server = Fastify();
    this._port = port;
  }

  register<Options>(
    plugin: FastifyPluginCallback,
    options?: FastifyRegisterOptions<Options>
  ) {
    this._server.register(plugin, options);
  }

  route(router: RouteOptions[]) {
    for (const route of router) {
      this._server.route(route);
    }
  }

  start() {
    this._server.listen({ port: this._port }, () => {
      console.log(`Servidor rodando na porta ${this._port}`);
    });
  }
}
