package iff.tcc.ajustado.entity.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
@Builder
public class GerenteDTO {
    private String nome;
    private String cpf;
    private String telefone;
    private Date dataDeNascimento;
    private String email;
    private String senha;
    private UUID agenciaId;
}
