package iff.tcc.preliminar;
import iff.tcc.preliminar.verticle.MainVerticle;
import io.vertx.core.Vertx;

public class Main {
    public static void main(String[] args) {
        Vertx vertx = Vertx.vertx();
        vertx.deployVerticle(new MainVerticle(), res -> {
            if (res.succeeded()) {
                System.out.println("✅ Aplicação iniciada com sucesso!");
            } else {
                System.err.println("❌ Falha ao iniciar a aplicação: " + res.cause().getMessage());
            }
        });
    }
}
