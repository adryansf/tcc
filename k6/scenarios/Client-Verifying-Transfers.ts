import { AcharContasPorCpf, GetConta, GetTransacoes, LoginCliente } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";


export default function (cliente: CriarClienteDTO) {
    var authToken = LoginCliente({email: cliente.email, senha: cliente.senha})?.token

    if(authToken === null || authToken === undefined) {
        return;
    }

    var contas = AcharContasPorCpf(cliente.cpf, authToken)

    if(contas === null) {
        return
    }
    
    var conta = GetConta(contas[0].id, authToken)

    if(conta === null) {
        return
    }

    var transacoes = GetTransacoes(conta.id, authToken)
}