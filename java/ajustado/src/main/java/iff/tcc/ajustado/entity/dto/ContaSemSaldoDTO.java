package iff.tcc.ajustado.entity.dto;

import iff.tcc.ajustado.entity.Agencia;
import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.enums.TipoDeConta;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ContaSemSaldoDTO {
    private UUID id;
    private LocalDateTime dataDeCriacao;
    private LocalDateTime dataDeAtualizacao;
    private Integer numero;
    @Enumerated(EnumType.STRING)
    private TipoDeConta tipo;
    private Agencia agencia;
    private Cliente cliente;
}
