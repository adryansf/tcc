package iff.tcc.ajustado.repository;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ClienteRepository implements PanacheRepositoryBase<Cliente, UUID> {

    public List<Cliente> listar(int quantidade) {
        return findAll().range(0, quantidade-1).list();
    }

    public Cliente findByCpf(String cpf) {
        return find("cpf", cpf).singleResultOptional()
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado"));
    }

    public Cliente findByEmail(String email) {
        return find("email", email).singleResultOptional()
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado"));
    }

    public boolean existsByCpf(String cpf) {
        return find("cpf", cpf).count() > 0;
    }

    public boolean existsByEmailOrCpf(String email, String cpf) {
        return find("email", email).count() > 0 || find("cpf", cpf).count() > 0;
    }
}
