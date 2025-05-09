package iff.tcc.ajustado.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "\"Agencia\"")
@Data
public class Agencia extends EntidadeBase {
    @Column(name = "\"nome\"", nullable = false)
    private String nome;
    @Column(name = "\"telefone\"")
    private String telefone;
    @Column(name = "\"numero\"", nullable = false)
    private String numero;
}
