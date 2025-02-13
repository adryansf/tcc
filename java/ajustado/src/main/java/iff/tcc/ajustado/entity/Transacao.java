package iff.tcc.ajustado.entity;

import iff.tcc.ajustado.entity.enums.TipoDeTransacao;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Table(name = "Transacao")
@Data
public class Transacao extends EntidadeBase {
    private long valor;
    @ManyToOne
    @JoinColumn(name = "idContaOrigem")
    private Conta contaOrigem;
    @ManyToOne
    @JoinColumn(name = "idContaDestino")
    private Conta contaDestino;
    private Timestamp data;
    @Enumerated(EnumType.STRING)
    private TipoDeTransacao tipo;
}
