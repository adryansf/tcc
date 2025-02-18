package iff.tcc.ajustado.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;


@Entity
@Data
@Table(name = "Cliente")
public class Cliente extends EntidadeBase {
    private String nome;
    private String cpf;
    private String telefone;
    private Date dataDeNascimento;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;
}
