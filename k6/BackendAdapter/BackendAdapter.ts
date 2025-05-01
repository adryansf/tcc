import http from 'k6/http';
import { check } from 'k6';
import { AuthTokenDTO, CriarClienteDTO, CriarContaDTO, CriarEnderecoDTO, LoginPayload, TransacaoPayload } from '../entities/DTO/DTOS.ts';
import { Agencia, Cliente, Conta, Gerente, Transacao } from '../entities/entities.ts';
import { TipoDeTransacao } from '../entities/enum/TipoDeTransacao.ts';

const BASE_URL = 'http://localhost:3333';
const TIMEOUT = '360s';

export function RegistrarCliente(clientePayload: CriarClienteDTO): boolean {
    let clienteRes = http.post(`${BASE_URL}/clientes`, JSON.stringify(clientePayload), { 
        headers: { 
            'Content-Type': 'application/json', 
        }, 
        tags: { name: 'RegistrarCliente' }, 
        timeout: TIMEOUT 
    });

    //console.log('[RegistrarCliente] Enviando requisição para /clientes');
    check(clienteRes, { 'Cadastro de cliente bem-sucedido': (res) => res.status === 201 || res.status === 400 });

    if (clienteRes.status != 201) {
        //console.log('[RegistrarCliente] Falha ao registrar cliente');
        //console.log('Payload:', clientePayload);
        //console.log('Resposta:', clienteRes.body);
        return false;
    }
    return true;
}

export function LoginCliente(loginPayload: LoginPayload): AuthTokenDTO | null {
    let loginRes = http.post(`${BASE_URL}/auth/login/clientes`, JSON.stringify(loginPayload), { 
        headers: { 
            'Content-Type': 'application/json', 
            'Accept-Encoding': 'gzip' 
        }, 
        tags: { name: 'LoginCliente' }, 
        timeout: TIMEOUT 
    });

    //console.log('[LoginCliente] Enviando requisição para /auth/login/clientes');
    check(loginRes, { 'Login bem-sucedido': (res) => res.status === 200 });

    if (loginRes.status !== 200) {
        //console.log('[LoginCliente] Falha ao realizar login');
        //console.log('Payload:', loginPayload);
        //console.log('Resposta:', loginRes.body);
        return null;
    }
    return loginRes.json() as unknown as AuthTokenDTO;
}

export function CriarEndereco(enderecoPayload: CriarEnderecoDTO, authToken: string): boolean {
    let enderecoRes = http.post(`${BASE_URL}/enderecos`, JSON.stringify(enderecoPayload), authHeaders(authToken, 'CriarEndereco'));

    //console.log('[CriarEndereco] Enviando requisição para /enderecos');
    check(enderecoRes, { 'Endereço cadastrado': (res) => res.status === 201 });

    if (enderecoRes.status !== 201) {
        //console.log('[CriarEndereco] Falha ao criar endereço');
        //console.log('Payload:', enderecoPayload);
        //console.log('Resposta:', enderecoRes.body);
        return false;
    }
    return true;
}

export function AcharPrimeiraAgencia(authToken: string): Agencia | null {
    let agenciasRes = http.get(`${BASE_URL}/agencias`, authHeaders(authToken, 'AcharPrimeiraAgencia'));

    //console.log('[AcharPrimeiraAgencia] Enviando requisição para /agencias');
    check(agenciasRes, { 'Lista de agências obtida': (res) => res.status === 200 });

    if (agenciasRes.status !== 200) {
        //console.log('[AcharPrimeiraAgencia] Falha ao obter lista de agências');
        //console.log('Resposta:', agenciasRes.body);
        return null;
    }
    let agencias = agenciasRes.json() as unknown as Agencia[];
    return agencias[0];
}

export function ClienteCriarPoupanca(agenciaId: string, authToken: string): boolean {
    const contaPayload = { tipo: "POUPANCA", idAgencia: agenciaId } as CriarContaDTO;
    let contaRes = http.post(`${BASE_URL}/contas`, JSON.stringify(contaPayload), authHeaders(authToken, 'ClienteCriarPoupanca'));

    //console.log('[ClienteCriarPoupanca] Enviando requisição para /contas');
    check(contaRes, { 'Conta criada': (res) => res.status === 201 });

    if (contaRes.status !== 201) {
        //console.log('[ClienteCriarPoupanca] Falha ao criar conta poupança');
        //console.log('Payload:', contaPayload);
        //console.log('Resposta:', contaRes.body);
        return false;
    }
    return true;
}

