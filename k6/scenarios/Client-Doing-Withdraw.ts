import { AcharContasPorCpf, GetConta, GetTransacoes, LoginCliente, PostDeposito, PostSaque } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";


export default function (cliente: CriarClienteDTO, valor: number) {
    var authToken = LoginCliente({email: cliente.email, senha: cliente.senha}).token
    var contas = AcharContasPorCpf(cliente.cpf, authToken)
    PostSaque(contas[0].id, valor, authToken)
    var conta = GetConta(contas[0].id, authToken)
    var transacoes = GetTransacoes(conta.id, authToken)
}