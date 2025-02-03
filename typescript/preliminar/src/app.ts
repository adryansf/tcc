import "reflect-metadata";
import cors from "cors";
import express from "express";

// Server
import { Server } from "./server";

// Modules
import { modules } from "./app/modules";

interface IApp {
  start: () => void;
  loadModules: () => void;
  preMiddlewares: () => void;
  postMiddlewares: () => void;
}

export class App implements IApp {
  private _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  preMiddlewares() {
    this._server.use(cors());
    this._server.use(express.json());
  }

  postMiddlewares() {}

  loadModules() {
    for (const module of modules) {
      const moduleInstance = new module();

      this._server.use(moduleInstance.router);
    }
  }

  start() {
    this.preMiddlewares();
    this.loadModules();
    this.postMiddlewares();
    this._server.start();
  }
}
