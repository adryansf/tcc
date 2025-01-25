-- Criação das tabelas
CREATE TABLE "Cliente" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" varchar NOT NULL,
  "cpf" varchar UNIQUE NOT NULL,
  "telefone" varchar,
  "dataDeNascimento" date,
  "email" varchar UNIQUE NOT NULL,
  "senha" varchar NOT NULL,
  "dataDeCriacao" timestamp DEFAULT CURRENT_TIMESTAMP,
  "dataDeAtualizacao" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Gerente" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "idAgencia" UUID NOT NULL,
  "nome" varchar NOT NULL,
  "cpf" varchar UNIQUE NOT NULL,
  "telefone" varchar,
  "dataDeNascimento" date,
  "email" varchar UNIQUE NOT NULL,
  "senha" varchar NOT NULL,
  "dataDeCriacao" timestamp DEFAULT CURRENT_TIMESTAMP,
  "dataDeAtualizacao" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Endereco" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "logradouro" varchar NOT NULL,
  "numero" varchar NOT NULL,
  "bairro" varchar NOT NULL,
  "cidade" varchar NOT NULL,
  "uf" varchar NOT NULL,
  "complemento" varchar,
  "cep" varchar NOT NULL,
  "idCliente" UUID NOT NULL,
  "dataDeCriacao" timestamp DEFAULT CURRENT_TIMESTAMP,
  "dataDeAtualizacao" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Agencia" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" varchar NOT NULL,
  "telefone" varchar,
  "numero" varchar UNIQUE NOT NULL,
  "dataDeCriacao" timestamp DEFAULT CURRENT_TIMESTAMP,
  "dataDeAtualizacao" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Conta" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "numero" varchar UNIQUE NOT NULL,
  "saldo" decimal(15, 2) NOT NULL DEFAULT 0.00,
  "tipo" varchar NOT NULL, -- Tipo será tratado no back-end
  "idAgencia" UUID NOT NULL,
  "idCliente" UUID NOT NULL,
  "dataDeCriacao" timestamp DEFAULT CURRENT_TIMESTAMP,
  "dataDeAtualizacao" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Transacao" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "valor" decimal(15, 2) NOT NULL,
  "data" timestamp DEFAULT CURRENT_TIMESTAMP,
  "tipo" varchar NOT NULL, -- Tipo será tratado no back-end
  "idContaOrigem" UUID NOT NULL,
  "idContaDestino" UUID NOT NULL,
  "dataDeCriacao" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Definição de relações
ALTER TABLE "Gerente" 
  ADD CONSTRAINT "fk_gerente_agencia" FOREIGN KEY ("idAgencia") REFERENCES "Agencia" ("id");

ALTER TABLE "Endereco" 
  ADD CONSTRAINT "fk_endereco_cliente" FOREIGN KEY ("idCliente") REFERENCES "Cliente" ("id");

ALTER TABLE "Conta" 
  ADD CONSTRAINT "fk_conta_agencia" FOREIGN KEY ("idAgencia") REFERENCES "Agencia" ("id");

ALTER TABLE "Conta" 
  ADD CONSTRAINT "fk_conta_cliente" FOREIGN KEY ("idCliente") REFERENCES "Cliente" ("id");

ALTER TABLE "Transacao" 
  ADD CONSTRAINT "fk_transacao_conta_origem" FOREIGN KEY ("idContaOrigem") REFERENCES "Conta" ("id");

ALTER TABLE "Transacao" 
  ADD CONSTRAINT "fk_transacao_conta_destino" FOREIGN KEY ("idContaDestino") REFERENCES "Conta" ("id");

-- Trigger para atualização automática de timestamps
CREATE OR REPLACE FUNCTION atualizar_data_de_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW."dataDeAtualizacao" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar triggers para tabelas relevantes
CREATE TRIGGER trigger_update_cliente
BEFORE UPDATE ON "Cliente"
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_de_atualizacao();

CREATE TRIGGER trigger_update_gerente
BEFORE UPDATE ON "Gerente"
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_de_atualizacao();

CREATE TRIGGER trigger_update_endereco
BEFORE UPDATE ON "Endereco"
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_de_atualizacao();

CREATE TRIGGER trigger_update_agencia
BEFORE UPDATE ON "Agencia"
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_de_atualizacao();

CREATE TRIGGER trigger_update_conta
BEFORE UPDATE ON "Conta"
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_de_atualizacao();