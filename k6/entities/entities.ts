import { TipoDeTransacao } from "./enum/TipoDeTransacao"

export interface Conta {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao: string
  numero: number
  saldo: number
  tipo: string
  agencia: Agencia
  cliente: Cliente
}

export interface Agencia {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao: string
  nome: string
  telefone: string
  numero: string
}

export interface Cliente {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao: string
  nome: string
  cpf: string
  telefone: string
  dataDeNascimento: string
  email: string
  senha?: string
}

export interface Transacao {
  id: string
  dataDeCriacao: string
  contaOrigem: Conta
  contaDestino: Conta
  tipo: TipoDeTransacao
}

export interface Gerente {
  nome: string;
  cpf: string;
  telefone: string;
  dataDeNascimento: string;
  email: string;
  senha?: string;
  agencia: Agencia;
}
