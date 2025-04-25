import { instanceToPlain, plainToInstance } from "class-transformer";

export const transformer = <T>(dto: new () => T, toTransform: Object): T => {
  const instance = plainToInstance(dto, toTransform);
  return instanceToPlain(instance) as T;
};
