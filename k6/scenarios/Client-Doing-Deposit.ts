import {
  AcharContasPorCpf,
  GetConta,
  GetTransacoes,
  LoginCliente,
  PostDeposito,
} from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";

export default function (cliente: CriarClienteDTO, valor: number): boolean {
  var authToken = LoginCliente({
    email: cliente.email,
    senha: cliente.senha,
  }).token;
  var contas = AcharContasPorCpf(cliente.cpf, authToken);
  PostDeposito(contas[0].id, valor, authToken);
  var conta = GetConta(contas[0].id, authToken);

  if (conta.saldo == 0) {
    return false; //erro no deposito
  }

  var transacoes = GetTransacoes(conta.id, authToken);

  return true;
}
