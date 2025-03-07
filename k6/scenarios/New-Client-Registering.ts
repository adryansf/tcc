import { sleep } from 'k6';
import { AcharPrimeiraAgencia, ClienteCriarPoupanca, CriarEndereco, LoginCliente, RegistrarCliente, } from '../BackendAdapter/BackendAdapter.ts';
import { gerarClienteAleatorio, gerarEnderecoAleatorio } from '../FakerUtils/FakerUtils.ts';
import { CriarClienteDTO } from '../entities/DTO/DTOS.ts';

export default function () : CriarClienteDTO{
    const cliente = gerarClienteAleatorio();
    
    RegistrarCliente(cliente)
    var authToken = LoginCliente({email: cliente.email, senha: cliente.senha}).token
    CriarEndereco(gerarEnderecoAleatorio(), authToken)
    var agencia = AcharPrimeiraAgencia(authToken)
    ClienteCriarPoupanca(agencia.id, authToken)

    return cliente;
}