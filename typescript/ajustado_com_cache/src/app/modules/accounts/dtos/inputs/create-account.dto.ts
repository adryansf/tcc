import { IsString, IsEnum, IsUUID, IsOptional } from "class-validator";

// Messages
import { MESSAGES } from "@/common/messages";

// Types
import { AccountTypeEnum } from "../../enums/account-type.enum";

export class CreateAccountDto {
  @IsString({
    message: MESSAGES.validation.IsString("tipo"),
  })
  @IsEnum(AccountTypeEnum)
  tipo: AccountTypeEnum;

  @IsOptional()
  @IsUUID("all", {
    message: MESSAGES.validation.IsUUID("idAgencia"),
  })
  idAgencia?: string;

  @IsOptional()
  @IsUUID("all", {
    message: MESSAGES.validation.IsUUID("idCliente"),
  })
  idCliente?: string;
}
