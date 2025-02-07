package iff.tcc.preliminar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.sql.Date;

@Entity
@Data
@Table(name = "Gerente")
public class Gerente extends EntidadeBase {
    private String nome;
    private String cpf;
    private String telefone;
    private Date dataDeNascimento;
    private String email;
    private String senha;
    @JoinColumn(name = "idAgencia")
    @ManyToOne
    private Agencia agencia;
}
