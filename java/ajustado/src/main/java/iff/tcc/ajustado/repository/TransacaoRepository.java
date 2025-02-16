package iff.tcc.ajustado.repository;

import iff.tcc.ajustado.entity.Transacao;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class TransacaoRepository implements PanacheRepositoryBase<Transacao, UUID> {
}
