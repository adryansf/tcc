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
      BranchRequired: `Informe o ID da agência`,
      BranchNotExists: `A agência informada não existe.`,
      BalanceNotEnough: `Saldo insuficiente para realizar a transação.`,
      IdClient: `O ID do cliente não foi informado.`,
      Origin: `Conta de origem não informada.`,
      Target: `Conta de destino não informada.`,
      SameAccount: `A conta de origem não pode ser igual a conta de destino.`,
    },
    NotFound: "Conta não encontrada.",
    NotFoundOrigin: `Conta de origem não encontrada.`,
    NotFoundTarget: `Conta de destino não encontrada.`,
  },
  auth: {
    BadRequest: "O e-mail e/ou senha incorretos.",
  },
  address: {
    BadRequest: {
      AlreadyExists: `O cliente possui um endereço cadastrado.`,
    },
    NotFound: "Endereço não encontrado.",
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
