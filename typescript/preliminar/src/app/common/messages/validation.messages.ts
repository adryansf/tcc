export const validationMessages = {
  IsEmail: (fieldName: string) => `O campo ${fieldName} deve ser um email.`,
  IsString: (fieldName: string) => `O campo ${fieldName} deve ser uma string.`,
  MinLength: (fieldName: string, minLength: number) =>
    `O campo ${fieldName} deve ter no mínimo ${minLength} caracteres.`,
  IsInt: (fieldName: string) => `O campo ${fieldName} deve ser um inteiro.`,
  IsBoolean: (fieldName: string) =>
    `O campo ${fieldName} deve ser um valor booleano.`,
  InvalidCPF: (fieldName: string) =>
    `O campo ${fieldName} deve ser um CPF válido.`,
  IsUUID: (fieldName: string) => `O campo ${fieldName} deve ser um UUID.`,
  IsPositive: (fieldName: string) =>
    `O campo ${fieldName} deve ser um valor positivo.`,
  IsDateString: (fieldName: string) =>
    `O campo ${fieldName} deve ser uma data válida.`,
};
