package iff.tcc.preliminar.repository;

import iff.tcc.preliminar.entity.Agencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AgenciaRepository extends JpaRepository<Agencia, UUID> {
}
