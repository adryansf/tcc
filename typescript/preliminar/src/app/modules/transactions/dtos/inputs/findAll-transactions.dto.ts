import { IsUUID } from "class-validator";

// Messages
import { MESSAGES } from "@/app/common/messages";

export class FindAllTransactionsDto {
  @IsUUID("all", { message: MESSAGES.validation.IsUUID("idConta") })
  idConta: string;
}
