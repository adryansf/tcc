package iff.tcc.preliminar.util;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import jakarta.persistence.Persistence;
import org.hibernate.reactive.stage.Stage.SessionFactory;
import io.vertx.core.Promise;

public class HibernateReactiveUtil {
    private static SessionFactory sessionFactory;

    public static Future<SessionFactory> getSessionFactory(Vertx vertx) {
        if (sessionFactory != null) {
            return Future.succeededFuture(sessionFactory);
        }

        Promise<SessionFactory> promise = Promise.promise();

        vertx.<SessionFactory>executeBlocking(future -> {
                    try {
                        sessionFactory = (SessionFactory) Persistence
                                .createEntityManagerFactory("bankingPU")
                                .unwrap(SessionFactory.class);
                        future.complete(sessionFactory);
                    } catch (Exception e) {
                        future.fail(e);
                    }
                }).onSuccess(promise::complete)
                .onFailure(promise::fail);

        return promise.future();
    }
}
