import { AcharContasPorCpf, GetConta, GetTransacoes, LoginGerente } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";
import { Gerente } from "../entities/entities.ts";


export default function (gerente: Gerente, clienteCpf: string) {
    var authToken = LoginGerente({email: gerente.email, senha: "12345678"}).token
    var contas = AcharContasPorCpf(clienteCpf, authToken)
    if(contas.length == 0) {
        console.warn(`Conta de destino não encontrada para CPF ${clienteCpf}`)
        return
    }
    var conta = GetConta(contas[0].id, authToken)
    var transacoes = GetTransacoes(conta.id, authToken)
}