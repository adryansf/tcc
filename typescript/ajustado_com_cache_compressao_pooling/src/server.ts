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
  private _host: string;

  constructor(port: number, host: string = "localhost") {
    this._server = Fastify();
    this._port = port;
    this._host = host;
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
    this._server.listen({ port: this._port, host: this._host }, () => {
      console.log(`Servidor rodando na porta ${this._port}`);
    });
  }
}
