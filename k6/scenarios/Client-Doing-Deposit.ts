import {
  AcharContasPorCpf,
  GetConta,
  GetTransacoes,
  LoginCliente,
  PostDeposito,
} from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";

export default function (cliente: CriarClienteDTO, valor: number): boolean {
    var authToken = LoginCliente({email: cliente.email, senha: cliente.senha})?.token

    if(authToken === null || authToken === undefined) {
        return false;
    }

    var contas = AcharContasPorCpf(cliente.cpf, authToken!)

    if(contas === null) {
        return false;
    }

    PostDeposito(contas[0].id, valor, authToken!)
    var conta = GetConta(contas[0].id, authToken!)

    if(conta === null) {
        return false;
    }

    if (conta.saldo == 0) {
      return false; //erro no deposito
    }

    var transacoes = GetTransacoes(conta.id, authToken!)
    return true
}
