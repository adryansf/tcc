import "reflect-metadata";
import cors from "@fastify/cors";
import compress, { FastifyCompressOptions } from "@fastify/compress";

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

  loadPlugins() {
    this._server.register(cors);
    // COMPRESSÃO GZIP
    this._server.register<FastifyCompressOptions>(compress, {
      global: true,
      encodings: ["gzip"],
    });
  }

  loadModules() {
    for (const module of modules) {
      const moduleInstance = new module();

      this._server.route(moduleInstance.router);
    }
  }

  start() {
    this.loadPlugins();
    this.loadModules();
    this._server.start();
  }
}
