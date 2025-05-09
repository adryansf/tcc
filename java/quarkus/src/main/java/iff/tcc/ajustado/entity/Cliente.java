package iff.tcc.ajustado.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;


@Entity
@Data
@Table(name = "\"Cliente\"")
public class Cliente extends EntidadeBase {
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
}
