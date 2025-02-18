import {
  IsString,
  MinLength,
  IsDateString,
  IsEmail,
  Validate,
} from "class-validator";
import { Transform } from "class-transformer";
import { remove as removeAccents } from "remove-accents";
import { format } from "date-fns";

// Helpers
import { cleanDigits } from "@/common/helpers/cleanDigits.helper";

// Messages
import { MESSAGES } from "@/common/messages";

// Validators
import { CPFValidator } from "@/common/validators/cpf.validator";

export class CreateClientDto {
  @IsString({
    message: MESSAGES.validation.IsString("nome"),
  })
  @MinLength(3, { message: MESSAGES.validation.MinLength("nome", 3) })
  @Transform((params) => removeAccents(String(params.value).toUpperCase()))
  nome: string;

  @IsString({
    message: MESSAGES.validation.IsString("cpf"),
  })
  @Validate(CPFValidator, {
    message: MESSAGES.validation.InvalidCPF("cpf"),
  })
  @Transform((params) => cleanDigits(params.value))
  cpf: string;

  @IsString({
    message: MESSAGES.validation.IsString("telefone"),
  })
  @Transform((params) => cleanDigits(params.value))
  telefone: string;

  @IsDateString(
    {},
    { message: MESSAGES.validation.IsDateString("dataDeNascimento") }
  )
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd"))
  dataDeNascimento: string;

  @IsEmail({}, { message: MESSAGES.validation.IsEmail("email") })
  email: string;

  @IsString({
    message: MESSAGES.validation.IsString("senha"),
  })
  @MinLength(8, { message: MESSAGES.validation.MinLength("senha", 8) })
  senha: string;
}
