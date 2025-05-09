package iff.tcc.ajustado.entity;

import iff.tcc.ajustado.entity.enums.TipoDeTransacao;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "\"Transacao\"")
@Data
public class Transacao {
    @Id
    @UuidGenerator
    private UUID id;
    @Column(name = "\"dataDeCriacao\"", insertable = false)
    private LocalDateTime dataDeCriacao;
    @Column(name = "\"valor\"", nullable = false)
    private long valor;
    @ManyToOne
    @JoinColumn(name = "\"idContaOrigem\"")
    private Conta contaOrigem;
    @ManyToOne
    @JoinColumn(name = "\"idContaDestino\"")
    private Conta contaDestino;
    @Enumerated(EnumType.STRING)
    @Column(name = "\"tipo\"", nullable = false)
    private TipoDeTransacao tipo;
}
