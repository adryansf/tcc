import { AcharContasPorCpf, GetConta, GetTransacoes, LoginCliente } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";
import { Gerente } from "../entities/entities.ts";


export default function (gerente: Gerente, clienteCpf: string) {
    var authToken = LoginCliente({email: gerente.email, senha: "12345678"}).token
    var contas = AcharContasPorCpf(clienteCpf, authToken)
    var conta = GetConta(contas[0].id, authToken)
    var transacoes = GetTransacoes(conta.id, authToken)
}