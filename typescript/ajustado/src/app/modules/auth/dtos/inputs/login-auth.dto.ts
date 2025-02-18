import { IsString, MinLength, IsEmail } from "class-validator";

// Messages
import { MESSAGES } from "@/common/messages";

export class LoginAuthDto {
  @IsEmail({}, { message: MESSAGES.validation.IsEmail("email") })
  email: string;

  @IsString({
    message: MESSAGES.validation.IsString("senha"),
  })
  @MinLength(8, { message: MESSAGES.validation.MinLength("senha", 8) })
  senha: string;
}
