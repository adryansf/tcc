package iff.tcc.preliminar.repository;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EnderecoRepository extends JpaRepository<Endereco, UUID> {
    Optional<Endereco> findByCliente(Cliente cliente);
}
