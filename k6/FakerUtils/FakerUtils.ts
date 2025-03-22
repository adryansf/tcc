import faker from "k6/x/faker";
import { CriarClienteDTO, CriarEnderecoDTO } from '../entities/DTO/DTOS.ts';
import cpf from 'k6/x/cpf';

export function gerarClienteAleatorio(): CriarClienteDTO {
    return {
        nome: faker.person.name(),
        cpf: cpf.cpf(false), // CPF com 11 dígitos
        telefone: faker.person.phone() + '1', // Número no formato brasileiro sem formatação
        dataDeNascimento: faker.time.dateRange("1970-01-01","2024-03-13","yyyy-MM-dd"), 
        email: faker.person.email().toLowerCase(),
        senha: '12345678'
    };
}

export function gerarCPFValido(): string {
    return cpf.cpf(false);
}

export function gerarEnderecoAleatorio(): CriarEnderecoDTO {
    return {
        logradouro: faker.address.streetName(),
        numero: faker.address.streetNumber(),
        complemento: "",
        bairro: "Centro",
        cidade: faker.address.city(),
        uf: faker.address.stateAbbreviation(),
        cep: "28950000"
    };
}