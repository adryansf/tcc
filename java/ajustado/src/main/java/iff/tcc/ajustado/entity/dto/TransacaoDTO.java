package iff.tcc.ajustado.entity.dto;

import iff.tcc.ajustado.entity.enums.TipoDeTransacao;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TransacaoDTO {
    private long valor;
    private UUID contaOrigemId;
    private UUID contaDestinoId;
    private TipoDeTransacao tipo;
}
