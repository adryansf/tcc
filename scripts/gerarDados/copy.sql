\copy "Agencia"("id", "nome", "telefone", "numero", "dataDeCriacao", "dataDeAtualizacao") FROM './Agencia.csv' DELIMITER ',' CSV HEADER;

\copy "Cliente"("id", "cpf", "email", "nome", "telefone", "dataDeNascimento", "senha", "dataDeCriacao", "dataDeAtualizacao") FROM './Cliente.csv' DELIMITER ',' CSV HEADER;

\copy "Endereco"("id", "logradouro", "numero", "bairro", "cidade", "uf", "cep", "idCliente", "dataDeCriacao", "dataDeAtualizacao") FROM './Endereco.csv' DELIMITER ',' CSV HEADER;

\copy "Gerente"("id", "idAgencia", "cpf", "email", "nome", "telefone", "dataDeNascimento", "senha", "dataDeCriacao", "dataDeAtualizacao") FROM './Gerente.csv' DELIMITER ',' CSV HEADER;

\copy "Conta"("id", "numero", "saldo", "tipo", "idAgencia", "idCliente", "dataDeCriacao", "dataDeAtualizacao") FROM './Conta.csv' DELIMITER ',' CSV HEADER;

\copy "Transacao"("id", "valor", "tipo", "idContaOrigem", "idContaDestino", "dataDeCriacao") FROM './Transacao.csv' DELIMITER ',' CSV HEADER;

UPDATE "Cliente" set "senha" = '$2b$12$GBvCw21El0LjvihntnNviebWAgYcqcUv9wNpMw0Jsn9j6UTxqUVC.';
UPDATE "Gerente" set "senha" = '$2b$12$GBvCw21El0LjvihntnNviebWAgYcqcUv9wNpMw0Jsn9j6UTxqUVC.';

--- UPDATE "Cliente" set "senha" = '$2a$10$RrXdgK7xmr2cD.raJw4LiOnqav5sg/Ogi7IiO943OoreNKjv0c51.'; ---java
---UPDATE "Gerente" set "senha" = '$2a$10$RrXdgK7xmr2cD.raJw4LiOnqav5sg/Ogi7IiO943OoreNKjv0c51.'; ---java

--- Esse script precisa rodar na linha de comando, dentro da pasta do gerarDados, de o comando psql postgresql://tcc_user:tcc_password@localhost:5432/tcc_db antes