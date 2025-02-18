package iff.tcc.ajustado.repository;

import iff.tcc.ajustado.entity.Transacao;
import iff.tcc.ajustado.entity.dto.ContaSemSaldoDTO;
import iff.tcc.ajustado.entity.dto.TransacaoContaSemSaldoDTO;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class TransacaoRepository implements PanacheRepositoryBase<Transacao, UUID> {

    public List<TransacaoContaSemSaldoDTO> findByConta(UUID contaId) {
        List<Transacao> transacoes = find("contaOrigem.id = ?1 OR contaDestino.id = ?1", contaId).list();
        return transacoes.stream()
                .map(this::mapToDTO)
                .toList();
    }

    private TransacaoContaSemSaldoDTO mapToDTO(Transacao transacao) {
        return TransacaoContaSemSaldoDTO.builder()
                .id(transacao.getId())
                .dataDeCriacao(transacao.getDataDeCriacao())
                .contaOrigem(transacao.getContaOrigem() != null
                        ? ContaSemSaldoDTO.builder()
                        .numero(transacao.getContaDestino().getNumero())
                        .tipo(transacao.getContaDestino().getTipo())
                        .id(transacao.getContaDestino().getId())
                        .cliente(transacao.getContaDestino().getCliente())
                        .agencia(transacao.getContaDestino().getAgencia())
                        .dataDeAtualizacao(transacao.getContaDestino().getDataDeAtualizacao())
                        .dataDeCriacao(transacao.getContaDestino().getDataDeCriacao())
                        .build()
                        : null)
                .contaDestino(transacao.getContaDestino() != null
                        ? ContaSemSaldoDTO.builder()
                        .numero(transacao.getContaDestino().getNumero())
                        .tipo(transacao.getContaDestino().getTipo())
                        .id(transacao.getContaDestino().getId())
                        .cliente(transacao.getContaDestino().getCliente())
                        .agencia(transacao.getContaDestino().getAgencia())
                        .dataDeAtualizacao(transacao.getContaDestino().getDataDeAtualizacao())
                        .dataDeCriacao(transacao.getContaDestino().getDataDeCriacao())
                        .build()
                        : null)
                .tipo(transacao.getTipo())
                .build();
    }

}
