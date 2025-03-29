import http from 'k6/http';
import { check } from 'k6';
import { AuthTokenDTO, CriarClienteDTO, CriarContaDTO, CriarEnderecoDTO, ErrorDTO, LoginPayload, TransacaoPayload } from '../entities/DTO/DTOS.ts';
import { Agencia, Cliente, Conta, Gerente, Transacao } from '../entities/entities.ts';
import { TipoDeTransacao } from '../entities/enum/TipoDeTransacao.ts';

const BASE_URL = 'http://localhost:3333';
const TIMEOUT = '360s';

export function RegistrarCliente(clientePayload: CriarClienteDTO): boolean {
    let clienteRes = http.post(`${BASE_URL}/clientes`, JSON.stringify(clientePayload), { headers: { 'Content-Type': 'application/json' }, tags: { name: 'RegistrarCliente' }, timeout: TIMEOUT });

    check(clienteRes, { 'Cadastro de cliente bem-sucedido': (res) => res.status === 201 || res.status === 400 });

    if (clienteRes.status != 201) {
        var response = clienteRes.json() as unknown as ErrorDTO;

        if (response.message !== null) {
            return false;
        }
    }
    return true;
}

export function LoginCliente(loginPayload: LoginPayload): AuthTokenDTO {
    let loginRes = http.post(`${BASE_URL}/auth/login/clientes`, JSON.stringify(loginPayload), { headers: { 'Content-Type': 'application/json' }, tags: { name: 'LoginCliente' }, timeout: TIMEOUT });
    check(loginRes, { 'Login bem-sucedido': (res) => res.status === 200 });
    if (loginRes.status !== 200) {
        console.log(loginRes.error_code);
        console.log(loginPayload);
        console.log(loginRes.body);
    }
    return loginRes.json() as unknown as AuthTokenDTO;
}

export function CriarEndereco(enderecoPayload: CriarEnderecoDTO, authToken: string): void {
    let enderecoRes = http.post(`${BASE_URL}/enderecos`, JSON.stringify(enderecoPayload), authHeaders(authToken, 'CriarEndereco'));
    check(enderecoRes, { 'Endereço cadastrado': (res) => res.status === 201 });
    if (enderecoRes.status !== 201) {
        console.log(enderecoRes.error_code);
        console.log(enderecoPayload);
        console.log(enderecoRes.body);
    }
}

export function AcharPrimeiraAgencia(authToken: string): Agencia {
    let agenciasRes = http.get(`${BASE_URL}/agencias`, authHeaders(authToken, 'AcharPrimeiraAgencia'));
    check(agenciasRes, { 'Lista de agências obtida': (res) => res.status === 200 });
    if (agenciasRes.status !== 200) {
        console.log(agenciasRes.error_code);
        console.log(agenciasRes.body);
    }
    let agencias = agenciasRes.json() as unknown as Agencia[];
    return agencias[0];
}

export function ClienteCriarPoupanca(agenciaId: string, authToken: string): boolean {
    const contaPayload = { tipo: "POUPANCA", idAgencia: agenciaId } as CriarContaDTO;
    let contaRes = http.post(`${BASE_URL}/contas`, JSON.stringify(contaPayload), authHeaders(authToken, 'ClienteCriarPoupanca'));
    check(contaRes, { 'Conta criada': (res) => res.status === 201 });
    if (contaRes.status !== 201) {
        console.log(contaRes.error_code);
        console.log(contaPayload);
        console.log(contaRes.body);
        return false;
    }
    return true;
}

export function GerenteCriarPoupanca(clienteId: string, authToken: string): void {
    const contaPayload = { tipo: "POUPANCA", idCliente: clienteId } as CriarContaDTO;
    let contaRes = http.post(`${BASE_URL}/contas`, JSON.stringify(contaPayload), authHeaders(authToken, 'GerenteCriarPoupanca'));
    check(contaRes, { 'Conta criada': (res) => res.status === 201 });
    if (contaRes.status !== 201) {
        console.log(contaRes.error_code);
        console.log(contaPayload);
        console.log(contaRes.body);
    }
}

export function GetClientePorCpf(cpf: string, authToken: string): Cliente {
    let clienteRes = http.get(`${BASE_URL}/clientes/cpf/${cpf}`, authHeaders(authToken, 'GetClientePorCpf'));
    check(clienteRes, { 'Cliente obtido': (res) => res.status === 200 });
    if (clienteRes.status !== 200) {
        console.log(clienteRes.error_code);
        console.log(clienteRes.body);
    }
    return clienteRes.json() as unknown as Cliente;
}

