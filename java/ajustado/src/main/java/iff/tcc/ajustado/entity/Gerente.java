package iff.tcc.ajustado.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name = "Gerente")
public class Gerente extends EntidadeBase {
    private String nome;
    private String cpf;
    private String telefone;
    private Date dataDeNascimento;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;
    @JoinColumn(name = "idAgencia")
    @ManyToOne
    private Agencia agencia;
}
