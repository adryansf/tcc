import { RouteOptions } from "fastify";

import { Request, Response } from "@/app/common/interfaces/http.interfaces";

type IRenderFunction = (req: Request, res: Response) => any;

interface IRouter {
  get: (path: string, ...renders: IRenderFunction[]) => void;
  post: (path: string, ...renders: IRenderFunction[]) => void;
  put: (path: string, ...renders: IRenderFunction[]) => void;
  patch: (path: string, ...renders: IRenderFunction[]) => void;
  delete: (path: string, ...renders: IRenderFunction[]) => void;
  router: RouteOptions[];
}

export class Router implements IRouter {
  private _router: RouteOptions[];
  private _prefix?: string;

  constructor(prefix?: string) {
    this._router = [];
    this._prefix = prefix ? `/${prefix.replace(/^\/+/, "")}` : "";
  }

  private formatPath(path: string): string {
    if (!path) return "";
    return path.startsWith("/") ? path : `/${path}`;
  }

  private addRoute(method: string, path: string, renders: IRenderFunction[]) {
    const handler = renders.pop();
    this._router.push({
      method,
      url: `${this._prefix}${this.formatPath(path)}`,
      preHandler: renders,
      handler: async (req, res) => {
        await handler(req, res);
      },
    });
  }

  get(path: string, ...renders: IRenderFunction[]) {
    this.addRoute("GET", path, renders);
  }

  post(path: string, ...renders: IRenderFunction[]) {
    this.addRoute("POST", path, renders);
  }

  put(path: string, ...renders: IRenderFunction[]) {
    this.addRoute("PUT", path, renders);
  }

  patch(path: string, ...renders: IRenderFunction[]) {
    this.addRoute("PATCH", path, renders);
  }

  delete(path: string, ...renders: IRenderFunction[]) {
    this.addRoute("DELETE", path, renders);
  }

  get router() {
    return this._router;
  }
}
