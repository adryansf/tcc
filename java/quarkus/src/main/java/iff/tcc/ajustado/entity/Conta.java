package iff.tcc.ajustado.entity;

import iff.tcc.ajustado.entity.enums.TipoDeConta;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "\"Conta\"")
@Data
public class Conta extends EntidadeBase {
    @Column(name = "\"numero\"", nullable = false, insertable = false)
    private Integer numero;
    @Column(name = "\"saldo\"", nullable = false)
    private long saldo;
    @Enumerated(EnumType.STRING)
    @Column(name = "\"tipo\"", nullable = false)
    private TipoDeConta tipo;
    @ManyToOne
    @JoinColumn(name = "\"idAgencia\"", nullable = false)
    private Agencia agencia;
    @ManyToOne
    @JoinColumn(name = "\"idCliente\"", nullable = false)
    private Cliente cliente;
}
