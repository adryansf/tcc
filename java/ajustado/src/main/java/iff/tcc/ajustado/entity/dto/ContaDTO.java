package iff.tcc.ajustado.entity.dto;

import iff.tcc.ajustado.entity.enums.TipoDeConta;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ContaDTO {
    private TipoDeConta tipo;
    private UUID idAgencia;
    private UUID idCliente;
}
