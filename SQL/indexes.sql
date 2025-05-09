CREATE INDEX idx_transacao_idContaOrigem ON "Transacao" ("idContaOrigem");
CREATE INDEX idx_transacao_idContaDestino ON "Transacao" ("idContaDestino");

CREATE INDEX idx_conta_idCliente ON "Conta" ("idCliente");