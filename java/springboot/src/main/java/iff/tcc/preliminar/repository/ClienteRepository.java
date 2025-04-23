package iff.tcc.preliminar.repository;

import iff.tcc.preliminar.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
    Optional<Cliente> findByCpf(String cpf);

    Optional<Cliente> findByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByEmailOrCpf(String email, String cpf);

}
