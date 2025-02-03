export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  private _value: L;

  constructor(value: L) {
    this._value = value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }

  get value() {
    return this._value;
  }
}

export class Right<L, R> {
  private _value: R;

  constructor(value: R) {
    this._value = value;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }

  get value() {
    return this._value;
  }
}

export const left = <L, R>(l: L): Either<L, R> => {
  return new Left(l);
};

export const right = <L, R>(r: R): Either<L, R> => {
  return new Right(r);
};
