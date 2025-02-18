import { IsUUID } from "class-validator";

// Messages
import { MESSAGES } from "@/app/common/messages";

export class ParamsAddressDto {
  @IsUUID("all", { message: MESSAGES.validation.IsUUID("idClient") })
  idClient: string;
}
