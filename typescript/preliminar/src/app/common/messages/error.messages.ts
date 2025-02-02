export const errorMessages = {
  client: {
    NotFound: "Cliente não encontrado.",
    BadRequest: {
      EmailNotUnique: `O e-mail está em utilização.`,
      CPFNotUnique: `O CPF está em utilização.`,
    },
  },
  account: {
    BadRequest: {
      BranchNotExists: `A agência informada não existe.`,
      BalanceNotEnough: `Saldo insuficiente para realizar a transação.`,
    },
    NotFound: "Conta não encontrada.",
    NotFoundOrigin: `Conta de origem não encontrada.`,
    NotFoundTarget: `Conta de destino não encontrada.`,
  },
  auth: {
    BadRequest: "O e-mail e/ou senha incorretos.",
  },
  Unauthorized:
    "Você não possui permissão suficiente para acessar esse recurso.",
  BadRequest:
    "A requisição contém dados inválidos. Verifique os campos e tente novamente.",
  InternalServer: `Ocorreu uma falha inesperada. Contate o administrador.`,
  middleware: {
    auth: {
      BadRequest: {
        Unformatted: `Token mal formatado.`,
      },
    },
  },
};
