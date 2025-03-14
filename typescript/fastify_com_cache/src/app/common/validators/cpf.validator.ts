import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { isValid } from "cpf";

@ValidatorConstraint({ name: "cpf", async: false })
export class CPFValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return isValid(text);
  }

  defaultMessage(args: ValidationArguments) {
    return "($value) não é um CPF válido.";
  }
}
