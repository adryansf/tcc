pub struct ErrorMessages;

impl ErrorMessages {
    pub const CLIENT_NOT_FOUND: &'static str = "Cliente não encontrado.";
    pub const CLIENT_BAD_REQUEST_EMAIL_NOT_UNIQUE: &'static str = "O e-mail está em utilização.";
    pub const CLIENT_BAD_REQUEST_CPF_NOT_UNIQUE: &'static str = "O CPF está em utilização.";

    pub const ACCOUNT_BAD_REQUEST_BRANCH_REQUIRED: &'static str = "Informe o ID da agência";
    pub const ACCOUNT_BAD_REQUEST_BRANCH_NOT_EXISTS: &'static str = "A agência informada não existe.";
    pub const ACCOUNT_BAD_REQUEST_BALANCE_NOT_ENOUGH: &'static str = "Saldo insuficiente para realizar a transação.";
    pub const ACCOUNT_BAD_REQUEST_ID_CLIENT: &'static str = "O ID do cliente não foi informado.";
    pub const ACCOUNT_BAD_REQUEST_SAME_ACCOUNT: &'static str = "A conta de origem não pode ser igual a conta de destino.";
    pub const ACCOUNT_NOT_FOUND: &'static str = "Conta não encontrada.";
    pub const ACCOUNT_NOT_FOUND_ORIGIN: &'static str = "Conta de origem não encontrada.";
    pub const ACCOUNT_NOT_FOUND_TARGET: &'static str = "Conta de destino não encontrada.";

    pub const AUTH_BAD_REQUEST: &'static str = "O e-mail e/ou senha incorretos.";

    pub const ADDRESS_BAD_REQUEST_ALREADY_EXISTS: &'static str = "O cliente possui um endereço cadastrado.";

    pub const UNAUTHORIZED: &'static str = "Você não possui permissão suficiente para acessar esse recurso.";
    pub const BAD_REQUEST: &'static str = "A requisição contém dados inválidos. Verifique os campos e tente novamente.";
    pub const INTERNAL_SERVER: &'static str = "Ocorreu uma falha inesperada. Contate o administrador.";

    pub const MIDDLEWARE_AUTH_BAD_REQUEST_UNFORMATTED: &'static str = "Token mal formatado.";
}