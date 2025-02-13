package iff.tcc.ajustado.repository;

import iff.tcc.ajustado.entity.Agencia;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class AgenciaRepository implements PanacheRepositoryBase<Agencia, UUID> {
}
