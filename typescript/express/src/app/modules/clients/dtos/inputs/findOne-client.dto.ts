import { IsUUID } from "class-validator";

// Messages
import { MESSAGES } from "@/app/common/messages";

export class FindOneClientDto {
  @IsUUID("all", { message: MESSAGES.validation.IsUUID("id") })
  id: string;
}