export function GerenteCriarPoupanca(clienteId: string, authToken: string): boolean {
    const contaPayload = { tipo: "POUPANCA", idCliente: clienteId } as CriarContaDTO;
    let contaRes = http.post(`${BASE_URL}/contas`, JSON.stringify(contaPayload), authHeaders(authToken, 'GerenteCriarPoupanca'));

    //console.log('[GerenteCriarPoupanca] Enviando requisição para /contas');
    check(contaRes, { 'Conta criada': (res) => res.status === 201 });

    if (contaRes.status !== 201) {
        //console.log('[GerenteCriarPoupanca] Falha ao criar conta poupança');
        //console.log('Payload:', contaPayload);
        //console.log('Resposta:', contaRes.body);
        return false;
    }
    return true;
}

export function GetClientePorCpf(cpf: string, authToken: string): Cliente | null {
    let clienteRes = http.get(`${BASE_URL}/clientes/cpf/${cpf}`, authHeaders(authToken, 'GetClientePorCpf'));

    //console.log('[GetClientePorCpf] Enviando requisição para /clientes/cpf/{cpf}');
    check(clienteRes, { 'Cliente obtido': (res) => res.status === 200 });

    if (clienteRes.status !== 200) {
        //console.log('[GetClientePorCpf] Falha ao obter cliente');
        //console.log('CPF:', cpf);
        //console.log('Resposta:', clienteRes.body);
        return null;
    }
    return clienteRes.json() as unknown as Cliente;
}

export function AcharContasPorCpf(cpf: string, authToken: string): Conta[] | null {
    let contasRes = http.get(`${BASE_URL}/contas?cpf=${cpf}`, authHeaders(authToken, 'AcharContasPorCpf'));

    //console.log('[AcharContasPorCpf] Enviando requisição para /contas?cpf={cpf}');
    check(contasRes, { 'Lista de contas obtida': (res) => res.status === 200 });

    if (contasRes.status !== 200) {
        //console.log('[AcharContasPorCpf] Falha ao obter contas');
        //console.log('CPF:', cpf);
        //console.log('Resposta:', contasRes.body);
        return null;
    }
    return contasRes.json() as unknown as Conta[];
}

export function PostDeposito(contaId: string, valor: number, authToken: string): boolean {
    const depositoPayload = { valor, idContaDestino: contaId, tipo: TipoDeTransacao.DEPOSITO } as TransacaoPayload;
    let depositoRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(depositoPayload), authHeaders(authToken, 'PostDeposito'));

    //console.log('[PostDeposito] Enviando requisição para /transacoes');
    check(depositoRes, { 'Depósito realizado': (res) => res.status === 201 });

    if (depositoRes.status !== 201) {
        //console.log('[PostDeposito] Falha ao realizar depósito');
        //console.log('Payload:', depositoPayload);
        //console.log('Resposta:', depositoRes.body);
        return false;
    }
    return true;
}

export function PostSaque(contaId: string, valor: number, authToken: string): boolean {
    const saquePayload = { valor, idContaOrigem: contaId, tipo: TipoDeTransacao.SAQUE } as TransacaoPayload;
    let saqueRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(saquePayload), authHeaders(authToken, 'PostSaque'));

    //console.log('[PostSaque] Enviando requisição para /transacoes');
    check(saqueRes, { 'Saque realizado': (res) => res.status === 201 });

    if (saqueRes.status !== 201) {
        //console.log('[PostSaque] Falha ao realizar saque');
        //console.log('Payload:', saquePayload);
        //console.log('Resposta:', saqueRes.body);
        return false;
    }
    return true;
}

