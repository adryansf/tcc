import { AcharContasPorCpf, GerenteCriarPoupanca, GetClientePorCpf, GetConta, GetTransacoes, LoginCliente, LoginGerente } from "../BackendAdapter/BackendAdapter.ts";
import { CriarClienteDTO } from "../entities/DTO/DTOS.ts";
import { Gerente } from "../entities/entities.ts";


export default function (gerente: Gerente, clienteCpf: string) {
    var authToken = LoginGerente({email: gerente.email, senha: "12345678"}).token
    var cliente = GetClientePorCpf(clienteCpf, authToken)
    GerenteCriarPoupanca(cliente.id, authToken)
    var contas = AcharContasPorCpf(clienteCpf, authToken)
}