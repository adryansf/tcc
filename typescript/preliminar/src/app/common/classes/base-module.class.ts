import { Router } from "./router.class";

export abstract class BaseModule<C, S, R> {
  protected _router: Router;

  constructor(
    protected _prefix: string,
    protected _controller: C,
    protected _service: S,
    protected _repository: R
  ) {
    this._router = new Router(_prefix);
    this.routes();
  }

  get router() {
    return this._router.router;
  }

  protected abstract routes(): void;
}
