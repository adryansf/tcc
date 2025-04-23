package iff.tcc.preliminar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;


@Entity
@Data
@Table(name = "\"Gerente\"")
public class Gerente extends EntidadeBase {
    @Column(name = "\"nome\"", nullable = false)
    private String nome;
    @Column(name = "\"cpf\"", nullable = false)
    private String cpf;
    @Column(name = "\"telefone\"")
    private String telefone;
    @Column(name = "\"dataDeNascimento\"")
    private Date dataDeNascimento;
    @Column(name = "\"email\"", nullable = false)
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "\"senha\"", nullable = false)
    private String senha;
    @JoinColumn(name = "\"idAgencia\"", nullable = false)
    @ManyToOne
    private Agencia agencia;
}

