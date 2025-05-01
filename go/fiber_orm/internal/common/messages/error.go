package messages

var ErrorMessages = struct {
	Client struct {
		NotFound string
		BadRequest struct {
			EmailNotUnique string
			CPFNotUnique string
		}
	}
	Account struct {
		BadRequest struct {
			BranchRequired string
			BranchNotExists string
			BalanceNotEnough string
			IdClient string
			Origin string
			Target string
			SameAccount string
		}
		NotFound string
		NotFoundOrigin string
		NotFoundTarget string
	}
	Auth struct {
		BadRequest string
	}
	Address struct {
		BadRequest struct {
			AlreadyExists string
		}
		NotFound string
	}
	Unauthorized string
	BadRequest string
	InternalServer string
	Middleware struct {
		Auth struct {
			BadRequest struct {
				Unformatted string
			}
		}
	}
}{
	Client: struct {
		NotFound string
		BadRequest struct {
			EmailNotUnique string
			CPFNotUnique string
		}
	}{
		NotFound: "Cliente não encontrado.",
		BadRequest: struct {
			EmailNotUnique string
			CPFNotUnique string
		}{
			EmailNotUnique: "O e-mail está em utilização.",
			CPFNotUnique: "O CPF está em utilização.",
		},
	},
	Account: struct {
		BadRequest struct {
			BranchRequired string
			BranchNotExists string
			BalanceNotEnough string
			IdClient string
			Origin string
			Target string
			SameAccount string
		}
		NotFound string
		NotFoundOrigin string
		NotFoundTarget string
	}{
		BadRequest: struct {
			BranchRequired string
			BranchNotExists string
			BalanceNotEnough string
			IdClient string
			Origin string
			Target string
			SameAccount string
		}{
			BranchRequired: "Informe o ID da agência",
			BranchNotExists: "A agência informada não existe.",
			BalanceNotEnough: "Saldo insuficiente para realizar a transação.",
			IdClient: "O ID do cliente não foi informado.",
			Origin: "Conta de origem não informada.",
			Target: "Conta de destino não informada.",
			SameAccount: "A conta de origem não pode ser igual a conta de destino.",
		},
		NotFound: "Conta não encontrada.",
		NotFoundOrigin: "Conta de origem não encontrada.",
		NotFoundTarget: "Conta de destino não encontrada.",
	},
	Auth: struct {
		BadRequest string
	}{
		BadRequest: "O e-mail e/ou senha incorretos.",
	},
	Address: struct {
		BadRequest struct {
			AlreadyExists string
		}
		NotFound string
	}{
		BadRequest: struct {
			AlreadyExists string
		}{
			AlreadyExists: "O cliente possui um endereço cadastrado.",
		},
		NotFound: "Endereço não encontrado.",
	},
	Unauthorized: "Você não possui permissão suficiente para acessar esse recurso.",
	BadRequest: "A requisição contém dados inválidos. Verifique os campos e tente novamente.",
	InternalServer: "Ocorreu uma falha inesperada. Contate o administrador.",
	Middleware: struct {
		Auth struct {
			BadRequest struct {
				Unformatted string
			}
		}
	}{
		Auth: struct {
			BadRequest struct {
				Unformatted string
			}
		}{
			BadRequest: struct {
				Unformatted string
			}{
				Unformatted: "Token mal formatado.",
			},
		},
	},
}
