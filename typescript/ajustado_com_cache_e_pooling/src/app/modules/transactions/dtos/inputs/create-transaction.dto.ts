import {
  IsString,
  IsEnum,
  IsUUID,
  IsPositive,
  IsOptional,
} from "class-validator";

// Messages
import { MESSAGES } from "@/common/messages";

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
    message: MESSAGES.validation.IsUUID("idContaDestino"),
  })
  idContaDestino?: string;

  @IsPositive({
    message: MESSAGES.validation.IsPositive("valor"),
  })
  valor: number;
}
