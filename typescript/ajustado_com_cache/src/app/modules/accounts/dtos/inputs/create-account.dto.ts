import { IsString, IsEnum, IsUUID } from "class-validator";

// Messages
import { MESSAGES } from "@/common/messages";

// Types
import { AccountTypeEnum } from "../../enums/account-type.enum";

export class CreateAccountDto {
  @IsString({
    message: MESSAGES.validation.IsString("numero"),
  })
  @IsEnum(AccountTypeEnum)
  tipo: AccountTypeEnum;

  @IsUUID("all", {
    message: MESSAGES.validation.IsUUID("idAgencia"),
  })
  idAgencia: string;
}
