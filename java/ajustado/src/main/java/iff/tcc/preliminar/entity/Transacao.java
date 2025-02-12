package iff.tcc.preliminar.entity;

import iff.tcc.preliminar.entity.enums.TipoDeTransacao;
import jakarta.persistence.*;
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
