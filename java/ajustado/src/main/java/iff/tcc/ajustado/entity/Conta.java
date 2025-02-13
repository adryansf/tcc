package iff.tcc.ajustado.entity;

import iff.tcc.ajustado.entity.enums.TipoDeConta;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Conta")
@Data
public class Conta extends EntidadeBase {
    private String numero;
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
