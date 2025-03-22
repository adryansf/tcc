import { AcharContasPorCpf, GetConta, GetTransacoes, LoginCliente, PostDeposito, PostTransferencia } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";


export default function (clienteOrigem: CriarClienteDTO, cpfDestino: string, valor: number) {
    var authToken = LoginCliente({email: clienteOrigem.email, senha: clienteOrigem.senha}).token
    var contas = AcharContasPorCpf(clienteOrigem.cpf, authToken)
    var contaDestino = AcharContasPorCpf(cpfDestino, authToken)
    if(contaDestino.length == 0) {
        console.warn(`Conta de destino não encontrada para CPF ${cpfDestino}`)
        return
    }
    PostTransferencia(contas[0].id, contaDestino[0].id, valor, authToken)
    var conta = GetConta(contas[0].id, authToken)
    var transacoes = GetTransacoes(conta.id, authToken)
}