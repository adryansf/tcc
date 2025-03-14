import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { TransactionTypeEnum } from "@/app/modules/transactions/enums/transaction-type.enum"; // Ajuste o caminho conforme necessário
import { CreateTransactionDto } from "@/app/modules/transactions/dtos/inputs/create-transaction.dto";

@ValidatorConstraint({ name: "IsTransactionValid", async: false })
export class IsTransactionValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const { tipo, idContaOrigem, idContaDestino } =
      args.object as CreateTransactionDto;

    if (tipo === TransactionTypeEnum.DEPOSIT && !idContaDestino) {
      return false;
    }

    if (tipo === TransactionTypeEnum.WITHDRAWAL && !idContaOrigem) {
      return false;
    }

    if (
      tipo === TransactionTypeEnum.TRANSFER &&
      (!idContaOrigem || !idContaDestino)
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const { tipo } = args.object as CreateTransactionDto;
    if (tipo === TransactionTypeEnum.DEPOSIT) {
      return "idContaDestino é obrigatório para depósitos.";
    }
    if (tipo === TransactionTypeEnum.WITHDRAWAL) {
      return "idContaOrigem é obrigatório para saques.";
    }
    if (tipo === TransactionTypeEnum.TRANSFER) {
      return "idContaOrigem e idContaDestino são obrigatórios para transferências.";
    }
    return "Transação inválida.";
  }
}

export function IsTransactionValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTransactionValidConstraint,
    });
  };
}
