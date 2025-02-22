import http from 'k6/http';
import { check } from 'k6';
import { AuthTokenDTO, CriarClienteDTO, CriarContaDTO, CriarEnderecoDTO, LoginPayload, TransacaoPayload } from '../entities/DTO/DTOS.ts';
import { Agencia, Conta, Transacao } from '../entities/entities.ts';
import { TipoDeTransacao } from '../entities/enum/TipoDeTransacao.ts';


const BASE_URL = 'http://localhost:8080';


export function RegistrarCliente(clientePayload: CriarClienteDTO): void {
    let clienteRes = http.post(`${BASE_URL}/clientes`, JSON.stringify(clientePayload), { headers: { 'Content-Type': 'application/json' } });
    check(clienteRes, { 'Cadastro de cliente bem-sucedido': (res) => res.status === 201 });
}

export function LoginCliente(loginPayload: LoginPayload): AuthTokenDTO {
    let loginRes = http.post(`${BASE_URL}/auth/login/clientes`, JSON.stringify(loginPayload), { headers: { 'Content-Type': 'application/json' } });
    check(loginRes, { 'Login bem-sucedido': (res) => res.status === 200 });
    return loginRes.json() as unknown as AuthTokenDTO;
}

export function CriarEndereco(enderecoPayload: CriarEnderecoDTO, authToken: string): void {
    let enderecoRes = http.post(`${BASE_URL}/enderecos`, JSON.stringify(enderecoPayload), authHeaders(authToken));
    check(enderecoRes, { 'Endereço cadastrado': (res) => res.status === 201 });
}

export function AcharPrimeiraAgencia(authToken: string): Agencia {
    let agenciasRes = http.get(`${BASE_URL}/agencias`, authHeaders(authToken));
    check(agenciasRes, { 'Lista de agências obtida': (res) => res.status === 200 });
    let agencias = agenciasRes.json() as unknown as Agencia[];
    return agencias[0];
}

export function ClienteCriarPoupanca(agenciaId: string, authToken: string): void {
    const contaPayload = { tipo: "POUPANCA", idAgencia: agenciaId } as CriarContaDTO;
    let contaRes = http.post(`${BASE_URL}/contas`, JSON.stringify(contaPayload), authHeaders(authToken));
    check(contaRes, { 'Conta criada': (res) => res.status === 201 });
}

export function AcharContasPorCpf(cpf: string, authToken: string): Conta[] { 
    let contasRes = http.get(`${BASE_URL}/contas/clientes/${cpf}`, authHeaders(authToken));
    check(contasRes, { 'Lista de contas obtida': (res) => res.status === 200 });
    return contasRes.json() as unknown as Conta[];
}

export function PostDeposito(contaId: string, valor: number, authToken: string): void {
    const depositoPayload = { valor, contaDestinoId: contaId, tipoDeTransacao: TipoDeTransacao.DEPOSITO, contaOrigemId: "" } as TransacaoPayload;
    var depositoRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(depositoPayload), authHeaders(authToken));
    check(depositoRes, { 'Depósito realizado': (res) => res.status === 201 });
}

export function PostSaque(contaId: string, valor: number, authToken: string): void {
    const depositoPayload = { valor, contaOrigemId: contaId, tipoDeTransacao: TipoDeTransacao.SAQUE, contaDestinoId: "" } as TransacaoPayload;
    var depositoRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(depositoPayload), authHeaders(authToken));
    check(depositoRes, { 'Saque realizado': (res) => res.status === 201 });
}

export function PostTransferencia(contaOrigemId: string, contaDestinoId: string, valor: number, authToken: string): void {
    const depositoPayload = { valor, contaOrigemId, tipoDeTransacao: TipoDeTransacao.TRANSFERENCIA, contaDestinoId } as TransacaoPayload;
    var depositoRes = http.post(`${BASE_URL}/transacoes`, JSON.stringify(depositoPayload), authHeaders(authToken));
    check(depositoRes, { 'Transferência realizada': (res) => res.status === 201 });
}

export function GetConta(contaId: string, authToken: string): Conta {
    let contaRes = http.get(`${BASE_URL}/contas/${contaId}`, authHeaders(authToken));
    check(contaRes, { 'Conta obtida': (res) => res.status === 200 });
    return contaRes.json() as unknown as Conta;
}

export function GetTransacoes(contaId: string, authToken: string): Transacao[] {
    let transacoesRes = http.get(`${BASE_URL}/transacoes?contaId${contaId}`, authHeaders(authToken));
    check(transacoesRes, { 'Lista de transações obtida': (res) => res.status === 200 });
    return transacoesRes.json() as unknown as Transacao[];
}

export function LoginGerente(loginPayload: LoginPayload): AuthTokenDTO {
    let loginRes = http.post(`${BASE_URL}/auth/login/gerentes`, JSON.stringify(loginPayload), { headers: { 'Content-Type': 'application/json' } });
    check(loginRes, { 'Login bem-sucedido': (res) => res.status === 200 });
    return loginRes.json() as unknown as AuthTokenDTO;
}

function authHeaders(authToken: string) {
    return { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' } };
}
