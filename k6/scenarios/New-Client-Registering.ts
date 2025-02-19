import http from 'k6/http';
import { check, sleep } from 'k6';
import { CriarClienteDTO, LoginPayload, CriarEnderecoDTO, CriarContaDTO } from '../entities/DTO/DTOS';


export let options = {
    vus: 1, // Número de usuários simultâneos
    duration: '5s', // Tempo de execução do teste
  };
  
  const BASE_URL = 'http://localhost:8080';

export default function () {
    // 1. Cadastrar cliente
    const cliente = {
        nome: "Matheuszao",
        telefone: "22997012046",
        cpf: "75192571855",
        dataDeNascimento: "2001-01-01",
        email: "matheuszao@gmail.com",
        senha: "12345678"
    } as CriarClienteDTO
    
    const clienteHeaders = { headers: { 'Content-Type': 'application/json' } };
    let clienteRes = http.post(`${BASE_URL}/clientes`, JSON.stringify(cliente), clienteHeaders);
    check(clienteRes, { 'Cadastro de cliente bem-sucedido': (res) => res.status === 201 });

    // 2. Login do cliente
    const loginPayload = {email: cliente.email, senha: cliente.senha} as LoginPayload;
    let loginRes = http.post(`${BASE_URL}/auth/login/clientes`, JSON.stringify(loginPayload), clienteHeaders);
    check(loginRes, { 'Login bem-sucedido': (res) => res.status === 200 });

    let authToken = loginRes.json('token');
    let authHeaders = { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' } };

    // 3. Criar endereço
    const endereco = {logradouro: 'Rua Teste', numero: 100, cidade: 'Cidade Teste', uf: 'SP', cep: '12345-678', complemento: "", bairro: "teste"} as CriarEnderecoDTO;
    let enderecoRes = http.post(`${BASE_URL}/enderecos`, JSON.stringify(endereco), authHeaders);
    check(enderecoRes, { 'Endereço cadastrado': (res) => res.status === 201 });

    // 4. Buscar agências
    let agenciasRes = http.get(`${BASE_URL}/agencias`, authHeaders);
    check(agenciasRes, { 'Lista de agências obtida': (res) => res.status === 200 });

    let agencias = agenciasRes.json();
    console.log(agencias);
   // let agenciaId = agencias?.length > 0 ? agencias[0].id : null;

    // if (agenciaId) {
    //     // 5. Criar conta
    //     const contaPayload = {tipo: "POUPANCA", idCliente: } as CriarContaDTO;
    //     let contaRes = http.post(`${BASE_URL}/contas`, JSON.stringify(contaPayload), authHeaders);
    //     check(contaRes, { 'Conta criada': (res) => res.status === 201 });
    // }

    sleep(1); // Espera entre execuções para simular usuários reais
}