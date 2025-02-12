package iff.tcc.preliminar.verticle;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;

public class MainVerticle extends AbstractVerticle {
    @Override
    public void start(Promise<Void> startPromise) {
        vertx.deployVerticle(new ClienteVerticle(), res1 -> {
            if (res1.succeeded()) {
                vertx.deployVerticle(new ClientHttpVerticle(), res2 -> {
                    if (res2.succeeded()) {
                        startPromise.complete();
                        System.out.println("✅ Todos os verticles foram iniciados!");
                    } else {
                        startPromise.fail(res2.cause());
                    }
                });
            } else {
                startPromise.fail(res1.cause());
            }
        });
    }
}
