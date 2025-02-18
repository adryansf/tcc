import { IsString, MaxLength, IsOptional, MinLength } from "class-validator";
import { Transform } from "class-transformer";

// Messages
import { MESSAGES } from "@/common/messages";

// Helpers
import { cleanDigits } from "@/app/common/helpers/cleanDigits.helper";

export class CreateAddressDto {
  @IsString({
    message: MESSAGES.validation.IsString("logradouro"),
  })
  logradouro: string;

  @IsString({
    message: MESSAGES.validation.IsString("numero"),
  })
  numero: string;

  @IsString({
    message: MESSAGES.validation.IsString("bairro"),
  })
  bairro: string;

  @IsString({
    message: MESSAGES.validation.IsString("cidade"),
  })
  cidade: string;

  @IsString({
    message: MESSAGES.validation.IsString("uf"),
  })
  @MinLength(2, {
    message: MESSAGES.validation.MinLength("uf", 2),
  })
  @MaxLength(2, {
    message: MESSAGES.validation.MaxLength("uf", 2),
  })
  uf: string;

  @IsOptional()
  @IsString({
    message: MESSAGES.validation.IsString("complemento"),
  })
  complemento: string = "";

  @IsString({
    message: MESSAGES.validation.IsString("cep"),
  })
  @Transform((params) => cleanDigits(params.value))
  cep: string;
}
