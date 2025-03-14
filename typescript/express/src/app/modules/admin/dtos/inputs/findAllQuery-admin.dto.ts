import { IsInt, IsPositive } from "class-validator";
import { Transform } from "class-transformer";

// Messages
import { MESSAGES } from "@/app/common/messages";

export class FindAllQueryAdminDto {
  @Transform(({ value }) => Number(value))
  @IsInt({
    message: MESSAGES.validation.IsInt("quantidade"),
  })
  @IsPositive({
    message: MESSAGES.validation.IsPositive("quantidade"),
  })
  quantidade: number;
}
