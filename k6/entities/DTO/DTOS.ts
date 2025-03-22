export interface AuthTokenDTO {
    expiraEm: number;
    token: string;
    usuario: any;
}

export interface ErrorDTO{
    message?: string;
}


export interface CriarClienteDTO {
    nome: string;
    cpf: string;
    telefone: string;
    dataDeNascimento: string;
    email: string;
    senha: string;
}

import { TipoDeConta } from "../enum/TipoDeConta";
import { TipoDeTransacao } from "../enum/TipoDeTransacao";

export interface CriarContaDTO {
    tipo: TipoDeConta;
    idAgencia?: string;
    idCliente?: string;
}


export interface CriarEnderecoDTO {
    logradouro: string;
    numero: number;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
}

export interface LoginPayload {
    email: string;
    senha: string;
}

export interface TransacaoPayload {
    valor: number;
    idContaDestino: string;
    idContaOrigem: string;
    tipo: TipoDeTransacao;
}