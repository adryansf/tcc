package iff.tcc.preliminar.repository;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Conta;
import iff.tcc.preliminar.entity.dto.ContaSemSaldoProjection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContaRepository extends JpaRepository<Conta, UUID> {

    List<ContaSemSaldoProjection> findAllByCliente(Cliente cliente);
}
