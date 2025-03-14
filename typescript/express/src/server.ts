import express, { Express } from "express";
import { HttpHandler } from "@/common/types/http-handler.type";

interface IServer {
  start: () => void;
  use: (...handles: HttpHandler[]) => void;
}

export class Server implements IServer {
  private _server: Express;
  private _port: number;

  constructor(port: number) {
    this._server = express();
    this._port = port;
  }

  use(...handles: HttpHandler[]) {
    this._server.use(handles);
  }

  start() {
    this._server.listen(this._port, () => {
      console.log(`Servidor rodando na porta ${this._port}`);
    });
  }
}
