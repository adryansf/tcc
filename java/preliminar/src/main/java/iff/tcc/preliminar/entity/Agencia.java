package iff.tcc.preliminar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Agencia")
@Data
public class Agencia extends EntidadeBase {
    private String nome;
    private String telefone;
    private int numero;
}
