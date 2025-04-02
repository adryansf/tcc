import "reflect-metadata";
import cors from "@fastify/cors";

// Server
import { Server } from "./server";

// Modules
import { modules } from "./app/modules";

interface IApp {
  start: () => void;
  loadModules: () => void;
  loadPlugins: () => void;
}

export class App implements IApp {
  private _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  async loadPlugins() {
    await this._server.register(cors);
  }

  loadModules() {
    for (const module of modules) {
      const moduleInstance = new module();
      this._server.route(moduleInstance.router);
    }
  }

  async start() {
    await this.loadPlugins();
    this.loadModules();
    this._server.start();
  }
}
