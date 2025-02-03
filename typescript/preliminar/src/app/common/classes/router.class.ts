import { Router as ExpressRouter } from "express";

import {
  NextFunction,
  Request,
  Response,
} from "@/app/common/interfaces/http.interfaces";

type IRenderFunction = (
  req: Request,
  res: Response,
  next?: NextFunction
) => any;

interface IRouter {
  get: (path: string, ...renders: IRenderFunction[]) => void;
  post: (path: string, ...renders: IRenderFunction[]) => void;
  put: (path: string, ...renders: IRenderFunction[]) => void;
  patch: (path: string, ...renders: IRenderFunction[]) => void;
  delete: (path: string, ...renders: IRenderFunction[]) => void;
  router: ExpressRouter;
}

export class Router implements IRouter {
  private _router: ExpressRouter;
  private _prefix?: string;

  constructor(prefix?: string) {
    this._router = ExpressRouter();
    this._prefix = prefix ? `/${prefix}` : "";
  }

  get(path: string, ...renders: IRenderFunction[]) {
    this._router.get(`${this._prefix}/${path}`, renders);
  }

  post(path: string, ...renders: IRenderFunction[]) {
    this._router.post(`${this._prefix}/${path}`, renders);
  }

  put(path: string, ...renders: IRenderFunction[]) {
    this._router.put(`${this._prefix}/${path}`, renders);
  }

  patch(path: string, ...renders: IRenderFunction[]) {
    this._router.patch(`${this._prefix}/${path}`, renders);
  }

  delete(path: string, ...renders: IRenderFunction[]) {
    this._router.delete(`${this._prefix}/${path}`, renders);
  }

  get router() {
    return this._router;
  }
}
