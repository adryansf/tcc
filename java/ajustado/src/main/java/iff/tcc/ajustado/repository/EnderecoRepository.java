package iff.tcc.ajustado.repository;

import iff.tcc.ajustado.entity.Endereco;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class EnderecoRepository implements PanacheRepositoryBase<Endereco, UUID> {
}
