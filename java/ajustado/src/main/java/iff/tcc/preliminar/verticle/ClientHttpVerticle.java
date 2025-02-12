package iff.tcc.preliminar.verticle;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;


public class ClientHttpVerticle extends AbstractVerticle {

    @Override
    public void start() {
        Router router = Router.router(vertx);
        router.get("/cliente/:id").handler(this::buscarCliente);

        vertx.createHttpServer()
                .requestHandler(router)
                .listen(8080, http -> {
                    if (http.succeeded()) {
                        System.out.println("🚀 Servidor rodando na porta 8080!");
                    } else {
                        System.out.println("❌ Falha ao iniciar o servidor: " + http.cause().getMessage());
                    }
                });
    }

    private void buscarCliente(RoutingContext ctx) {
        JsonObject request = new JsonObject().put("id", ctx.pathParam("id"));
        vertx.eventBus().request("service.cliente.buscar", request, reply -> {
            if (reply.succeeded()) {
                ctx.json(reply.result().body());
            } else {
                ctx.fail(500);
            }
        });
    }

}
