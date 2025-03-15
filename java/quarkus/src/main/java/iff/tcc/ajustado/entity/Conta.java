package iff.tcc.ajustado.entity;

import iff.tcc.ajustado.entity.enums.TipoDeConta;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Conta")
@Data
public class Conta extends EntidadeBase {
    @Column(insertable = false)
    private Integer numero;
    private long saldo;
    @Enumerated(EnumType.STRING)
    private TipoDeConta tipo;
    @ManyToOne
    @JoinColumn(name = "idAgencia")
    private Agencia agencia;
    @ManyToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;
}
