package iff.tcc.preliminar.service.interfaces;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;

import java.util.UUID;

public interface ClienteService {
    Future<JsonObject> getClientById(UUID id);
}
