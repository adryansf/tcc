package iff.tcc.ajustado.repository;

import iff.tcc.ajustado.entity.Transacao;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;

import java.util.UUID;

public class TransacaoRepository implements PanacheRepositoryBase<Transacao, UUID> {
}
