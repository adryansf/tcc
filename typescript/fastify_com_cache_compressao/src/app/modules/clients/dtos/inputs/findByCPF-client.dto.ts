import { IsString, Validate } from "class-validator";
import { Transform } from "class-transformer";

// Utils
import { cleanDigits } from "@/app/common/helpers/cleanDigits.helper";

// Validator
import { CPFValidator } from "@/app/common/validators/cpf.validator";

// Messages
import { MESSAGES } from "@/app/common/messages";

export class FindByCPFClientDto {
  @IsString({
    message: MESSAGES.validation.IsString("cpf"),
  })
  @Validate(CPFValidator, {
    message: MESSAGES.validation.InvalidCPF("cpf"),
  })
  @Transform((params) => cleanDigits(params.value))
  cpf: string;
}
