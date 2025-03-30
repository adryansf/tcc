import { AcharContasPorCpf, GetConta, GetTransacoes, LoginCliente, PostDeposito, PostSaque } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";


export default function (cliente: CriarClienteDTO, valor: number) {
    var authToken = LoginCliente({email: cliente.email, senha: cliente.senha})?.token
    
    if(authToken === null || authToken === undefined) {
        return;
    }

    var contas = AcharContasPorCpf(cliente.cpf, authToken)

    if(contas === null) {
        return;
    }

    PostSaque(contas[0].id, valor, authToken)
    var conta = GetConta(contas[0].id, authToken)

    if(conta === null) {
        return
    }

    var transacoes = GetTransacoes(conta.id, authToken)
}