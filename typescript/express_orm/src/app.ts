import "reflect-metadata";
import cors from "cors";
import express from "express";

// Database
import { sequelize } from "./database";

// Erros
import { InternalServerError } from "./app/common/errors/internal-server.error";

// Server
import { Server } from "./server";

// Modules
import { modules } from "./app/modules";

interface IApp {
  start: () => void;
  loadModules: () => void;
  preMiddlewares: () => void;
  postMiddlewares: () => void;
  connectDatabase: () => void;
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

  postMiddlewares() {
    this._server.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error(err.stack);
        const error = new InternalServerError();

        res.status(error.statusCode).json(error.toJSON());
      }
    );
  }

  connectDatabase() {
    sequelize
      .authenticate()
      .then(() => {
        console.log("Database conectada com sucesso");
      })
      .catch((err) => {
        console.error("Erro ao conectar com o banco de dados:", err);
        process.exit(1);
      });
  }

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
    this.connectDatabase();
    this._server.start();
  }
}
