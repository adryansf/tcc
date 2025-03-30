import { AcharContasPorCpf, GetConta, GetTransacoes, LoginCliente, PostDeposito, PostTransferencia } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";


export default function (clienteOrigem: CriarClienteDTO, cpfDestino: string, valor: number) {
    var authToken = LoginCliente({email: clienteOrigem.email, senha: clienteOrigem.senha})?.token

    if(authToken === null || authToken === undefined) {
        return;
    }

    var contas = AcharContasPorCpf(clienteOrigem.cpf, authToken)

    if(contas === null) {
        return;
    }

    var contaDestino = AcharContasPorCpf(cpfDestino, authToken)

    if(contaDestino === null || contaDestino.length == 0) {
        console.warn(`Conta de destino não encontrada para CPF ${cpfDestino}`)
        return
    }

    PostTransferencia(contas[0].id, contaDestino[0].id, valor, authToken)

    var conta = GetConta(contas[0].id, authToken)

    if(conta === null) {
        return
    }

    var transacoes = GetTransacoes(conta.id, authToken)
}