import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Either, left, right } from "../errors/either";

interface Error {
  errors: string;
}

export const validator = async (
  dto: new () => Object,
  toValidate: Object
): Promise<Either<Error, null>> => {
  const dtoInstance = plainToInstance(dto, toValidate);

  const errors: ValidationError[] = await validate(dtoInstance);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints || {}).join(", "))
      .join(", ");

    return left({ errors: errorMessages });
  }

  return right(null);
};
