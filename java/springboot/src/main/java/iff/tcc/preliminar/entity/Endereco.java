package iff.tcc.preliminar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "\"Endereco\"")
@Data
public class Endereco extends EntidadeBase {
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private String cep;
    @JoinColumn(name = "\"idCliente\"")
    @OneToOne
    private Cliente cliente;
}