export function PostTransferencia(contaOrigemId: string, contaDestinoId: string, valor: number, authToken: string): boolean {
    const transferenciaPayload = { valor, idContaOrigem: contaOrigemId, tipo: TipoDeTransacao.TRANSFERENCIA, idContaDestino: contaDestinoId } as TransacaoPayload;
    let transferenciaRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(transferenciaPayload), authHeaders(authToken, 'PostTransferencia'));

    //console.log('[PostTransferencia] Enviando requisição para /transacoes');
    check(transferenciaRes, { 'Transferência realizada': (res) => res.status === 201 });

    if (transferenciaRes.status !== 201) {
        //console.log('[PostTransferencia] Falha ao realizar transferência');
        //console.log('Payload:', transferenciaPayload);
        //console.log('Resposta:', transferenciaRes.body);
        return false;
    }
    return true;
}

export function GetConta(contaId: string, authToken: string): Conta | null {
    let contaRes = http.get(`${BASE_URL}/contas/${contaId}`, authHeaders(authToken, 'GetConta'));

    //console.log('[GetConta] Enviando requisição para /contas/{contaId}');
    check(contaRes, { 'Conta obtida': (res) => res.status === 200 });

    if (contaRes.status !== 200) {
        //console.log('[GetConta] Falha ao obter conta');
        //console.log('Conta ID:', contaId);
        //console.log('Resposta:', contaRes.body);
        return null;
    }
    return contaRes.json() as unknown as Conta;
}

export function GetTransacoes(contaId: string, authToken: string): Transacao[] | null {
    let transacoesRes = http.get(`${BASE_URL}/transacoes?idConta=${contaId}`, authHeaders(authToken, 'GetTransacoes'));

    //console.log('[GetTransacoes] Enviando requisição para /transacoes?idConta={contaId}');
    check(transacoesRes, { 'Lista de transações obtida': (res) => res.status === 200 });

    if (transacoesRes.status !== 200) {
        //console.log('[GetTransacoes] Falha ao obter transações');
        //console.log('Conta ID:', contaId);
        //console.log('Resposta:', transacoesRes.body);
        return null;
    }
    return transacoesRes.json() as unknown as Transacao[];
}

export function LoginGerente(loginPayload: LoginPayload): AuthTokenDTO | null {
    let loginRes = http.post(`${BASE_URL}/auth/login/gerentes`, JSON.stringify(loginPayload), { 
        headers: { 
            'Content-Type': 'application/json', 
            'Accept-Encoding': 'gzip' 
        }, 
        tags: { name: 'LoginGerente' }, 
        timeout: TIMEOUT 
    });

    //console.log('[LoginGerente] Enviando requisição para /auth/login/gerentes');
    check(loginRes, { 'Login bem-sucedido': (res) => res.status === 200 });

    if (loginRes.status !== 200) {
        //console.log('[LoginGerente] Falha ao realizar login');
        //console.log('Payload:', loginPayload);
        //console.log('Resposta:', loginRes.body);
        return null;
    }
    return loginRes.json() as unknown as AuthTokenDTO;
}

export function GetClientesToTest(count: number): Cliente[] | null {
    let clientesRes = http.get(`${BASE_URL}/admin/clientes?quantidade=${count}`);

    //console.log('[GetClientesToTest] Enviando requisição para /admin/clientes?quantidade={count}');
    check(clientesRes, { 'Lista de clientes obtida': (res) => res.status === 200 });

    if (clientesRes.status !== 200) {
        //console.log('[GetClientesToTest] Falha ao obter lista de clientes');
        //console.log('Resposta:', clientesRes.body);
        return null;
    }
    return clientesRes.json() as unknown as Cliente[];
}

export function GetGerentesToTest(count: number): Gerente[] | null {
    let gerentesRes = http.get(`${BASE_URL}/admin/gerentes?quantidade=${count}`);

    //console.log('[GetGerentesToTest] Enviando requisição para /admin/gerentes?quantidade={count}');
    check(gerentesRes, { 'Lista de gerentes obtida': (res) => res.status === 200 });

    if (gerentesRes.status !== 200) {
        //console.log('[GetGerentesToTest] Falha ao obter lista de gerentes');
        //console.log('Resposta:', gerentesRes.body);
        return null;
    }
    return gerentesRes.json() as unknown as Gerente[];
}

function authHeaders(authToken: string, functionName: string) {
    return { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' }, tags: { name: functionName }, timeout: TIMEOUT };
}