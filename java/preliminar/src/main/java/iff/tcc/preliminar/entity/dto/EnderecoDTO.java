package iff.tcc.preliminar.entity.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EnderecoDTO {
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private String cep;
    private LocalDateTime dataDeCriacao;
    private LocalDateTime dataDeAtualizacao;
}
