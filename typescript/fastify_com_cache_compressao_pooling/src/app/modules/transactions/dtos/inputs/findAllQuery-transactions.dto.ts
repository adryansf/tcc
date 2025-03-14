import { IsUUID } from "class-validator";

// Messages
import { MESSAGES } from "@/app/common/messages";

export class FindAllQueryTransactionsDto {
  @IsUUID("all", { message: MESSAGES.validation.IsUUID("idConta") })
  idConta?: string;
}