export function AcharContasPorCpf(cpf: string, authToken: string): Conta[] {
    let contasRes = http.get(`${BASE_URL}/contas?cpf=${cpf}`, authHeaders(authToken, 'AcharContasPorCpf'));
    check(contasRes, { 'Lista de contas obtida': (res) => res.status === 200 });
    if (contasRes.status !== 200) {
        console.log(contasRes.error_code);
        console.log(contasRes.body);
    }
    return contasRes.json() as unknown as Conta[];
}

export function PostDeposito(contaId: string, valor: number, authToken: string): void {
    const depositoPayload = { valor, idContaDestino: contaId, tipo: TipoDeTransacao.DEPOSITO } as TransacaoPayload;
    var depositoRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(depositoPayload), authHeaders(authToken, 'PostDeposito'));
    check(depositoRes, { 'Depósito realizado': (res) => res.status === 201 });
    if (depositoRes.status !== 201) {
        console.log(depositoRes.error_code);
        console.log(depositoPayload);
        console.log(depositoRes.body);
    }
}

export function PostSaque(contaId: string, valor: number, authToken: string): void {
    const depositoPayload = { valor, idContaOrigem: contaId, tipo: TipoDeTransacao.SAQUE } as TransacaoPayload;
    var depositoRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(depositoPayload), authHeaders(authToken, 'PostSaque'));
    check(depositoRes, { 'Saque realizado': (res) => res.status === 201 });
    if (depositoRes.status !== 201) {
        console.log(depositoRes.error_code);
        console.log(depositoPayload);
        console.log(depositoRes.body);
    }
}

export function PostTransferencia(contaOrigemId: string, contaDestinoId: string, valor: number, authToken: string): void {
    const depositoPayload = { valor, idContaOrigem: contaOrigemId, tipo: TipoDeTransacao.TRANSFERENCIA, idContaDestino: contaDestinoId } as TransacaoPayload;
    var depositoRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(depositoPayload), authHeaders(authToken, 'PostTransferencia'));
    check(depositoRes, { 'Transferência realizada': (res) => res.status === 201 });
    if (depositoRes.status !== 201) {
        console.log(depositoRes.error_code);
        console.log(depositoPayload);
        console.log(depositoRes.body);
    }
}

export function GetConta(contaId: string, authToken: string): Conta {
    let contaRes = http.get(`${BASE_URL}/contas/${contaId}`, authHeaders(authToken, 'GetConta'));
    check(contaRes, { 'Conta obtida': (res) => res.status === 200 });
    if (contaRes.status !== 200) {
        console.log(contaRes.error_code);
        console.log(contaRes.body);
    }
    return contaRes.json() as unknown as Conta;
}

export function GetTransacoes(contaId: string, authToken: string): Transacao[] {
    let transacoesRes = http.get(`${BASE_URL}/transacoes?idConta=${contaId}`, authHeaders(authToken, 'GetTransacoes'));
    check(transacoesRes, { 'Lista de transações obtida': (res) => res.status === 200 });
    if (transacoesRes.status !== 200) {
        console.log(transacoesRes.error_code);
        console.log(transacoesRes.body);
    }
    return transacoesRes.json() as unknown as Transacao[];
}

export function LoginGerente(loginPayload: LoginPayload): AuthTokenDTO {
    let loginRes = http.post(`${BASE_URL}/auth/login/gerentes`, JSON.stringify(loginPayload), { headers: { 'Content-Type': 'application/json' }, tags: { name: 'LoginGerente' }, timeout: TIMEOUT });
    check(loginRes, { 'Login bem-sucedido': (res) => res.status === 200 });
    if (loginRes.status !== 200) {
        console.log(loginRes.error_code);
        console.log(loginPayload);
        console.log(loginRes.body);
    }
    return loginRes.json() as unknown as AuthTokenDTO;
}

export function GetClientesToTest(count: number): Cliente[] {
    let clientesRes = http.get(`${BASE_URL}/admin/clientes?quantidade=${count}`);
    check(clientesRes, { 'Lista de clientes obtida': (res) => res.status === 200 });
    if (clientesRes.status !== 200) {
        console.log(clientesRes.error_code);
        console.log(clientesRes.body);
    }
    return clientesRes.json() as unknown as Cliente[];
}

export function GetGerentesToTest(count: number): Gerente[] {
    let gerentesRes = http.get(`${BASE_URL}/admin/gerentes?quantidade=${count}`);
    check(gerentesRes, { 'Lista de gerentes obtida': (res) => res.status === 200 });
    if (gerentesRes.status !== 200) {
        console.log(gerentesRes.error_code);
        console.log(gerentesRes.body);
    }
    return gerentesRes.json() as unknown as Gerente[];
}

function authHeaders(authToken: string, functionName: string) {
    return { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }, tags: { name: functionName }, timeout: TIMEOUT };
}