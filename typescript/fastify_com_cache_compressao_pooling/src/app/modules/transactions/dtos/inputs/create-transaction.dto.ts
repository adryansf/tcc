import {
  IsString,
  IsEnum,
  IsUUID,
  IsPositive,
  IsOptional,
} from "class-validator";

// Messages
import { MESSAGES } from "@/common/messages";

// Validators
import { IsTransactionValid } from "@/app/common/validators/transaction.validator";

// Types
import { TransactionTypeEnum } from "../../enums/transaction-type.enum";

export class CreateTransactionDto {
  @IsString({
    message: MESSAGES.validation.IsString("tipo"),
  })
  @IsEnum(TransactionTypeEnum)
  tipo: TransactionTypeEnum;

  @IsOptional()
  @IsUUID("all", {
    message: MESSAGES.validation.IsUUID("idContaOrigem"),
  })
  idContaOrigem?: string;

  @IsOptional()
  @IsUUID("all", {
    message: MESSAGES.validation.IsUUID("idContaDestino"),
  })
  idContaDestino?: string;

  @IsPositive({
    message: MESSAGES.validation.IsPositive("valor"),
  })
  valor: number;

  @IsTransactionValid()
  validateTransaction!: boolean;
}
