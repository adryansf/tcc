package iff.tcc.preliminar.repository;

import io.vertx.core.Future;
import io.vertx.core.Promise;
import iff.tcc.preliminar.entity.Cliente;

import java.util.List;
import java.util.UUID;

public class ClienteRepository {

    // 🔹 Buscar cliente por ID (não bloqueante)
    public Future<Cliente> buscarPorId(UUID id) {
        Promise<Cliente> promise = Promise.promise();
        promise.complete(new Cliente());
        return promise.future();
    }
}
