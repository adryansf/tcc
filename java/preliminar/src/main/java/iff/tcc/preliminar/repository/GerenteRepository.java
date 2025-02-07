package iff.tcc.preliminar.repository;

import iff.tcc.preliminar.entity.Gerente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GerenteRepository extends JpaRepository<Gerente, UUID> {
    Optional<Gerente> findByCpf(String cpf);

    Optional<Gerente> findByEmail(String email);
}
