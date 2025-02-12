package iff.tcc.preliminar.service.impl;

import iff.tcc.preliminar.repository.ClienteRepository;
import iff.tcc.preliminar.service.interfaces.ClienteService;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

public class ClienteServiceImpl implements ClienteService {
    private ClienteRepository clientRepository;

    public ClienteServiceImpl(Vertx vertx, ClienteRepository clientRepository) {
        this.clientRepository = clientRepository;
    }



    @Override
    public Future<JsonObject> getClientById(UUID id) {
        return clientRepository.buscarPorId(id)
                .map(JsonObject::mapFrom);
    }
}
