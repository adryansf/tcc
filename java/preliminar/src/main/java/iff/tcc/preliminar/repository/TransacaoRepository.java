package iff.tcc.preliminar.repository;

import iff.tcc.preliminar.entity.Conta;
import iff.tcc.preliminar.entity.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TransacaoRepository extends JpaRepository<Transacao, UUID> {
    @Query("SELECT t FROM Transacao t WHERE t.contaDestino = ?1 OR t.contaOrigem = ?1")
    List<Transacao> findByConta(Conta conta);
}
