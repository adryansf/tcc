import { sleep } from 'k6';
import { AcharPrimeiraAgencia, ClienteCriarPoupanca, CriarEndereco, LoginCliente, RegistrarCliente, } from '../BackendAdapter/BackendAdapter.ts';
import { gerarClienteAleatorio, gerarEnderecoAleatorio } from '../FakerUtils/FakerUtils.ts';

export default function () {
    const cliente = gerarClienteAleatorio();
    
    RegistrarCliente(cliente)
    var authToken = LoginCliente({email: cliente.email, senha: cliente.senha}).token
    CriarEndereco(gerarEnderecoAleatorio(), authToken)
    var agencia = AcharPrimeiraAgencia(authToken)
    ClienteCriarPoupanca(agencia.id, authToken)

    sleep(1); // Espera entre execuções para simular usuários reais
}