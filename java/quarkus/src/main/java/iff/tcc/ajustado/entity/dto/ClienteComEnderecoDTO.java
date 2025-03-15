package iff.tcc.ajustado.entity.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
public class ClienteComEnderecoDTO {
    private UUID id;
    private String nome;
    private String cpf;
    private String telefone;
    private Date dataDeNascimento;
    private String email;
    private EnderecoDTO endereco;
    private LocalDateTime dataDeCriacao;
    private LocalDateTime dataDeAtualizacao;
}
