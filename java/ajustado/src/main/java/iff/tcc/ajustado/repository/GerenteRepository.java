package iff.tcc.ajustado.repository;

import iff.tcc.ajustado.entity.Gerente;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class GerenteRepository implements PanacheRepositoryBase<Gerente, UUID> {
    public Gerente findByCpf(String cpf) {
        return find("cpf", cpf).singleResultOptional()
                .orElseThrow(() -> new NaoEncontradoException("Gerente não encontrado"));
    }

    public Gerente findByEmail(String email) {
        return find("email", email).singleResultOptional()
                .orElseThrow(() -> new NaoEncontradoException("Gerente não encontrado"));
    }

    public boolean existsByCpfOrEmail(String cpf, String email) {
        return find("cpf", cpf).count() > 0 || find("email", email).count() > 0;
    }
}
