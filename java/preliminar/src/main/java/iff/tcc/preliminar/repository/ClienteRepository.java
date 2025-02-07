package iff.tcc.preliminar.repository;

import iff.tcc.preliminar.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
    Optional<Cliente> findClienteByCpf(String cpf);
}
