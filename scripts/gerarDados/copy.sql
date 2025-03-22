\copy "Agencia"("id", "nome", "telefone", "numero", "dataDeCriacao", "dataDeAtualizacao")
FROM 'agencias.csv'
DELIMITER ','
CSV HEADER;

\copy "Cliente"("id", "cpf", "email", "nome", "telefone", "dataDeNascimento", "senha", "dataDeCriacao", "dataDeAtualizacao")
FROM 'clientes.csv'
DELIMITER ','
CSV HEADER;

\copy "Endereco"("id", "logradouro", "numero", "bairro", "cidade", "uf", "cep", "idCliente", "dataDeCriacao", "dataDeAtualizacao")
FROM 'enderecos.csv'
DELIMITER ','
CSV HEADER;

\copy "Gerente"("id", "idAgencia", "cpf", "email", "nome", "telefone", "dataDeNascimento", "senha", "dataDeCriacao", "dataDeAtualizacao")
FROM 'gerentes.csv'
DELIMITER ','
CSV HEADER;

\copy "Conta"("id", "numero", "saldo", "tipo", "idAgencia", "idCliente", "dataDeCriacao", "dataDeAtualizacao")
FROM 'contas.csv'
DELIMITER ','
CSV HEADER;

\copy "Transacao"("id", "valor", "tipo", "idContaOrigem", "idContaDestino", "dataDeCriacao")
FROM 'transacoes.csv'
DELIMITER ','
CSV HEADER;

--- Esse script precisa rodar na linha de comando, dentro da pasta do gerarDados, de o comando psql postgresql://tcc_user:tcc_password@localhost:5432/tcc_db antes