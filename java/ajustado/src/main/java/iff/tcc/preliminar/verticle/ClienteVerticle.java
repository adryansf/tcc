package iff.tcc.preliminar.verticle;
import iff.tcc.preliminar.repository.ClienteRepository;
import iff.tcc.preliminar.service.impl.ClienteServiceImpl;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import iff.tcc.preliminar.service.interfaces.ClienteService;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@RequiredArgsConstructor
public class ClienteVerticle extends AbstractVerticle {

    ClienteRepository clienteRepository = new ClienteRepository();
    ClienteService clienteService = new ClienteServiceImpl(vertx, clienteRepository);

    @Override
    public void start() {

        vertx.eventBus().consumer("service.cliente.buscar", this::buscarCliente);

        System.out.println("✅ ClienteService registrado no EventBus!");
    }

    private void buscarCliente(Message<JsonObject> message) {
        var id = UUID.fromString(message.body().getString("id"));

        clienteService.getClientById(id)
                .onSuccess(cliente -> message.reply(JsonObject.mapFrom(cliente)))
                .onFailure(err -> message.fail(500, err.getMessage()));
    }
}
