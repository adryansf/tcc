import { IsUUID } from "class-validator";

// Messages
import { MESSAGES } from "@/app/common/messages";

export class ParamsTransactionsDto {
  @IsUUID("all", { message: MESSAGES.validation.IsUUID("idOriginAccount") })
  idOriginAccount: string;
}
