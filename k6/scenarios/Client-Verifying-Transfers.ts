import { AcharContasPorCpf, GetConta, GetTransacoes, LoginCliente } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";


export default function (cliente: CriarClienteDTO) {
    var authToken = LoginCliente({email: cliente.email, senha: cliente.senha}).token
    var contas = AcharContasPorCpf(cliente.cpf, authToken)
    var conta = GetConta(contas[0].id, authToken)
    var transacoes = GetTransacoes(conta.id, authToken)
}