package iff.tcc.ajustado.entity.dto;

import lombok.Builder;
import lombok.Data;

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
}
