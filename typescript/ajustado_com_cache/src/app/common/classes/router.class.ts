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
    this._prefix = prefix ? `/${prefix}` : "";
  }

  get(path: string, ...renders: IRenderFunction[]) {
    const handler = renders.pop();

    this._router.push({
      method: "GET",
      url: `${this._prefix}/${path}`,
      preHandler: renders,
      handler: async (req, res) => {
        await handler(req, res);
      },
    });
  }

  post(path: string, ...renders: IRenderFunction[]) {
    const handler = renders.pop();

    this._router.push({
      method: "POST",
      url: `${this._prefix}/${path}`,
      preHandler: renders,
      handler: async (req, res) => {
        await handler(req, res);
      },
    });
  }

  put(path: string, ...renders: IRenderFunction[]) {
    const handler = renders.pop();

    this._router.push({
      method: "PUT",
      url: `${this._prefix}/${path}`,
      preHandler: renders,
      handler: async (req, res) => {
        await handler(req, res);
      },
    });
  }

  patch(path: string, ...renders: IRenderFunction[]) {
    const handler = renders.pop();

    this._router.push({
      method: "PATCH",
      url: `${this._prefix}/${path}`,
      preHandler: renders,
      handler: async (req, res) => {
        await handler(req, res);
      },
    });
  }

  delete(path: string, ...renders: IRenderFunction[]) {
    const handler = renders.pop();

    this._router.push({
      method: "DELETE",
      url: `${this._prefix}/${path}`,
      preHandler: renders,
      handler: async (req, res) => {
        await handler(req, res);
      },
    });
  }

  get router() {
    return this._router;
  }
}
